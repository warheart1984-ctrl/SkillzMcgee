/**
 * Continuity ledger — append substration receipts with governance fields.
 */

import fs from "node:fs";
import path from "node:path";

/** Default JSONL path (mirrors Python skillzmcgee package). */
export const DEFAULT_RECEIPTS_JSONL = path.join(
  process.cwd(),
  ".runtime",
  "skillzmcgee",
  "receipts.jsonl",
);

/**
 * @param {string} [customPath]
 * @returns {string}
 */
export function receiptsJsonlPath(customPath) {
  return customPath ?? process.env.SKILLZMCGEE_RECEIPTS_PATH ?? DEFAULT_RECEIPTS_JSONL;
}

/**
 * @param {import('./receipts.js').SubstrationReceipt} receipt
 * @param {string} [filePath]
 */
export function appendReceiptJsonl(receipt, filePath) {
  const target = receiptsJsonlPath(filePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.appendFileSync(target, `${JSON.stringify(receipt)}\n`, "utf8");
}

/**
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 * @param {import('./receipts.js').SubstrationReceipt} receipt
 */
export async function appendSubstrationReceipt(ledger, receipt) {
  ledger.log("SUBSTRATION_RECEIPT", {
    ...receipt,
    stream: "continuity",
    appendOnly: true,
  });
  appendReceiptJsonl(receipt);
}

/**
 * Read substration receipts from cosmic stream.
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 * @returns {import('./receipts.js').SubstrationReceipt[]}
 */
export function readSubstrationReceipts(ledger) {
  return ledger
    .readStream()
    .filter((e) => e.type === "SUBSTRATION_RECEIPT")
    .map((e) => e.payload);
}

/**
 * Read receipts from JSONL file.
 * @param {string} [filePath]
 * @returns {import('./receipts.js').SubstrationReceipt[]}
 */
export function readReceiptsJsonl(filePath) {
  const target = receiptsJsonlPath(filePath);
  if (!fs.existsSync(target)) return [];
  const lines = fs.readFileSync(target, "utf8").split("\n");
  /** @type {import('./receipts.js').SubstrationReceipt[]} */
  const receipts = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      receipts.push(JSON.parse(trimmed));
    } catch {
      // skip malformed lines
    }
  }
  return receipts;
}

/**
 * Print receipts CLI summary.
 * @param {string} [filePath]
 */
export function printReceiptsCli(filePath) {
  const receipts = readReceiptsJsonl(filePath);
  console.log("Substration Receipts:\n");
  if (receipts.length === 0) {
    console.log("(no receipts — run a federation tick or constitutional execution first)\n");
    return;
  }
  for (const r of receipts) {
    console.log(`${r.timestamp} ${r.substrationId} ${r.governanceObjectiveId}`);
    console.log(`  policyOutcome: ${r.policyOutcome}`);
    console.log(`  state: ${r.stateTransitionSummary}\n`);
  }
}
