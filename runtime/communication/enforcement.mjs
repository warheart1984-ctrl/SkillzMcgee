import { COMM_CONSTITUTION_VERSION, DRIFT_THRESHOLDS } from "./constants.mjs";
import { computeDriftVector } from "./communicationDrift.mjs";
import { getLaneContract, updateLaneStatus, validateTickAgainstLane } from "./laneRegistry.mjs";
import { routeMessage } from "./router.mjs";
import { updateEpochWithTick } from "./epochStore.mjs";
import { guardCommunicationIO } from "./communicationControl.mjs";

export function evaluateContinuity(continuity) {
  const score = continuity.continuity_score;
  if (score > DRIFT_THRESHOLDS.fail_closed) return { state: "FAIL_CLOSED", trigger: "continuity" };
  if (score > DRIFT_THRESHOLDS.contain) return { state: "CONTAINMENT_EPOCH", trigger: "continuity" };
  if (score > DRIFT_THRESHOLDS.notify) return { state: "NOTIFY", trigger: "continuity" };
  if (score > DRIFT_THRESHOLDS.warn) return { state: "WARN", trigger: "continuity" };
  return { state: "OK", trigger: null };
}

export function enforceCommunicationRules(tick, previousTick = null) {
  guardCommunicationIO();
  if (!tick.lane_id) throw new Error("communicationTick.lane_id is mandatory");
  const lane = getLaneContract(tick.lane_id);
  if (!lane) throw new Error(`Lane not registered: ${tick.lane_id}`);
  if (lane.status === "SUSPENDED") throw new Error(`Lane suspended: ${tick.lane_id}`);

  let working = {
    entry_type: "communicationTick",
    timestamp: new Date().toISOString(),
    targets: [],
    latency: "whenever",
    ...tick,
    comm_constitution_version: tick.comm_constitution_version ?? COMM_CONSTITUTION_VERSION,
  };

  const validation = validateTickAgainstLane(working, lane);
  const sideEffects = [];
  if (!validation.ok) {
    const routed = routeMessage(working, lane);
    sideEffects.push({
      entry_type: "communicationRerouteTick",
      timestamp: working.timestamp,
      from_lane: lane.lane_id,
      to_lane: routed.lane_id,
      reason: validation.violations[0],
      original_category: working.category,
    });
    working = routed;
  }

  working.drift_vector = {
    ...computeDriftVector(working, previousTick),
    ...(working.drift_vector ?? {}),
  };

  const effectiveLane = getLaneContract(working.lane_id) ?? lane;
  const epoch = updateEpochWithTick(effectiveLane, working);
  sideEffects.push({
    entry_type: "communicationBudgetTick",
    lane_id: working.lane_id,
    session_spent: epoch.session_spent,
    session_budget: epoch.session_budget,
    drift_added: working.drift_vector.composite,
    timestamp: working.timestamp,
  });

  if (working.drift_vector.composite > effectiveLane.continuity_budget.max_composite || epoch.status === "CONTAINED") {
    updateLaneStatus(working.lane_id, "SUSPENDED");
    sideEffects.push({
      entry_type: "continuityContainmentTick",
      timestamp: working.timestamp,
      trigger: "communication",
      lane_id: working.lane_id,
      continuity_score: working.drift_vector.composite,
      drift_vector: {
        runtime: 0,
        communication: working.drift_vector.composite,
      },
      receipts: [],
    });
  }

  return { tick: working, sideEffects, epoch };
}
