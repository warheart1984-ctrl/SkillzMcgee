/**
 * Unified evidence ledger append — same substrate as zoneTick / governanceTick views.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const EVIDENCE_LEDGER_DIR = path.join(REPO_ROOT, ".runtime/evidence-ledger");
const EVIDENCE_LEDGER_PATH = path.join(EVIDENCE_LEDGER_DIR, "entries.jsonl");

function ensureDir() {
  fs.mkdirSync(EVIDENCE_LEDGER_DIR, { recursive: true });
}

/** @param {Record<string, unknown>} entry */
export function appendEvidenceEntry(entry) {
  ensureDir();
  const record = {
    ...entry,
    timestamp: entry.timestamp ?? new Date().toISOString(),
  };
  fs.appendFileSync(EVIDENCE_LEDGER_PATH, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

export function listEvidenceEntries(limit = 100, entryType = null) {
  if (!fs.existsSync(EVIDENCE_LEDGER_PATH)) return [];
  const lines = fs.readFileSync(EVIDENCE_LEDGER_PATH, "utf8").trim().split("\n").filter(Boolean);
  let entries = lines.map((l) => JSON.parse(l));
  if (entryType) {
    entries = entries.filter((e) => e.entry_type === entryType);
  }
  return entries.slice(-limit).reverse();
}
