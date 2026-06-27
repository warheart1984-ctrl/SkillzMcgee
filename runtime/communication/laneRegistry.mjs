import { COMM_CONSTITUTION_VERSION, DRIFT_THRESHOLDS } from "./constants.mjs";
import { COMM_LANES_PATH, readJson, writeJson } from "./store.mjs";

function now() {
  return new Date().toISOString();
}

export const DEFAULT_LANES = [
  {
    lane_id: "jon-darz-architecture",
    participants: ["jon", "darz"],
    allowed_categories: ["normative", "architectural", "methodological"],
    allowed_altitudes: ["constitutional", "architectural", "engineering"],
    max_impact: "spec",
    human_bandwidth: "low",
    reroute_to: "jon-darz-human",
    continuity_budget: {
      max_composite: 0.3,
      session_budget: 0.5,
      session_spent: 0,
      reset_policy: "per-epoch",
    },
    drift_thresholds: DRIFT_THRESHOLDS,
    comm_constitution_version: COMM_CONSTITUTION_VERSION,
    status: "ACTIVE",
    created_at: now(),
    updated_at: now(),
  },
  {
    lane_id: "jon-darz-spec",
    participants: ["jon", "darz"],
    allowed_categories: ["normative", "architectural", "methodological"],
    allowed_altitudes: ["constitutional", "architectural"],
    max_impact: "spec",
    human_bandwidth: "none",
    reroute_to: "jon-darz-human",
    continuity_budget: {
      max_composite: 0.3,
      session_budget: 0.5,
      session_spent: 0,
      reset_policy: "per-epoch",
    },
    drift_thresholds: DRIFT_THRESHOLDS,
    comm_constitution_version: COMM_CONSTITUTION_VERSION,
    status: "ACTIVE",
    created_at: now(),
    updated_at: now(),
  },
  {
    lane_id: "jon-darz-human",
    participants: ["jon", "darz"],
    allowed_categories: ["human", "implementation"],
    allowed_altitudes: ["human", "engineering"],
    max_impact: "none",
    human_bandwidth: "high",
    continuity_budget: {
      max_composite: 0.5,
      session_budget: 1,
      session_spent: 0,
      reset_policy: "daily",
    },
    drift_thresholds: DRIFT_THRESHOLDS,
    comm_constitution_version: COMM_CONSTITUTION_VERSION,
    status: "ACTIVE",
    created_at: now(),
    updated_at: now(),
  },
];

function loadLaneMap() {
  const lanes = readJson(COMM_LANES_PATH, null);
  const source = Array.isArray(lanes) && lanes.length ? lanes : DEFAULT_LANES;
  return new Map(source.map((lane) => [lane.lane_id, lane]));
}

export function listLaneContracts() {
  return [...loadLaneMap().values()];
}

export function getLaneContract(laneId) {
  return loadLaneMap().get(laneId) ?? null;
}

export function upsertLaneContract(contract) {
  if (!contract?.lane_id) throw new Error("lane_id required");
  const lanes = loadLaneMap();
  const existing = lanes.get(contract.lane_id);
  lanes.set(contract.lane_id, {
    ...existing,
    ...contract,
    created_at: existing?.created_at ?? contract.created_at ?? now(),
    updated_at: now(),
  });
  writeJson(COMM_LANES_PATH, [...lanes.values()]);
  return lanes.get(contract.lane_id);
}

export function updateLaneStatus(laneId, status) {
  const lane = getLaneContract(laneId);
  if (!lane) throw new Error(`Unknown lane: ${laneId}`);
  return upsertLaneContract({ ...lane, status });
}

export function validateTickAgainstLane(tick, lane = getLaneContract(tick.lane_id)) {
  if (!lane) return { ok: false, violations: ["lane_not_registered"] };
  const violations = [];
  if (!lane.allowed_categories.includes(tick.category)) {
    violations.push("category_out_of_corridor");
  }
  if (!lane.allowed_altitudes.includes(tick.altitude)) {
    violations.push("altitude_out_of_corridor");
  }
  const impactRank = { none: 0, spec: 1, ops: 2 };
  if ((impactRank[tick.impact] ?? 0) > (impactRank[lane.max_impact] ?? 0)) {
    violations.push("impact_exceeds_corridor");
  }
  return { ok: violations.length === 0, violations };
}
