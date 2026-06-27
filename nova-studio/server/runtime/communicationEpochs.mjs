/**
 * Communication epochs â€” bounded session drift with automatic resets.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { getLane, loadConstitution } from "./communicationGovernance.mjs";
import { isFrozenCanonMode } from "./canonFreeze.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const EPOCHS_PATH = path.join(REPO_ROOT, ".runtime/communication-governance/epochs.json");

function ensureEpochsFile() {
  fs.mkdirSync(path.dirname(EPOCHS_PATH), { recursive: true });
  if (!fs.existsSync(EPOCHS_PATH)) {
    fs.writeFileSync(EPOCHS_PATH, JSON.stringify({ epochs: [] }, null, 2), "utf8");
  }
}

function readEpochStore() {
  ensureEpochsFile();
  try {
    const raw = fs.readFileSync(EPOCHS_PATH, "utf8").trim();
    if (!raw) return { epochs: [] };
    return JSON.parse(raw);
  } catch {
    return { epochs: [] };
  }
}

function writeEpochStore(store) {
  ensureEpochsFile();
  fs.writeFileSync(EPOCHS_PATH, JSON.stringify(store, null, 2), "utf8");
}

function defaultBudget(lane) {
  return (
    lane.continuity_budget ?? {
      max_composite: 0.3,
      session_budget: 0.5,
      session_spent: 0,
      reset_policy: "per-epoch",
    }
  );
}

export function getActiveEpoch(laneId) {
  const store = readEpochStore();
  return (
    store.epochs.find((e) => e.lane_id === laneId && e.status === "ACTIVE") ?? null
  );
}

export function startEpoch(laneId) {
  const lane = getLane(laneId);
  if (!lane) throw new Error(`Unknown lane: ${laneId}`);

  const budget = defaultBudget(lane);
  const epoch = {
    epoch_id: `EPOCH-${crypto.randomUUID().slice(0, 8)}`,
    lane_id: laneId,
    started_at: new Date().toISOString(),
    ended_at: null,
    session_budget: budget.session_budget,
    session_spent: 0,
    drift_max: 0,
    ticks_count: 0,
    status: "ACTIVE",
  };

  const store = readEpochStore();
  store.epochs.push(epoch);
  writeEpochStore(store);
  return epoch;
}

export function ensureActiveEpoch(laneId) {
  const active = getActiveEpoch(laneId);
  if (active) return active;
  return startEpoch(laneId);
}

export function recordTickInEpoch(laneId, driftComposite) {
  let store = readEpochStore();
  let epoch = store.epochs.find((e) => e.lane_id === laneId && e.status === "ACTIVE");

  if (!epoch) {
    epoch = startEpoch(laneId);
    store = readEpochStore();
    epoch = store.epochs.find((e) => e.lane_id === laneId && e.status === "ACTIVE");
  }

  if (!epoch) return null;

  epoch.ticks_count += 1;
  epoch.session_spent += driftComposite;
  epoch.drift_max = Math.max(epoch.drift_max, driftComposite);

  const lane = getLane(laneId);
  const budget = defaultBudget(lane);

  if (driftComposite > budget.max_composite) {
    epoch.status = "CONTAINED";
    epoch.ended_at = new Date().toISOString();
    epoch.containment_reason = "max_composite_exceeded";
  } else if (epoch.session_spent > epoch.session_budget) {
    epoch.status = "CONTAINED";
    epoch.ended_at = new Date().toISOString();
    epoch.containment_reason = "session_budget_exceeded";
  } else if (isFrozenCanonMode()) {
    const headroom = epoch.session_budget - epoch.session_spent;
    if (driftComposite > headroom * 0.5 && driftComposite > 0.05) {
      epoch.status = "CONTAINED";
      epoch.ended_at = new Date().toISOString();
      epoch.containment_reason = "frozen_canon_strict_budget";
    }
  }

  writeEpochStore(store);
  return epoch;
}

export function closeEpoch(laneId, operator_id) {
  const store = readEpochStore();
  const epoch = store.epochs.find((e) => e.lane_id === laneId && e.status === "ACTIVE");
  if (!epoch) return null;

  epoch.status = "CLOSED";
  epoch.ended_at = new Date().toISOString();
  epoch.closed_by = operator_id ?? "operator:local";
  writeEpochStore(store);
  return epoch;
}

export function listEpochs(filter = {}) {
  const store = readEpochStore();
  let epochs = store.epochs;
  if (filter.lane_id) epochs = epochs.filter((e) => e.lane_id === filter.lane_id);
  if (filter.status) epochs = epochs.filter((e) => e.status === filter.status);
  return epochs;
}

export function getEpochBudgetSummary(laneId) {
  const epoch = ensureActiveEpoch(laneId);
  const lane = getLane(laneId);
  const budget = defaultBudget(lane);
  return {
    lane_id: laneId,
    epoch_id: epoch.epoch_id,
    session_budget: epoch.session_budget,
    session_spent: epoch.session_spent,
    max_composite: budget.max_composite,
    drift_max: epoch.drift_max,
    ticks_count: epoch.ticks_count,
    status: epoch.status,
    utilization: epoch.session_budget ? epoch.session_spent / epoch.session_budget : 0,
  };
}
