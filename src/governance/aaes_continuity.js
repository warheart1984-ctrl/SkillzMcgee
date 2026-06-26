/**
 * AAES continuity receipts — JSONL compatible with SQLiteRunLedgerStore + FileTraceSink.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const DEFAULT_AAES_RECEIPTS_JSONL = path.join(
  process.cwd(),
  ".runtime",
  "skillzmcgee",
  "continuity_receipts.jsonl",
);

export const DEFAULT_TRACE_SPANS_JSONL = path.join(
  process.cwd(),
  ".runtime",
  "skillzmcgee",
  "traces.jsonl",
);

/**
 * @param {string} [customPath]
 */
export function aaesReceiptsPath(customPath) {
  return customPath ?? process.env.SKILLZMCGEE_CONTINUITY_RECEIPTS_PATH ?? DEFAULT_AAES_RECEIPTS_JSONL;
}

/**
 * @param {object} receipt
 * @param {string} [filePath]
 */
export function appendAaesContinuityReceipt(receipt, filePath) {
  const target = aaesReceiptsPath(filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.appendFileSync(target, `${JSON.stringify(receipt)}\n`, "utf8");
  return target;
}

/**
 * @param {string} [filePath]
 * @returns {object[]}
 */
export function readAaesContinuityReceipts(filePath) {
  const target = aaesReceiptsPath(filePath);
  if (!fs.existsSync(target)) return [];
  const out = [];
  for (const line of fs.readFileSync(target, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      out.push(JSON.parse(trimmed));
    } catch {
      // skip malformed
    }
  }
  return out;
}

/**
 * @param {object} span
 * @param {string} [filePath]
 */
export function appendTraceSpan(span, filePath) {
  const target = filePath ?? process.env.SKILLZMCGEE_TRACE_PATH ?? DEFAULT_TRACE_SPANS_JSONL;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.appendFileSync(target, `${JSON.stringify(span)}\n`, "utf8");
  return target;
}

/**
 * Load canonical Day 11 emergence receipt from governance/events.
 * @param {string} [repoRoot]
 */
export function loadDay11EmergenceReceipt(repoRoot = process.cwd()) {
  const file = path.join(repoRoot, "governance", "events", "day11_emergence.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * @param {object} receipt
 * @returns {boolean}
 */
export function isAaesContinuityReceipt(receipt) {
  return Boolean(receipt?.receipt_id && receipt?.event_type);
}
