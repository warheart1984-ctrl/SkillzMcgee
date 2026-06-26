/**
 * Nova Studio — in-process governed ledger + event stream.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { foldSingularity } from "../../../src/singularity/absoluteSingularity.js";
import { GOVERNANCE_OBJECTIVES } from "../../../src/governance/objectives.js";

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
  return entry;
}

/**
 * @param {Omit<import("./types.js").StudioReceipt, "id" | "timestamp"> & { id?: string }} draft
 */
export function appendReceipt(draft) {
  const receipt = {
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
  };

  if (!receipt.laws || typeof receipt.laws.allowed !== "boolean") {
    receipt.status = "error";
    receipt.laws = { allowed: false, violations: ["MALFORMED_LAWS"] };
  }

  ledger.push(receipt);
  persistLedger();
  logEvent("receipt_appended", { receiptId: receipt.id, phase: receipt.phase });
  return receipt;
}

export function getLedger() {
  return [...ledger];
}

export function getEvents() {
  return [...events];
}

export function clearLedger() {
  ledger = [];
  events = [];
  lastFingerprint = null;
  persistLedger();
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
  return {
    ledger: getLedger(),
    events: getEvents(),
    metrics: computeLiveMetrics(),
    governance: getGovernancePanel(),
    workspace: WORKSPACE_DIR,
  };
}
