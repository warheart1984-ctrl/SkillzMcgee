import { DRIFT_THRESHOLDS } from "./constants.mjs";

export function listCrossLaneInvariants() {
  return [
    {
      invariant_id: "X-1",
      description: "Spec changes must originate from normative/architectural lanes.",
      status: "ENFORCED",
    },
    {
      invariant_id: "X-2",
      description: "Human-category messages must not enter spec lanes.",
      status: "ENFORCED",
    },
    {
      invariant_id: "X-3",
      description: "Global communication drift must remain below 0.70.",
      status: "ENFORCED",
    },
  ];
}

export function evaluateCrossLaneInvariants(ticks, lanes) {
  const laneById = new Map(lanes.map((lane) => [lane.lane_id, lane]));
  const results = [];

  const x1Violations = ticks
    .filter((tick) => tick.entry_type === "communicationTick" && tick.impact === "spec")
    .filter((tick) => {
      const lane = laneById.get(tick.lane_id);
      return !lane || !lane.allowed_categories.some((category) => ["normative", "architectural"].includes(category));
    })
    .map((tick) => ({ lane_id: tick.lane_id, tick_id: tick.id, reason: "spec_change_from_unauthorized_lane" }));
  results.push({ invariant_id: "X-1", ok: x1Violations.length === 0, violations: x1Violations });

  const x2Violations = ticks
    .filter((tick) => tick.entry_type === "communicationTick" && tick.category === "human")
    .filter((tick) => laneById.get(tick.lane_id)?.human_bandwidth === "none")
    .map((tick) => ({ lane_id: tick.lane_id, tick_id: tick.id, reason: "human_context_in_spec_lane" }));
  results.push({ invariant_id: "X-2", ok: x2Violations.length === 0, violations: x2Violations });

  const x3Violations = ticks
    .filter((tick) => (tick.drift_vector?.composite ?? 0) > 0.7)
    .map((tick) => ({ lane_id: tick.lane_id, tick_id: tick.id, reason: "global_drift_ceiling_exceeded" }));
  results.push({ invariant_id: "X-3", ok: x3Violations.length === 0, violations: x3Violations });

  return results.map((result) => ({
    entry_type: "crossLaneInvariantTick",
    timestamp: new Date().toISOString(),
    ...result,
    thresholds: DRIFT_THRESHOLDS,
  }));
}
