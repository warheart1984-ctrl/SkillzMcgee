/**
 * Day 11 Constitutional Runtime Emergence — record all artifacts.
 */

import path from "node:path";
import {
  appendAaesContinuityReceipt,
  appendTraceSpan,
  loadDay11EmergenceReceipt,
  aaesReceiptsPath,
  DEFAULT_TRACE_SPANS_JSONL,
} from "./aaes_continuity.js";
import { logDay11EmergenceOperator, operatorLogPath } from "./operator_log.js";
import { setEscalationMode } from "./escalation.js";
import {
  renderCosmicSnapshotDay11,
  writeCosmicSnapshotFile,
} from "../cosmic/cosmic_snapshot.js";
import { emergenceEventFromReceipt } from "../ui/event_tile.js";
import { buildStanceStripModel } from "../ui/stance_models.js";
import { readAaesContinuityReceipts } from "./aaes_continuity.js";

const DAY11_RECEIPT_ID = "crk-evt-11day-emergence";

/**
 * @param {object} [opts]
 * @param {string} [opts.repoRoot]
 * @param {string} [opts.operator]
 * @param {boolean} [opts.setGovernanceMode] - apply S1 from receipt stance
 */
export function recordDay11Emergence(opts = {}) {
  const repoRoot = opts.repoRoot ?? process.cwd();
  const receipt = loadDay11EmergenceReceipt(repoRoot);
  if (opts.operator) {
    receipt.signatures = { ...receipt.signatures, operator: opts.operator };
  }

  const existing = readAaesContinuityReceipts().some((r) => r.receipt_id === DAY11_RECEIPT_ID);
  const receiptsPath = existing
    ? aaesReceiptsPath()
    : appendAaesContinuityReceipt(receipt);

  let operatorPath = operatorLogPath();
  let tracesPath = DEFAULT_TRACE_SPANS_JSONL;

  if (!existing) {
    operatorPath = logDay11EmergenceOperator(receipt);

    const span = {
      span_id: `trace-${receipt.receipt_id}`,
      timestamp: receipt.timestamp,
      name: receipt.event_type,
      receipt_id: receipt.receipt_id,
      runtime: receipt.signatures?.runtime ?? "AAES-OS",
      sink: "FileTraceSink",
    };
    tracesPath = appendTraceSpan(span);

    if (opts.setGovernanceMode !== false) {
      const mode = receipt.stance?.governance_mode ?? "S1";
      setEscalationMode(mode, {
        cause: "Day 11 constitutional runtime emergence",
        actor: receipt.signatures?.operator ?? "emergence",
      });
    }
  }

  const snapshotText = renderCosmicSnapshotDay11({
    day: 11,
    operator: receipt.signatures?.operator ?? "jon",
  });
  const snapshotPath = path.join(repoRoot, ".runtime", "skillzmcgee", "cosmic_snapshot_day11.txt");
  writeCosmicSnapshotFile(snapshotText, snapshotPath);

  const eventTile = emergenceEventFromReceipt(receipt);
  const stanceModel = buildStanceStripModel({
    charterJustActivated: true,
    tensionIndex: receipt.stance?.tension_index ?? 0.12,
    missionThread: {
      focus: receipt.stance?.mission_thread ?? "Runtime unification + cockpit activation",
      threadId: receipt.receipt_id,
      progressPct: 100,
      coherencePct: 96,
      lineage: ["anchor", "restore", "unify", "activate"],
    },
    healthStatus: "healthy",
  });

  return {
    receipt,
    receiptsPath,
    operatorPath,
    tracesPath,
    snapshotPath,
    eventTile,
    stanceModel,
    snapshotText,
  };
}
