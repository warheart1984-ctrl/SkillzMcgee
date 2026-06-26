/**
 * Substrate binding — maps studio runtime to canonical Nova Studio payload.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeLiveMetrics,
  getEvents,
  getLedger,
} from "./studioRuntime.mjs";
import { getAllCapabilities, SLICE_CAPABILITIES } from "../../../substrate/capabilities-registry.mjs";
import { getDriftPoints as getEngineDriftPoints } from "../../../substrate/drift-engine.mjs";
import { loadContinuityState } from "../../../substrate/continuity-substrate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");

export { SLICE_CAPABILITIES };

function stableStringify(payload) {
  if (payload === null || typeof payload !== "object") {
    return JSON.stringify(payload);
  }
  if (Array.isArray(payload)) {
    return `[${payload.map(stableStringify).join(",")}]`;
  }
  const keys = Object.keys(payload).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(payload[k])}`).join(",")}}`;
}

export function stableHash(payload) {
  return crypto.createHash("sha256").update(stableStringify(payload)).digest("hex");
}

function capabilitySignatureHash(cap) {
  return stableHash({
    id: cap.id,
    inputSchema: cap.inputSchema,
    outputSchema: cap.outputSchema,
  });
}

export { capabilitySignatureHash };

/**
 * @param {import("./types.js").StudioReceipt} receipt
 * @param {number} index
 */
export function mapReceiptToEnvelope(receipt, index = 0) {
  const capId = receipt.capability ?? receipt.slice ?? "nova";
  const cap =
    getAllCapabilities().find((c) => c.id === capId) ??
    getAllCapabilities()[0];
  const inputHash = receipt.inputHash ?? stableHash(receipt.intent ?? {});
  const outputHash =
    receipt.outputHash ??
    (receipt.output !== undefined ? stableHash(receipt.output) : undefined);

  return {
    id: receipt.id,
    operator: receipt.actor ?? "nova-studio",
    capabilityId: capId,
    capabilitySignatureHash: capabilitySignatureHash(cap),
    continuityCheckpoint: receipt.timestamp,
    parentReceiptId: receipt.parentId ?? undefined,
    inputHash,
    outputHash,
    timestamp: receipt.timestamp,
    status:
      receipt.status === "ok" && receipt.laws?.allowed !== false ? "ok" : "error",
    invariantViolations: receipt.laws?.violations ?? [],
  };
}

function mapEventKind(type) {
  if (type?.includes("decision")) return "DECISION";
  if (type?.includes("artifact")) return "ARTIFACT";
  return "EVENT";
}

export function getContinuityTimeline() {
  const ledger = getLedger();
  const events = getEvents();
  const substrate = loadContinuityState();

  const fromSubstrate = substrate.events.map((e) => ({
    id: e.id,
    kind: e.kind,
    timestamp: e.timestamp,
    label: e.label,
    artifactId: e.artifactId ?? undefined,
    decisionId: e.kind === "DECISION" ? e.id : undefined,
    receiptId: e.receiptId,
  }));

  const fromEvents = events.map((e) => ({
    id: e.id,
    kind: mapEventKind(e.type),
    timestamp: e.timestamp,
    label: e.type,
    artifactId: e.artifactId ?? undefined,
    decisionId: e.decisionId ?? undefined,
  }));

  const fromReceipts = ledger.map((r) => ({
    id: `checkpoint:${r.id}`,
    kind: "ARTIFACT",
    timestamp: r.timestamp,
    label: r.phase ?? r.capability ?? "receipt",
    artifactId: r.id,
    decisionId: undefined,
  }));

  const merged = [...fromSubstrate, ...fromEvents, ...fromReceipts];
  const seen = new Set();
  return merged
    .filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    })
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function getDriftPoints() {
  const engine = getEngineDriftPoints();
  if (engine.length > 0) return engine;
  const ledger = getLedger();
  const metrics = computeLiveMetrics();
  const baseline = 100;
  if (ledger.length === 0) {
    return [{ t: 0, expected: baseline, actual: baseline }];
  }
  return ledger.map((r, i) => {
    const lawOk = r.laws?.allowed !== false && r.status === "ok";
    const actual = lawOk ? baseline : baseline - (metrics.drift + 1) * 5;
    return { t: i, expected: baseline, actual };
  });
}

export function getSliceCapabilities() {
  const ledger = getLedger();
  const lastRunByCap = new Map();
  for (const r of ledger) {
    const id = r.capability ?? r.slice;
    if (id) lastRunByCap.set(id, r.timestamp);
  }

  return getAllCapabilities().map((c) => ({
    ...c,
    lastRun: lastRunByCap.get(c.id) ?? null,
  }));
}

export function getGovernanceReceipts() {
  return getLedger().map((r, i) => mapReceiptToEnvelope(r, i));
}

export function getSubstratePayload() {
  return {
    capabilities: getSliceCapabilities(),
    receipts: getGovernanceReceipts(),
    continuity: getContinuityTimeline(),
    drift: getDriftPoints(),
  };
}

export function readSkillzMcGeeLedgerText() {
  const candidates = [
    path.join(REPO_ROOT, ".runtime", "skillzmcgee", "receipts.jsonl"),
    path.join(REPO_ROOT, "governance", "governance-ledger", "ledger.jsonl"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf8");
    }
  }
  return getLedger()
    .map((r) => JSON.stringify(mapReceiptToEnvelope(r)))
    .join("\n");
}

export function parseSkillzMcGeeLedger() {
  const text = readSkillzMcGeeLedgerText();
  if (!text.trim()) return [];
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line.replace(/^\uFEFF/, "")));
}
