import crypto from "node:crypto";
import fs from "node:fs";
import { GOVERNANCE_PATHS } from "./paths.js";

export interface Gls1Entry {
  entry_id: string;
  timestamp: string;
  decision_type: string;
  decision: "approve" | "reject" | "defer";
  rationale: string[];
  steward_votes: Array<{ steward_id: string; vote: string; notes?: string }>;
  governance_hash: string;
  previous_hash: string;
  inputs?: Record<string, unknown>;
}

interface GlsSchema {
  properties?: {
    decision_type?: { enum?: string[] };
  };
}

export function gls1CanonicalPayload(entry: Record<string, unknown>): string {
  const { governance_hash: _g, ...rest } = entry;
  return JSON.stringify(rest, Object.keys(rest).sort());
}

export function computeGls1Hash(entry: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(gls1CanonicalPayload(entry)).digest("hex");
}

function loadGlsSchema(): GlsSchema {
  return JSON.parse(fs.readFileSync(GOVERNANCE_PATHS.glsSchema, "utf8")) as GlsSchema;
}

export function validateGls1Entry(
  entry: Gls1Entry,
  schema: GlsSchema,
  previousHash: string,
): string[] {
  const errors: string[] = [];
  if (!entry.entry_id?.startsWith("GLS-")) errors.push("invalid entry_id");
  if (!entry.timestamp) errors.push("missing timestamp");
  if (!entry.decision_type) errors.push("missing decision_type");
  if (!["approve", "reject", "defer"].includes(entry.decision)) errors.push("invalid decision");
  if (!Array.isArray(entry.rationale) || entry.rationale.length === 0) {
    errors.push("empty rationale");
  }
  if (!Array.isArray(entry.steward_votes) || entry.steward_votes.length === 0) {
    errors.push("empty steward_votes");
  }

  const expected = computeGls1Hash(entry as unknown as Record<string, unknown>);
  if (entry.governance_hash !== expected) {
    errors.push(`hash mismatch: expected ${expected}`);
  }
  if (entry.previous_hash !== previousHash) {
    errors.push(`previous_hash mismatch: expected ${previousHash}`);
  }

  const allowed = schema?.properties?.decision_type?.enum ?? [];
  if (allowed.length && !allowed.includes(entry.decision_type)) {
    errors.push(`invalid decision_type: ${entry.decision_type}`);
  }

  return errors;
}

export function validateGls1Ledger(entries: Gls1Entry[]): {
  status: "pass" | "fail";
  entries: number;
  errors: Array<{ id: string; errors: string[] }>;
} {
  const schema = loadGlsSchema();
  const errors: Array<{ id: string; errors: string[] }> = [];
  let prev = "GENESIS";
  for (const entry of entries) {
    const errs = validateGls1Entry(entry, schema, prev);
    if (errs.length) errors.push({ id: entry.entry_id, errors: errs });
    prev = entry.governance_hash;
  }
  return {
    status: errors.length === 0 ? "pass" : "fail",
    entries: entries.length,
    errors,
  };
}
