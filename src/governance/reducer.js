/**
 * Deterministic fold: state = reduce(ledger) (K2).
 * @param {import("./types.js").GovernedReceipt[]} entries
 * @returns {Record<string, import("./types.js").SliceState>}
 */
export function reduceLedger(entries) {
  /** @type {Record<string, import("./types.js").SliceState>} */
  const state = {};
  for (const entry of entries) {
    state[entry.slice] = {
      lastOutput: entry.output,
      lastStatus: entry.status,
      lastRunId: entry.id,
      lastTimestamp: entry.timestamp,
    };
  }
  return state;
}
