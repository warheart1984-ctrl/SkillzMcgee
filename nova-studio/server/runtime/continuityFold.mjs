/**
 * Continuity fold â€” unified drift across runtime, governance, cockpit, communication.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { computeCommunicationContinuity } from "./communicationContinuity.mjs";
import { getLedger } from "./studioRuntime.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const CONTAINMENT_PATH = path.join(REPO_ROOT, ".runtime/continuity-fold/containment.jsonl");

function ensureDir() {
  fs.mkdirSync(path.dirname(CONTAINMENT_PATH), { recursive: true });
}

function computeRuntimeContinuity() {
  const ledger = getLedger();
  if (!ledger.length) return { runtime_drift: 0, receipt_count: 0 };

  const recent = ledger.slice(-50);
  const driftCounts = recent.map((r) => (r.invariantViolations ?? r.laws?.violations ?? []).length);
  const maxViolations = Math.max(0, ...driftCounts);
  const runtime_drift = Math.min(1, maxViolations / 5);

  return { runtime_drift, receipt_count: recent.length };
}

function computeGovernanceContinuity() {
  const ledger = getLedger();
  const recent = ledger.slice(-20);
  const blocked = recent.filter((r) => r.verdict === "BLOCK" || r.status === "blocked").length;
  return { governance_drift: Math.min(1, blocked / Math.max(recent.length, 1)) };
}

function computeCockpitContinuity() {
  return { cockpit_drift: 0 };
}

export function computeContinuityMetrics() {
  const runtime = computeRuntimeContinuity();
  const governance = computeGovernanceContinuity();
  const cockpit = computeCockpitContinuity();
  const comm = computeCommunicationContinuity();

  const dimensions = {
    runtime: runtime.runtime_drift,
    governance: governance.governance_drift,
    cockpit: cockpit.cockpit_drift,
    communication: comm.communication_drift,
  };

  const continuity_score = Math.max(...Object.values(dimensions));

  let trigger = null;
  let triggerScore = 0;
  for (const [key, value] of Object.entries(dimensions)) {
    if (value >= triggerScore) {
      triggerScore = value;
      trigger = key;
    }
  }
  if (triggerScore === 0) trigger = null;

  return {
    runtime_drift: runtime.runtime_drift,
    governance_drift: governance.governance_drift,
    cockpit_drift: cockpit.cockpit_drift,
    communication_drift: comm.communication_drift,
    continuity_score,
    trigger,
    drift_vector: dimensions,
    budget_pressure: comm.budget_pressure,
  };
}

export function evaluateContinuity(continuity) {
  const score = continuity.continuity_score ?? 0;

  if (score > 0.5) {
    return { state: "FAIL_CLOSED", trigger: continuity.trigger ?? "continuity" };
  }
  if (score > 0.3) {
    return { state: "CONTAINMENT_EPOCH", trigger: continuity.trigger ?? "continuity" };
  }
  if (score > 0.15) {
    return { state: "NOTIFY", trigger: continuity.trigger ?? "continuity" };
  }
  if (score > 0.05) {
    return { state: "WARN", trigger: continuity.trigger ?? "continuity" };
  }

  return { state: "OK", trigger: null };
}

export function getCurrentContinuityScore() {
  return computeContinuityMetrics().continuity_score;
}

export function writeContinuityContainmentTick(payload) {
  ensureDir();
  const record = {
    id: `CCT-${crypto.randomUUID()}`,
    entry_type: payload.entry_type ?? "continuityContainmentTick",
    timestamp: new Date().toISOString(),
    trigger: payload.trigger ?? "continuity",
    continuity_score: payload.continuity_score ?? getCurrentContinuityScore(),
    drift_vector: payload.drift_vector ?? computeContinuityMetrics().drift_vector,
    state: payload.state,
    receipts: payload.receipts ?? [],
    metadata: payload.metadata ?? {},
  };
  fs.appendFileSync(CONTAINMENT_PATH, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

export function getContinuityFoldState() {
  const metrics = computeContinuityMetrics();
  const evaluation = evaluateContinuity(metrics);
  return { metrics, evaluation };
}
