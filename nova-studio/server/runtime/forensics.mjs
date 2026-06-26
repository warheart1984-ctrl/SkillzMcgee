/**
 * Forensic runtime — receipt diff, lineage, drift history, impact, investigation.
 */

import { getLedger } from "./studioRuntime.mjs";
import { mapReceiptToEnvelope } from "./substrateState.mjs";
import { evaluateLawKernel } from "./lawKernel.mjs";
import { computeProvenance } from "./provenance.mjs";
import {
  resolveImplementationNode,
  transitiveClosure,
} from "./proofGraphForensics.mjs";
import { loadGovernanceLedger } from "./constitutionalData.mjs";
import { replayContinuity, loadContinuityState } from "../../../substrate/continuity-substrate.mjs";
import { runSlice } from "../../../substrate/runSlice.mjs";

export function getReceiptById(receiptId) {
  const receipt = getLedger().find((r) => r.id === receiptId);
  if (!receipt) throw new Error(`Receipt not found: ${receiptId}`);
  return receipt;
}

export function diffReceipts(aId, bId) {
  const a = getReceiptById(aId);
  const b = getReceiptById(bId);

  const diff = {
    changedFields: [],
    addedFields: [],
    removedFields: [],
  };

  const aKeys = Object.keys(a.output ?? {});
  const bKeys = Object.keys(b.output ?? {});

  for (const key of aKeys) {
    if (!bKeys.includes(key)) diff.removedFields.push(key);
    else if (JSON.stringify(a.output[key]) !== JSON.stringify(b.output[key])) {
      diff.changedFields.push({
        field: key,
        before: a.output[key],
        after: b.output[key],
      });
    }
  }

  for (const key of bKeys) {
    if (!aKeys.includes(key)) diff.addedFields.push(key);
  }

  return diff;
}

export function buildReceiptLineage(rootId) {
  const receipts = getLedger();
  const byId = Object.fromEntries(receipts.map((r) => [r.id, r]));

  /** @type {Record<string, string[]>} */
  const children = {};
  for (const r of receipts) {
    const parent = r.parentId;
    if (parent) {
      if (!children[parent]) children[parent] = [];
      children[parent].push(r.id);
    }
  }

  function build(id) {
    const node = byId[id];
    if (!node) return null;
    return {
      id,
      capabilityId: node.capability ?? node.slice,
      timestamp: node.timestamp,
      children: (children[id] ?? []).map(build).filter(Boolean),
    };
  }

  return build(rootId);
}

export function verdictForReceipt(receipt) {
  if (receipt.verdict) return receipt.verdict;
  const envelope = mapReceiptToEnvelope(receipt);
  return evaluateLawKernel({
    capabilityId: receipt.capability ?? receipt.slice,
    output: receipt.output,
    outputHash: receipt.outputHash ?? envelope.outputHash,
    timestamp: receipt.timestamp,
    envelope,
  });
}

export function computeDriftHistory() {
  const history = getLedger().map((r) => {
    const drift = verdictForReceipt(r).drift ?? [];
    return {
      id: r.id,
      timestamp: r.timestamp,
      driftCount: drift.length,
    };
  });

  return history.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

export function computeDriftAnomalies() {
  const points = getLedger().map((r) => {
    const driftCount = (verdictForReceipt(r).drift ?? []).length;
    return { id: r.id, timestamp: r.timestamp, driftCount };
  });

  if (!points.length) return [];

  const mean = points.reduce((sum, p) => sum + p.driftCount, 0) / points.length;
  const variance =
    points.reduce((sum, p) => sum + (p.driftCount - mean) ** 2, 0) / points.length;
  const std = Math.sqrt(variance);

  return points.map((p) => ({
    ...p,
    anomalyScore: std === 0 ? 0 : (p.driftCount - mean) / std,
    isAnomaly: std !== 0 && p.driftCount - mean > 2 * std,
  }));
}

export async function computeImpact(receipt) {
  const capId = receipt.capability ?? receipt.slice;
  const impl = resolveImplementationNode(capId);
  return transitiveClosure(impl.id);
}

export async function computeGovernanceImpact(decisionId) {
  const ledgerLines = loadGovernanceLedger();
  const decision =
    ledgerLines.find((e) => e.id === decisionId) ??
    ledgerLines.find((e) => e.entry_id === decisionId);

  if (!decision) throw new Error("Decision not found");

  const affectedNodes = decision.targets ?? [decision.subject].filter(Boolean);
  const closure = new Set();
  for (const node of affectedNodes) {
    for (const id of transitiveClosure(node)) {
      closure.add(id);
    }
  }

  return {
    decision,
    affectedNodes,
    transitiveClosure: [...closure],
  };
}

export function replayContinuityFromCheckpoint(checkpoint) {
  const full = replayContinuity();
  if (checkpoint == null || checkpoint === "") {
    return full;
  }

  const cpStr = String(checkpoint);
  if (/^\d{5}$/.test(cpStr)) {
    const n = Number(cpStr);
    return {
      ...full,
      checkpoint: cpStr,
      events: full.events.slice(0, n),
      replayedFrom: checkpoint,
    };
  }

  const state = loadContinuityState();
  const idx = state.events.findIndex((e) => e.timestamp >= cpStr);
  const end = idx === -1 ? state.events.length : idx + 1;
  return {
    ...full,
    checkpoint: String(end).padStart(5, "0"),
    events: state.events.slice(0, end),
    replayedFrom: checkpoint,
  };
}

export async function replaySlice(receiptId) {
  const receipt = getReceiptById(receiptId);
  const capabilityId = receipt.capability ?? receipt.slice;
  const result = await runSlice({
    operator: receipt.actor ?? "operator:replay",
    capabilityId,
    input: receipt.intent ?? {},
    parentReceiptId: receiptId,
  });

  const provenance = await computeProvenance({
    receipt: result.receipt,
    envelope: result.envelope,
    capabilityId,
  });

  return {
    newReceipt: result.receipt,
    verdict: result.verdict,
    provenance,
    envelope: result.envelope,
    drift: result.drift,
    continuity: result.continuity,
  };
}

export async function replaySlices(receiptIds) {
  const results = [];
  for (const id of receiptIds) {
    results.push({ originalId: id, ...(await replaySlice(id)) });
  }
  return results;
}

export async function investigateReceipt(receiptId) {
  const receipt = getReceiptById(receiptId);
  const envelope = mapReceiptToEnvelope(receipt);
  const lineage = buildReceiptLineage(receiptId);
  const impact = await computeImpact(receipt);
  const anomalies = computeDriftAnomalies();
  const continuity = replayContinuityFromCheckpoint(
    envelope.continuityCheckpoint ?? receipt.timestamp,
  );
  const verdict = verdictForReceipt(receipt);
  const provenance =
    receipt.provenance ??
    (await computeProvenance({ receipt, envelope, capabilityId: receipt.capability ?? receipt.slice }));

  return {
    ok: true,
    type: "receipt",
    receipt: { ...receipt, verdict, provenance },
    lineage,
    impact,
    anomalies,
    continuity,
    verdict,
    provenance,
  };
}

export async function investigateDecision(decisionId) {
  const impact = await computeGovernanceImpact(decisionId);
  const anomalies = computeDriftAnomalies();

  return {
    ok: true,
    type: "decision",
    impact,
    anomalies,
  };
}
