import { IMPACT_ORDER } from "./constants.mjs";

export function canGenerateReply(laneContract, currentDrift, proposedReplyMeta) {
  const corridorViolations = [];
  if (!laneContract.allowed_categories.includes(proposedReplyMeta.category)) {
    corridorViolations.push("category_out_of_corridor");
  }
  if (!laneContract.allowed_altitudes.includes(proposedReplyMeta.altitude)) {
    corridorViolations.push("altitude_out_of_corridor");
  }
  if ((IMPACT_ORDER[proposedReplyMeta.impact] ?? 0) > (IMPACT_ORDER[laneContract.max_impact] ?? 0)) {
    corridorViolations.push("impact_exceeds_corridor");
  }
  const projectedComposite = Math.max(
    currentDrift?.composite ?? 0,
    proposedReplyMeta.projected_drift ?? 0,
  );
  const { contain, fail_closed } = laneContract.drift_thresholds;
  if (projectedComposite > fail_closed) {
    return { ok: false, reason: "would_trigger_fail_closed", corridorViolations, projectedComposite };
  }
  if (projectedComposite > contain) {
    return { ok: false, reason: "would_trigger_containment", corridorViolations, projectedComposite };
  }
  return { ok: corridorViolations.length === 0, corridorViolations, projectedComposite };
}
