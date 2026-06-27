/**
 * Communication continuity — aggregate drift across all lanes for the continuity fold.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listLanes } from "./communicationGovernance.mjs";
import { getActiveEpoch, listEpochs } from "./communicationEpochs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const TICKS_PATH = path.join(REPO_ROOT, ".runtime/communication-ledger/ticks.jsonl");

function readRecentTicks(limit = 200) {
  if (!fs.existsSync(TICKS_PATH)) return [];
  const lines = fs.readFileSync(TICKS_PATH, "utf8").trim().split("\n").filter(Boolean);
  return lines.slice(-limit).map((l) => JSON.parse(l));
}

/** Max composite drift across lanes in recent window */
export function computeCommunicationContinuity() {
  const ticks = readRecentTicks();
  const lanes = listLanes();

  let communication_drift = 0;
  const byLane = {};

  for (const lane of lanes) {
    byLane[lane.lane_id] = { composite_drift: 0, tick_count: 0 };
  }

  for (const tick of ticks) {
    const composite = tick.drift_vector?.composite ?? 0;
    communication_drift = Math.max(communication_drift, composite);
    if (byLane[tick.lane_id]) {
      byLane[tick.lane_id].composite_drift = Math.max(
        byLane[tick.lane_id].composite_drift,
        composite,
      );
      byLane[tick.lane_id].tick_count += 1;
    }
  }

  const epochs = listEpochs({ status: "ACTIVE" });
  const budgetPressure = epochs.reduce((max, ep) => {
    if (!ep.session_budget) return max;
    return Math.max(max, ep.session_spent / ep.session_budget);
  }, 0);

  return {
    communication_drift,
    lane_drifts: Object.entries(byLane).map(([lane_id, d]) => ({
      lane_id,
      composite_drift: d.composite_drift,
      tick_count: d.tick_count,
    })),
    budget_pressure: budgetPressure,
    global_max_composite: communication_drift,
  };
}

export function getLaneDriftStates() {
  const comm = computeCommunicationContinuity();
  return comm.lane_drifts.map((d) => {
    const epoch = getActiveEpoch(d.lane_id);
    return {
      lane_id: d.lane_id,
      composite_drift: d.composite_drift,
      session_spent: epoch?.session_spent ?? 0,
      session_budget: epoch?.session_budget ?? 1,
    };
  });
}
