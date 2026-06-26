import { reduceLedger } from "../governance/reducer.js";

/**
 * K4 — slice state must be derivable from ledger alone.
 * @param {Record<string, import("../governance/types.js").SliceState>} sliceState
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function verifyReconstructable(sliceState, entries) {
  const rebuilt = reduceLedger(entries);
  return JSON.stringify(rebuilt) === JSON.stringify(sliceState);
}
