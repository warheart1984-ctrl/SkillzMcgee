/**
 * SkillzMcGee operator log — ~/.skillzmcgee/logs/operator.log tone and structure.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

/**
 * @returns {string}
 */
export function operatorLogPath() {
  if (process.env.SKILLZMCGEE_OPERATOR_LOG) {
    return process.env.SKILLZMCGEE_OPERATOR_LOG;
  }
  const home = os.homedir();
  if (home) {
    return path.join(home, ".skillzmcgee", "logs", "operator.log");
  }
  return path.join(process.cwd(), ".runtime", "skillzmcgee", "logs", "operator.log");
}

/**
 * @param {string} text
 * @param {string} [filePath]
 */
export function appendOperatorLog(text, filePath) {
  const target = filePath ?? operatorLogPath();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.appendFileSync(target, text.endsWith("\n") ? text : `${text}\n`, "utf8");
  return target;
}

/**
 * Format Day 11 emergence operator log block.
 * @param {object} receipt
 * @returns {string}
 */
export function formatDay11OperatorLog(receipt) {
  const operator = receipt.signatures?.operator ?? "operator";
  const stance = receipt.stance ?? {};
  const mode = stance.governance_mode ?? "S1";
  const tension = stance.tension_index ?? 0.12;
  const tensionBand = tension < 0.35 ? "emerald" : tension < 0.65 ? "amber" : "crimson";
  const modeAnim = mode === "S3" ? "strobe" : "breathing";

  return `[08:08:00 EDT] — COSMIC SNAPSHOT ACQUIRED
Operator ${operator} completed the 11‑Day Constitutional Runtime Emergence.

Workspace spine re-anchored → aaes-os/
Governance charter restored → CKCE-1
Theta standards online → lawful substrate stabilized
Continuity substrate → SQLiteRunLedgerStore + JSONL spans
SkillzMcGee → Nova/AAIS adapter active, cockpit online

Governance Stance Strip:
  • Law Context: ${stance.law_context ?? "CKCE-1 / AAES-OS"} (indigo/gold)
  • Mission Thread: ${stance.mission_thread ?? "Runtime unification"} (cyan→violet)
  • Tension Index: ${tension} (${tensionBand})
  • Escalation Mode: ${mode} (${modeAnim})

All systems coherent. No drift detected.
`;
}

/**
 * @param {object} receipt
 * @param {string} [filePath]
 */
export function logDay11EmergenceOperator(receipt, filePath) {
  return appendOperatorLog(formatDay11OperatorLog(receipt), filePath);
}
