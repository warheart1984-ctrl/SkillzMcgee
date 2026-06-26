/**
 * Federation tick — runs substration engine against live continuity state
 */

import { SubstrationEngine } from "../substrations/engine.js";
import { substrations } from "../substrations/registry.js";
import { getContinuityState } from "../cosmic/continuity_state.js";
import { behaviorTick } from "../behavior/engine.js";
import { metaBehaviorTick } from "../behavior/meta_engine.js";
import { createBehaviorRules } from "../behavior/grammar.js";

const engine = new SubstrationEngine(substrations);

/**
 * @param {import('../runtime/federated_runtime.js').ReturnType<typeof import('../runtime/federated_runtime.js').createRuntime>} runtime
 */
export async function federationTick(runtime) {
  const continuity = runtime.getContinuity?.() ?? runtime.continuity;
  const continuityState = continuity
    ? getContinuityState(runtime.baseLedger, continuity)
    : runtime.getContinuityState(runtime.baseLedger);

  const ctx = {
    continuityState,
    federationConfig: runtime.getFederationConfig(),
    ledger: runtime.ledger,
    baseLedger: runtime.baseLedger,
    agents: runtime.agents,
    crk1: runtime.crk1,
    asOmega: runtime.asOmega,
  };

  const substrationResult = await engine.tick(ctx);

  if (!runtime.behaviorRules) {
    runtime.behaviorRules = createBehaviorRules();
  }

  const behaviorResult = await behaviorTick(ctx, runtime.crk1, runtime.behaviorRules);

  const cosmicStream = runtime.baseLedger?.cosmicStream ?? runtime.ledger?.readStream?.() ?? [];
  const metaResult = await metaBehaviorTick(
    runtime.crk1,
    runtime.behaviorRules,
    cosmicStream,
    runtime.ledger,
  );

  return { ...substrationResult, behavior: behaviorResult, meta: metaResult };
}

export { engine, substrations };
