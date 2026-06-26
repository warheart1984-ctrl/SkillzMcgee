import crypto from "node:crypto";
import fs from "node:fs";
import { GOVERNANCE_PATHS } from "./paths.js";

export interface Gl1Entry {
  id: string;
  timestamp: string;
  steward: string;
  decision: "approve" | "reject" | "defer";
  subject: string;
  evidence: {
    cor: string;
    csr: string;
    dra: string;
    proofGraphHash?: string;
  };
  rationale: string;
  continuityCheckpoint: string;
  parentDecisionId: string;
  signature: string;
  publicKey: string;
}

interface StewardRecord {
  publicKey: string;
}

function loadStewards(): Record<string, StewardRecord> {
  if (!fs.existsSync(GOVERNANCE_PATHS.glStewards)) return {};
  return JSON.parse(fs.readFileSync(GOVERNANCE_PATHS.glStewards, "utf8")) as Record<
    string,
    StewardRecord
  >;
}

function stewardSecret(stewardId: string): Buffer {
  return crypto.createHash("sha256").update(`gl-1.0-dev:${stewardId}`).digest();
}

export function gl1CanonicalPayload(entry: Record<string, unknown>): string {
  const { id: _id, signature: _s, publicKey: _p, ...rest } = entry;
  const keys = Object.keys(rest).sort();
  const ordered: Record<string, unknown> = {};
  for (const k of keys) ordered[k] = rest[k];
  return JSON.stringify(ordered);
}

export function computeGl1DecisionId(entry: Record<string, unknown>): string {
  const hash = crypto.createHash("sha256").update(gl1CanonicalPayload(entry)).digest("hex");
  return `sha256:${hash}`;
}

export function verifyGl1Signature(entry: Gl1Entry): { ok: boolean; error?: string } {
  const stewards = loadStewards();
  const reg = stewards[entry.steward];
  if (!reg) return { ok: false, error: "unknown steward" };
  if (entry.publicKey !== reg.publicKey) return { ok: false, error: "public key mismatch" };
  const sigB64 = entry.signature.replace(/^ed25519:/, "");
  const payload = gl1CanonicalPayload(entry as unknown as Record<string, unknown>);
  const expected = crypto
    .createHmac("sha256", stewardSecret(entry.steward))
    .update(payload)
    .digest("base64");
  return sigB64 === expected
    ? { ok: true }
    : { ok: false, error: "signature mismatch" };
}

export function validateGl1Entry(entry: Gl1Entry, previous: Gl1Entry | null): string[] {
  const errors: string[] = [];
  const withoutSig = { ...entry };
  delete (withoutSig as { id?: string }).id;
  delete (withoutSig as { signature?: string }).signature;
  delete (withoutSig as { publicKey?: string }).publicKey;

  const expectedId = computeGl1DecisionId(withoutSig as unknown as Record<string, unknown>);
  if (entry.id !== expectedId) errors.push(`id mismatch: expected ${expectedId}`);

  if (!entry.rationale?.trim()) errors.push("missing rationale");
  if (!entry.evidence?.cor || !entry.evidence?.csr || !entry.evidence?.dra) {
    errors.push("missing evidence references");
  }
  if (!["approve", "reject", "defer"].includes(entry.decision)) {
    errors.push("invalid decision");
  }
  if (!entry.steward?.startsWith("sc:")) errors.push("invalid steward id");

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

  const sig = verifyGl1Signature(entry);
  if (!sig.ok) errors.push(sig.error ?? "invalid signature");

  return errors;
}

export function validateGl1Ledger(entries: Gl1Entry[]): {
  status: "pass" | "fail";
  entries: number;
  errors: Array<{ id: string; errors: string[] }>;
} {
  const errors: Array<{ id: string; errors: string[] }> = [];
  let previous: Gl1Entry | null = null;
  for (const entry of entries) {
    const errs = validateGl1Entry(entry, previous);
    if (errs.length) errors.push({ id: entry.id, errors: errs });
    previous = entry;
  }
  return {
    status: errors.length === 0 ? "pass" : "fail",
    entries: entries.length,
    errors,
  };
}
