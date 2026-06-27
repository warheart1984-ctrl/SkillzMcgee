import { COMM_EPOCHS_PATH, readJson, writeJson } from "./store.mjs";

function now() {
  return new Date().toISOString();
}

export function listEpochs() {
  return readJson(COMM_EPOCHS_PATH, []);
}

export function getActiveEpoch(lane) {
  const epochs = listEpochs();
  let epoch = [...epochs].reverse().find((item) => item.lane_id === lane.lane_id && item.status === "ACTIVE");
  if (epoch) return epoch;
  epoch = {
    epoch_id: `EPOCH-${lane.lane_id}-${Date.now()}`,
    lane_id: lane.lane_id,
    started_at: now(),
    session_budget: lane.continuity_budget.session_budget,
    session_spent: 0,
    drift_max: 0,
    ticks_count: 0,
    status: "ACTIVE",
  };
  writeJson(COMM_EPOCHS_PATH, [...epochs, epoch]);
  return epoch;
}

export function updateEpochWithTick(lane, tick) {
  const epochs = listEpochs();
  const epoch = getActiveEpoch(lane);
  const drift = tick.drift_vector?.composite ?? 0;
  const updated = {
    ...epoch,
    session_spent: Number((epoch.session_spent + drift).toFixed(6)),
    drift_max: Math.max(epoch.drift_max, drift),
    ticks_count: epoch.ticks_count + 1,
  };
  if (updated.session_spent > updated.session_budget) {
    updated.status = "CONTAINED";
    updated.ended_at = now();
  }
  const next = epochs.filter((item) => item.epoch_id !== epoch.epoch_id);
  writeJson(COMM_EPOCHS_PATH, [...next, updated]);
  return updated;
}

export function closeEpoch(epochId) {
  const epochs = listEpochs();
  const next = epochs.map((epoch) =>
    epoch.epoch_id === epochId
      ? { ...epoch, status: "CLOSED", ended_at: now() }
      : epoch,
  );
  writeJson(COMM_EPOCHS_PATH, next);
  return next.find((epoch) => epoch.epoch_id === epochId) ?? null;
}
