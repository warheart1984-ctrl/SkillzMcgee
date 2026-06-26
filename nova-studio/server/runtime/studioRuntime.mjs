/**
 * Nova Studio — in-process governed ledger + event stream.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clearContinuityState } from "../../../substrate/continuity-substrate.mjs";
import { clearDriftState } from "../../../substrate/drift-engine.mjs";
import { clearSession } from "./sessionRecorder.mjs";
import { foldSingularity } from "../../../src/singularity/absoluteSingularity.js";
import { GOVERNANCE_OBJECTIVES } from "../../../src/governance/objectives.js";
import { computeFoldSummary } from "../../../runtime/fold.mjs";
import { reduceStance } from "../../../runtime/stance.mjs";
import { reduceWaves } from "../../../runtime/wave.mjs";
import {
  NOVA_RUNTIME_ID,
  NOVA_SESSION_ID,
  replaceState,
  updateState,
} from "../../../runtime/state-store.mjs";
import { getSubstratePayload } from "./substrateState.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const STUDIO_ROOT = path.resolve(__dirname, "../..");
export const RUNTIME_DIR = path.join(STUDIO_ROOT, "..", ".runtime", "nova-studio");
export const LEDGER_PATH = path.join(RUNTIME_DIR, "ledger.jsonl");
export const WORKSPACE_DIR = path.join(STUDIO_ROOT, "workspace");
export const SPECIMEN_DIR = path.join(RUNTIME_DIR, "specimens");

/** @type {import("./types.js").StudioReceipt[]} */
let ledger = [];
/** @type {import("./types.js").StudioEvent[]} */
let events = [];
let lastFingerprint = null;
const eventSubscribers = new Set();

function ensureDirs() {
  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  fs.mkdirSync(SPECIMEN_DIR, { recursive: true });
}

function loadLedger() {
  ensureDirs();
  if (!fs.existsSync(LEDGER_PATH)) {
    ledger = [];
    return;
  }
  ledger = fs
    .readFileSync(LEDGER_PATH, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function persistLedger() {
  ensureDirs();
  fs.writeFileSync(
    LEDGER_PATH,
    ledger.map((r) => JSON.stringify(r)).join("\n") + (ledger.length ? "\n" : ""),
    "utf8"
  );
}

export function bootStudioRuntime() {
  loadLedger();
  replaceState(createNovaRuntimeState(computeLiveMetrics()));
  return { ledger, events };
}

/**
 * @param {string} type
 * @param {Record<string, unknown>} payload
 */
export function logEvent(type, payload = {}) {
  const entry = {
    id: `EVT-${Date.now()}-${events.length}`,
    timestamp: new Date().toISOString(),
    type,
    ...payload,
  };
  events.unshift(entry);
  if (events.length > 200) events.length = 200;
  for (const subscriber of eventSubscribers) {
    subscriber(entry);
  }
  updateState({
    type: "event",
    runtime_id: NOVA_RUNTIME_ID,
    session_id: NOVA_SESSION_ID,
    timestamp: entry.timestamp,
    payload: {
      event_id: entry.id,
      event_type: entry.type,
      receipt_id: entry.receiptId ?? null,
      phase: entry.phase ?? null,
    },
  });
  return entry;
}

export function subscribeStudioEvents(subscriber) {
  eventSubscribers.add(subscriber);
  return () => eventSubscribers.delete(subscriber);
}

/**
 * @param {Omit<import("./types.js").StudioReceipt, "id" | "timestamp"> & { id?: string }} draft
 */
export function appendReceipt(draft) {
  const receipt = {
    ...draft,
    id: draft.id ?? `REC-STUDIO-${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    actor: draft.actor ?? "nova-studio",
    slice: draft.slice ?? "nova",
    intent: draft.intent,
    output: draft.output,
    status: draft.status ?? "ok",
    laws: draft.laws ?? { allowed: true, violations: [] },
    parentId: draft.parentId ?? (ledger.at(-1)?.id ?? null),
    capability: draft.capability ?? null,
    phase: draft.phase ?? null,
    inputHash: draft.inputHash ?? null,
    outputHash: draft.outputHash ?? null,
  };

  if (!receipt.laws || typeof receipt.laws.allowed !== "boolean") {
    receipt.status = "error";
    receipt.laws = { allowed: false, violations: ["MALFORMED_LAWS"] };
  }

  ledger.push(receipt);
  persistLedger();
  logEvent("receipt_appended", { receiptId: receipt.id, phase: receipt.phase });
  replaceState(createNovaRuntimeState(computeLiveMetrics()), { broadcast: true });
  return receipt;
}

export function getLedger() {
  return [...ledger];
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} fields
 */
export function patchReceipt(id, fields) {
  const idx = ledger.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  ledger[idx] = { ...ledger[idx], ...fields };
  persistLedger();
  return ledger[idx];
}

export function getEvents() {
  return [...events];
}

export function clearLedger() {
  ledger = [];
  events = [];
  lastFingerprint = null;
  persistLedger();
  clearContinuityState();
  clearDriftState();
  clearSession();
  replaceState(createNovaRuntimeState(computeLiveMetrics()));
}

/**
 * Live continuity metrics derived from ledger + AS-Ω fold.
 */
export function computeLiveMetrics() {
  if (ledger.length === 0) {
    return {
      coherence: 0,
      threadIntegrity: 0,
      waveAlignment: 0,
      lawfulness: 100,
      drift: 0,
      receiptCount: 0,
      fingerprint: null,
    };
  }

  const fold = foldSingularity(ledger);
  const okCount = ledger.filter((r) => r.status === "ok" && r.laws?.allowed !== false).length;
  const lawfulness = Math.round((okCount / ledger.length) * 1000) / 10;

  const waveEnergy = fold.wave?.energy ?? fold.wave?.w_t?.coherence ?? 0.5;
  const waveAlignment = Math.round(Math.min(1, Math.max(0, waveEnergy)) * 1000) / 10;

  const threadIntegrity = fold.merkle?.globalRoot ? 99.9 : 85.0;
  const coherence = Math.round(((lawfulness + waveAlignment + threadIntegrity) / 3) * 10) / 10;

  const drift =
    lastFingerprint && fold.fingerprint !== lastFingerprint
      ? Math.round(Math.abs(hashDrift(lastFingerprint, fold.fingerprint)) * 1000) / 1000
      : 0;
  lastFingerprint = fold.fingerprint;

  return {
    coherence,
    threadIntegrity,
    waveAlignment,
    lawfulness,
    drift,
    receiptCount: ledger.length,
    fingerprint: fold.fingerprint,
    merkleRoot: fold.merkle?.globalRoot ?? null,
    fold,
  };
}

function hashDrift(a, b) {
  let diff = 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) diff++;
  }
  return diff / len;
}

export function getGovernancePanel() {
  const hasOkReceipts = ledger.some((r) => r.laws?.allowed !== false && r.status === "ok");
  return Object.entries(GOVERNANCE_OBJECTIVES).map(([id, obj]) => ({
    id,
    name: obj.name,
    axis: obj.axis,
    passed: hasOkReceipts || ledger.length === 0,
  }));
}

export function getStudioState() {
  const metrics = computeLiveMetrics();
  const substrate = getSubstratePayload();
  return {
    ...substrate,
    ledger: getLedger(),
    events: getEvents(),
    metrics,
    nova: createNovaRuntimeState(metrics),
    stanceStrip: createStanceStrip(metrics),
    wave: metrics.fold?.wave ?? null,
    darz: metrics.fold?.darz ?? null,
    lineage: metrics.fold?.lineages ?? {},
    replayCheckpoints: ledger.map((receipt, index) => ({
      id: `checkpoint:${receipt.id}`,
      receiptId: receipt.id,
      index,
      timestamp: receipt.timestamp,
      status: receipt.status,
      phase: receipt.phase ?? null,
      merkleRoot: metrics.fold?.merkle?.globalRoot ?? null,
    })),
    governance: getGovernancePanel(),
    workspace: WORKSPACE_DIR,
  };
}

function createStanceStrip(metrics) {
  const novaState = createNovaRuntimeState(metrics);
  return {
    ledger: metrics.receiptCount > 0 ? "live" : "empty",
    operatorId: novaState.stance.operator_id,
    stance: novaState.stance.stance,
    focusCapabilityId: novaState.stance.focus_capability_id,
    lastEventAt: novaState.stance.last_event_at,
    receiptCount: metrics.receiptCount,
    coherence: metrics.coherence,
    drift: metrics.drift,
    lawfulness: metrics.lawfulness,
    waveAlignment: metrics.waveAlignment,
    merkleRoot: metrics.merkleRoot ?? null,
    fingerprint: metrics.fingerprint ?? null,
  };
}

export function getNovaRuntimeState() {
  return replaceState(createNovaRuntimeState(computeLiveMetrics()));
}

export function createNovaRuntimeState(metrics = computeLiveMetrics()) {
  return {
    runtime_id: NOVA_RUNTIME_ID,
    stance: createNovaStance(metrics),
    waves: createNovaWaves(metrics),
    folds: createFoldSummaries(metrics),
  };
}

function createNovaStance(metrics) {
  return reduceStance(metrics, ledger, events);
}

function createNovaWaves(metrics) {
  return reduceWaves(metrics, ledger);
}

function createFoldSummaries(metrics) {
  return computeFoldSummary(metrics, ledger);
}
