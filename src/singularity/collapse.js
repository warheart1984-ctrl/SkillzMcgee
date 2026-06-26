/**
 * AS-Ω collapse operator — partial subsystem reset without full genesis
 */

import { foldSingularity } from "./absoluteSingularity.js";
import { hashPayload } from "./merkle.js";

/**
 * Collapse a subsystem by filtering ledger entries and re-folding.
 * @param {any[]} ledger
 * @param {string} subsystemId - slice name or lineage id to collapse
 * @param {object} [options]
 */
export function collapseSubsystem(ledger, subsystemId, options = {}) {
  const entries = ledger ?? [];
  const keep = entries.filter((e) => {
    const slice = e.slice ?? e.domain ?? "";
    const lineage = e.lineageId ?? e.output?.lineageId ?? "";
    if (options.mode === "lineage") return lineage !== subsystemId;
    return slice !== subsystemId;
  });

  const collapsed = foldSingularity(keep, {
    meta: {
      collapsedSubsystem: subsystemId,
      collapsedAt: Date.now(),
      priorReceiptCount: entries.length,
      remainingReceiptCount: keep.length,
    },
  });

  return {
    subsystemId,
    fingerprint: collapsed.fingerprint,
    merkle: collapsed.merkle,
    removedCount: entries.length - keep.length,
    remainingCount: keep.length,
    collapseReceipt: {
      type: "COLLAPSE_TRIGGERED",
      subsystemId,
      priorRoot: entries.length ? hashPayload(entries.map((e) => e.id)) : null,
      postRoot: collapsed.merkle?.globalRoot,
      timestamp: Date.now(),
    },
  };
}

/**
 * @param {any[]} ledger
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} [cosmicLedger]
 */
export function createAsOmegaServices(ledger, cosmicLedger = null) {
  let lastFold = null;

  return {
    get lastFold() {
      return lastFold;
    },

    fold(currentLedger = ledger) {
      lastFold = foldSingularity(currentLedger ?? []);
      return lastFold;
    },

    async collapseSubsystem(subsystemId, options = {}) {
      const result = collapseSubsystem(ledger ?? [], subsystemId, options);
      lastFold = foldSingularity(
        (ledger ?? []).filter((e) => {
          const slice = e.slice ?? e.domain ?? "";
          return slice !== subsystemId;
        }),
      );
      if (cosmicLedger) {
        cosmicLedger.log("COLLAPSE_TRIGGERED", result.collapseReceipt);
      }
      return result;
    },
  };
}
