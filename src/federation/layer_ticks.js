/**
 * Organism layer ticks — Mind thinks → Will acts → Spine binds.
 */

import { getContinuityState } from "../cosmic/continuity_state.js";
import { behaviorTick } from "../behavior/engine.js";
import { metaBehaviorTick } from "../behavior/meta_engine.js";
import { createBehaviorRules } from "../behavior/grammar.js";
import { SubstrationEngine } from "../substrations/engine.js";
import { substrations } from "../substrations/registry.js";

const engine = new SubstrationEngine(substrations);

/**
 * @typedef {'behavior' | 'substration'} WillPhase
 */

/**
 * @typedef {Object} WillTickResult
 * @property {'complete' | 'aborted'} status
 * @property {import('../behavior/engine.js').ReturnType<typeof behaviorTick> | null} [behavior]
 * @property {{ actedBy: string[] } | null} [substration]
 * @property {WillPhase[]} completedPhases
 * @property {string} [failedPhase]
 * @property {string} [error]
 */

/**
 * @typedef {Object} GovernanceTickOptions
 * @property {WillTickResult} [will]
 */

/**
 * @param {import('../runtime/federated_runtime.js').ReturnType<typeof import('../runtime/federated_runtime.js').createRuntime>} runtime
 * @returns {Promise<import('../substrations/types.js').SubstrationContext>}
 */
export async function buildTickContext(runtime) {
  const continuity = runtime.getContinuity?.() ?? runtime.continuity;
  const continuityState = continuity
    ? getContinuityState(runtime.baseLedger, continuity)
    : runtime.getContinuityState(runtime.baseLedger);

  return {
    continuityState,
    federationConfig: runtime.getFederationConfig(),
    ledger: runtime.ledger,
    baseLedger: runtime.baseLedger,
    agents: runtime.agents,
    crk1: runtime.crk1,
    asOmega: runtime.asOmega,
  };
}

/**
 * Mind thinks — substration analysis, needs, task planning.
 * @param {import('../substrations/types.js').SubstrationContext} ctx
 * @param {SubstrationEngine} [substrationEngine]
 */
export async function intelligenceTick(ctx, substrationEngine = engine) {
  const plan = await substrationEngine.plan(ctx);
  ctx.ledger.log("INTELLIGENCE_TICK", {
    needs: plan.needs.length,
    tasks: plan.tasks.length,
    timestamp: Date.now(),
  });
  return plan;
}

/**
 * Will acts — lawful decisions and execution (behavior grammar + substration act).
 * On failure after a completed phase, logs WILL_TICK_ABORTED then rethrows with
 * `completedPhases` / `failedPhase` attached (fail loud, not silent).
 * @param {import('../substrations/types.js').SubstrationContext} ctx
 * @param {import('../runtime/federated_runtime.js').ReturnType<typeof import('../runtime/federated_runtime.js').createRuntime>} runtime
 * @param {{ needs: import('../substrations/types.js').SubstrationNeed[]; tasks: import('../substrations/types.js').SubstrationTask[] }} plan
 * @param {SubstrationEngine} [substrationEngine]
 * @returns {Promise<WillTickResult>}
 */
export async function willTick(ctx, runtime, plan, substrationEngine = engine) {
  if (!runtime.behaviorRules) {
    runtime.behaviorRules = createBehaviorRules();
  }

  /** @type {WillPhase[]} */
  const completedPhases = [];
  /** @type {Awaited<ReturnType<typeof behaviorTick>> | undefined} */
  let behavior;

  try {
    behavior = await behaviorTick(ctx, runtime.crk1, runtime.behaviorRules);
    completedPhases.push("behavior");

    const substration = await substrationEngine.act(ctx, plan);
    completedPhases.push("substration");

    ctx.ledger.log("WILL_TICK", {
      status: "complete",
      goals: behavior.goals.length,
      executed: behavior.executed,
      blocked: behavior.blocked,
      actedBy: substration.actedBy,
      completedPhases,
      timestamp: Date.now(),
    });

    return {
      status: "complete",
      behavior,
      substration,
      completedPhases,
    };
  } catch (error) {
    const failedPhase = completedPhases.includes("behavior") ? "substration" : "behavior";
    const message = error instanceof Error ? error.message : String(error);

    ctx.ledger.log("WILL_TICK_ABORTED", {
      completedPhases,
      failedPhase,
      message,
      partialBehavior: behavior
        ? { goals: behavior.goals.length, executed: behavior.executed, blocked: behavior.blocked }
        : null,
      timestamp: Date.now(),
    });

    if (error instanceof Error) {
      error.completedPhases = completedPhases;
      error.failedPhase = failedPhase;
      error.partialBehavior = behavior;
    }

    throw error;
  }
}

/**
 * Spine binds — CRK-1 law enforcement only after Will completes.
 * Never calls recomputeGlobalRoot / reconciliation on half-applied state.
 * @param {import('../substrations/types.js').SubstrationContext} ctx
 * @param {import('../runtime/federated_runtime.js').ReturnType<typeof import('../runtime/federated_runtime.js').createRuntime>} runtime
 * @param {GovernanceTickOptions} [options]
 */
export async function governanceTick(ctx, runtime, options = {}) {
  const crk1 = runtime.crk1;
  if (!runtime.behaviorRules) {
    runtime.behaviorRules = createBehaviorRules();
  }

  const stream = runtime.ledger?.readStream?.() ?? runtime.baseLedger?.cosmicStream ?? [];
  const willAbort = stream.some((e) => e.type === "WILL_TICK_ABORTED");
  const will = options.will;
  const willComplete = will?.status === "complete";
  const willIncomplete = !willComplete || will?.status === "aborted" || willAbort;

  if (willIncomplete) {
    ctx.ledger.log("GOVERNANCE_TICK_SKIPPED", {
      reason: "will_incomplete",
      willFailedPhase: will?.failedPhase ?? null,
      timestamp: Date.now(),
    });
    return {
      reconciled: [],
      globalRoot: null,
      meta: { metrics: {}, applied: 0 },
      willIncomplete: true,
      sawWillAbort: willAbort,
      skipped: true,
    };
  }

  const reconciled = crk1?.runReconciliationCycle ? await crk1.runReconciliationCycle() : [];
  const globalRoot = crk1?.recomputeGlobalRoot ? await crk1.recomputeGlobalRoot() : null;

  const meta = await metaBehaviorTick(crk1, runtime.behaviorRules, stream, runtime.ledger);

  ctx.ledger.log("GOVERNANCE_TICK", {
    willIncomplete: false,
    reconciled: reconciled.length,
    globalRoot,
    metaApplied: meta.applied,
    timestamp: Date.now(),
  });

  return {
    reconciled,
    globalRoot,
    meta,
    willIncomplete: false,
    sawWillAbort: false,
    skipped: false,
  };
}

export function restoreTickState(runtime, snapshot) {
  const stream = runtime.baseLedger?.cosmicStream;
  if (stream && snapshot.cosmicStream) {
    stream.length = 0;
    stream.push(...snapshot.cosmicStream.map((e) => ({ ...e })));
  }
  const entries = runtime.baseLedger?.entries;
  if (entries && snapshot.entries) {
    entries.length = 0;
    entries.push(...snapshot.entries.map((e) => ({ ...e })));
  }
  if (snapshot.continuity != null && runtime.setContinuity) {
    runtime.setContinuity(JSON.parse(JSON.stringify(snapshot.continuity)));
  }
}

/**
 * Snapshot cosmic ledger + continuity immediately before Will (last-known-good bind point).
 * @param {any} runtime
 */
export function captureTickState(runtime) {
  const stream = runtime.baseLedger?.cosmicStream ?? [];
  const entries = runtime.baseLedger?.entries ?? [];
  const continuity = runtime.getContinuity?.() ?? runtime.continuity ?? null;
  return {
    cosmicStream: stream.map((e) => ({
      ...e,
      payload: e.payload && typeof e.payload === "object" ? { ...e.payload } : e.payload,
    })),
    entries: entries.map((e) => ({ ...e })),
    continuity: continuity ? JSON.parse(JSON.stringify(continuity)) : null,
  };
}

export { engine, substrations };
