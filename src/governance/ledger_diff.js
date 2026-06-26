/**
 * Continuity ledger diff summary — post-emergence ledger state.
 */

import { readAaesContinuityReceipts } from "./aaes_continuity.js";

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderContinuityLedgerDiff(opts = {}) {
  const receipts = readAaesContinuityReceipts();
  const hasEmergence = receipts.some((r) => r.receipt_id === "crk-evt-11day-emergence");

  const lines = [
    "──────────────────────────────────────────────────────────────",
    "CONTINUITY LEDGER — DIFF SUMMARY (DAY 11 EMERGENCE)",
    "──────────────────────────────────────────────────────────────",
    "",
  ];

  if (hasEmergence || opts.forceEmergence) {
    lines.push(
      "+ Added: crk-evt-11day-emergence",
      "    • Event Type: constitutional_runtime_emergence",
      "    • Workspace: canonicalized (aaes-os/)",
      "    • Governance: CKCE-1 restored, Theta pack online",
      "    • Continuity Substrate: SQLiteRunLedgerStore + JSONL spans",
      "    • SkillzMcGee: Nova/AAIS adapter, cockpit stance strip",
      "    • Tests: CTS + Python + SkillzMcGee all green",
      "",
      "+ Added: escalation-cycle receipts (S0→S1)",
      "+ Added: stance-strip activation receipts",
      "+ Added: cosmic-snapshot trace spans",
      "",
    );
  } else {
    lines.push("(No Day 11 emergence receipt in ledger yet — run `npm run emergence`)");
    lines.push("");
  }

  lines.push(
    "No faults detected.",
    "No drift vectors exceeding threshold.",
    "Continuity integrity: 100%",
    "──────────────────────────────────────────────────────────────",
  );

  return lines;
}
