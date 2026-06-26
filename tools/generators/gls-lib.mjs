#!/usr/bin/env node
/**
 * GLS-1.0 — Governance Ledger utilities (hash, validate, append, list)
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LEDGER = path.join(ROOT, "governance/governance-ledger/ledger.jsonl");
const SCHEMA = path.join(ROOT, "governance/governance-ledger/schema.json");

export function canonicalPayload(entry) {
  const { governance_hash: _g, ...rest } = entry;
  return JSON.stringify(rest, Object.keys(rest).sort());
}

export function computeHash(entry) {
  return crypto.createHash("sha256").update(canonicalPayload(entry)).digest("hex");
}

export function readLedger() {
  if (!fs.existsSync(LEDGER)) return [];
  return fs
    .readFileSync(LEDGER, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

export function validateEntry(entry, schema, previousHash) {
  const errors = [];
  if (!entry.entry_id?.startsWith("GLS-")) errors.push("invalid entry_id");
  if (!entry.timestamp) errors.push("missing timestamp");
  if (!entry.decision_type) errors.push("missing decision_type");
  if (!["approve", "reject", "defer"].includes(entry.decision)) errors.push("invalid decision");
  if (!Array.isArray(entry.rationale) || entry.rationale.length === 0) errors.push("empty rationale");
  if (!Array.isArray(entry.steward_votes) || entry.steward_votes.length === 0) errors.push("empty steward_votes");
  const expected = computeHash(entry);
  if (entry.governance_hash !== expected) errors.push(`hash mismatch: expected ${expected}`);
  if (entry.previous_hash !== previousHash) errors.push(`previous_hash mismatch: expected ${previousHash}`);
  const allowed = schema?.properties?.decision_type?.enum ?? [];
  if (allowed.length && !allowed.includes(entry.decision_type)) errors.push(`invalid decision_type: ${entry.decision_type}`);
  return errors;
}

export function validateLedger() {
  const schema = JSON.parse(fs.readFileSync(SCHEMA, "utf8"));
  const entries = readLedger();
  const allErrors = [];
  let prev = "GENESIS";
  for (const entry of entries) {
    const errs = validateEntry(entry, schema, prev);
    if (errs.length) allErrors.push({ entry_id: entry.entry_id, errors: errs });
    prev = entry.governance_hash;
  }
  return { status: allErrors.length === 0 ? "pass" : "fail", entries: entries.length, errors: allErrors };
}

export function appendEntry(draft) {
  const entries = readLedger();
  const prev = entries.length ? entries[entries.length - 1].governance_hash : "GENESIS";
  const entry = { ...draft, previous_hash: prev };
  entry.governance_hash = computeHash(entry);
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, `${JSON.stringify(entry)}\n`);
  return entry;
}
