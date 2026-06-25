/**
 * AS-Ω — Full singularity fold orchestrator
 *
 * Inputs:  governed ledger (CRK-1 compatible), slice state, agent metadata
 * Output:  ASΩ object with fingerprint, merkle roots, wave, DAR-Z fields, lineages
 */

import { attachLineageChain, buildLineages } from "./lineage.js";
import { hashReceipt, merkleRoot, hashPayload } from "./merkle.js";
import { integrateWave } from "./nonlinearWave.js";
import { solveFields } from "./darzFields.js";

/**
 * Normalize ledger entries to a common receipt shape.
 */
function normalizeLedger(ledger) {
  return ledger.map((entry, i) => ({
    id: entry.id ?? entry.receipt_id ?? `receipt-${i}`,
    slice: entry.slice ?? entry.domain,
    actor: entry.actor ?? "skillz",
    input: entry.input,
    output: entry.output,
    timestamp: entry.timestamp ?? i,
    status: entry.status ?? "ok",
    meta: entry.meta ?? deriveMeta(entry),
  }));
}

function deriveMeta(entry) {
  const status = entry.status ?? "ok";
  return {
    salience: status === "ok" ? 0.5 : 0.2,
    failure: status === "error" ? 1.0 : 0.0,
    environment: 0.0,
  };
}

/**
 * Full ASΩ fold over a governed ledger.
 */
export function foldSingularity(ledger, options = {}) {
  const normalized = normalizeLedger(ledger);
  const withLineage = attachLineageChain(normalized);
  const lineages = buildLineages(withLineage);

  const hashes = withLineage.map((r) => hashReceipt(r));
  const globalRoot = merkleRoot(hashes);

  const lineageRoots = {};
  for (const [lineageId, receipts] of lineages) {
    const lineageHashes = receipts.map((r) => hashReceipt(r));
    lineageRoots[lineageId] = merkleRoot(lineageHashes);
  }

  const wave = integrateWave(withLineage);
  const darz = solveFields(withLineage);

  const fingerprint = hashPayload({
    globalRoot,
    wave,
    receiptCount: withLineage.length,
    lineageCount: lineages.size,
  });

  return {
    fingerprint,
    merkle: {
      globalRoot,
      lineageRoots,
      receiptHashes: hashes,
    },
    wave,
    darz,
    lineages: Object.fromEntries(lineages),
    ledger: withLineage,
    meta: {
      version: "AS-Ω",
      receiptCount: withLineage.length,
      ...options.meta,
    },
  };
}

export default foldSingularity;
