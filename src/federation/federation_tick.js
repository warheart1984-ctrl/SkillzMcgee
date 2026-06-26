/**
 * Federation tick — organism layer pipeline: Mind → Will → Spine
 *
 * Fail-safe (WOLF-1): snapshot before Will; on abort restore last-known-good and
 * skip governance entirely — never recomputeGlobalRoot on half-applied state.
 */

import {
  buildTickContext,
  intelligenceTick,
  willTick,
  governanceTick,
  captureTickState,
  restoreTickState,
  engine,
  substrations,
} from "./layer_ticks.js";

/**
 * @param {import('../runtime/federated_runtime.js').ReturnType<typeof import('../runtime/federated_runtime.js').createRuntime>} runtime
 * @param {{ substrationEngine?: import('../substrations/engine.js').SubstrationEngine | { plan: Function; act: Function } }} [options]
 */
export async function federationTick(runtime, options = {}) {
  const substrationEngine = options.substrationEngine ?? engine;
  const ctx = await buildTickContext(runtime);

  const intelligence = await intelligenceTick(ctx, substrationEngine);
  const preWillSnapshot = captureTickState(runtime);

  /** @type {import('./layer_ticks.js').WillTickResult | null} */
  let will = null;
  /** @type {string | undefined} */
  let willError;
  /** @type {string | undefined} */
  let failedPhase;
  /** @type {Awaited<ReturnType<typeof governanceTick>> | null} */
  let governance = null;

  try {
    will = await willTick(ctx, runtime, intelligence, substrationEngine);
  } catch (error) {
    willError = error instanceof Error ? error.message : String(error);
    failedPhase = error?.failedPhase;
    restoreTickState(runtime, preWillSnapshot);

    const cosmic = runtime.ledger;
    cosmic.log("FEDERATION_TICK_ABORTED", {
      failedPhase,
      completedPhases: error?.completedPhases ?? [],
      message: willError,
      restored: true,
      timestamp: Date.now(),
    });

    will = {
      status: "aborted",
      behavior: null,
      substration: null,
      completedPhases: error?.completedPhases ?? [],
      failedPhase,
      error: willError,
    };
  }

  if (will.status === "complete") {
    governance = await governanceTick(ctx, runtime, { will });
  }

  return {
    needs: intelligence.needs,
    tasks: intelligence.tasks,
    intelligence,
    will,
    governance,
    meta: governance?.meta ?? null,
    ok: will.status === "complete",
    error: willError,
    failedPhase,
    actedBy: will.substration?.actedBy ?? [],
    behavior: will.behavior ?? null,
  };
}

export {
  engine,
  substrations,
  intelligenceTick,
  willTick,
  governanceTick,
  buildTickContext,
  captureTickState,
  restoreTickState,
};
