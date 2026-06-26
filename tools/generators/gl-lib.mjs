/**
 * GL-1.0 — Governance Ledger utilities (hash, sign, validate, append).
 */
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { CONFORMANCE_PATHS } from "../lib/conformance-paths.mjs";

const LEDGER = CONFORMANCE_PATHS.glLedger;
const STEWARDS = CONFORMANCE_PATHS.glStewards;

function loadStewards() {
  if (!fs.existsSync(STEWARDS)) return {};
  return JSON.parse(fs.readFileSync(STEWARDS, "utf8"));
}

function stewardSecret(stewardId) {
  return crypto.createHash("sha256").update(`gl-1.0-dev:${stewardId}`).digest();
}

export function signDecision(entry, stewardId) {
  const stewards = loadStewards();
  if (!stewards[stewardId]) throw new Error(`Unknown steward ${stewardId}`);
  const payload = canonicalPayload(entry);
  const sig = crypto.createHmac("sha256", stewardSecret(stewardId)).update(payload).digest("base64");
  return {
    signature: `ed25519:${sig}`,
    publicKey: stewards[stewardId].publicKey,
  };
}

export function verifySignature(entry) {
  const stewards = loadStewards();
  const reg = stewards[entry.steward];
  if (!reg) return { ok: false, error: "unknown steward" };
  if (entry.publicKey !== reg.publicKey) return { ok: false, error: "public key mismatch" };
  const sigB64 = entry.signature.replace(/^ed25519:/, "");
  const payload = canonicalPayload(entry);
  const expected = crypto
    .createHmac("sha256", stewardSecret(entry.steward))
    .update(payload)
    .digest("base64");
  return { ok: sigB64 === expected, error: sigB64 === expected ? undefined : "signature mismatch" };
}

export function computeDecisionId(entry) {
  const hash = crypto.createHash("sha256").update(canonicalPayload(entry)).digest("hex");
  return `sha256:${hash}`;
}

export function canonicalPayload(entry) {
  const { id: _id, signature: _s, publicKey: _p, ...rest } = entry;
  const keys = Object.keys(rest).sort();
  const ordered = {};
  for (const k of keys) ordered[k] = rest[k];
  return JSON.stringify(ordered);
}

export function readLedger(ledgerPath = LEDGER) {
  if (!fs.existsSync(ledgerPath)) return [];
  return fs
    .readFileSync(ledgerPath, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

export function readContinuityCheckpoint() {
  const p = CONFORMANCE_PATHS.continuityCheckpoint;
  if (!fs.existsSync(p)) return "00000";
  return fs.readFileSync(p, "utf8").trim().padStart(5, "0");
}

export function proofGraphHash() {
  const p = CONFORMANCE_PATHS.graph;
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, "utf8");
  return `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;
}

export function defaultEvidence() {
  return {
    cor: "cor-1.0.json",
    csr: "csr-1.0.json",
    dra: "dra-1.0.json",
    proofGraphHash: proofGraphHash() ?? "sha256:missing",
  };
}

export function validateEntry(entry, previous) {
  const errors = [];
  const withoutSig = { ...entry };
  delete withoutSig.id;
  delete withoutSig.signature;
  delete withoutSig.publicKey;
  const expectedId = computeDecisionId(withoutSig);
  if (entry.id !== expectedId) errors.push(`id mismatch: expected ${expectedId}`);
  if (!entry.rationale?.trim()) errors.push("missing rationale");
  if (!entry.evidence?.cor || !entry.evidence?.csr || !entry.evidence?.dra) {
    errors.push("missing evidence references");
  }
  if (previous) {
    if (entry.parentDecisionId !== previous.id) {
      errors.push(`parentDecisionId mismatch: expected ${previous.id}`);
    }
    const prevCp = Number(previous.continuityCheckpoint);
    const cp = Number(entry.continuityCheckpoint);
    if (!(cp > prevCp)) errors.push("non-monotonic continuity checkpoint");
  } else if (entry.parentDecisionId !== "GENESIS") {
    errors.push("first entry must have parentDecisionId GENESIS");
  }
  const sig = verifySignature(entry);
  if (!sig.ok) errors.push(sig.error ?? "invalid signature");
  return errors;
}

export function validateLedger(ledgerPath = LEDGER) {
  const entries = readLedger(ledgerPath);
  const errors = [];
  let previous = null;
  for (const entry of entries) {
    const errs = validateEntry(entry, previous);
    if (errs.length) errors.push({ id: entry.id, errors: errs });
    previous = entry;
  }
  return {
    status: errors.length === 0 ? "pass" : "fail",
    entries: entries.length,
    errors,
  };
}

export function appendDecision(draft) {
  const entries = readLedger();
  const previous = entries.at(-1) ?? null;
  const base = {
    timestamp: new Date().toISOString(),
    continuityCheckpoint: readContinuityCheckpoint(),
    parentDecisionId: previous?.id ?? "GENESIS",
    evidence: defaultEvidence(),
    ...draft,
  };
  const id = computeDecisionId(base);
  const signed = signDecision({ ...base, id }, draft.steward);
  const entry = { ...base, id, ...signed };
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, `${JSON.stringify(entry)}\n`, "utf8");
  return entry;
}
