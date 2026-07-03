/**
 * Enriched lane context for API/UI — avoids circular imports in governance core.
 */
import { getLaneContext } from "./communicationGovernance.mjs";
import { getEpochBudgetSummary } from "./communicationEpochs.mjs";
import { getLanePropagationEffect } from "./communicationPropagation.mjs";
import { listRerouteEvents } from "./communicationEnforcement.mjs";
import { getCanonFreezeState } from "./canonFreeze.mjs";

export function getEnrichedLaneContext(laneId) {
  const base = getLaneContext(laneId);
  if (!base) return null;

  return {
    ...base,
    budget_summary: getEpochBudgetSummary(laneId),
    propagation_effect: getLanePropagationEffect(laneId),
    recent_reroutes: listRerouteEvents(laneId, 5),
    ...getCanonFreezeState(),
  };
}
