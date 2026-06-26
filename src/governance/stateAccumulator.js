import { reduceLedger } from "./reducer.js";

/**
 * Live world state derived from the continuity ledger (K2).
 */
export class StateAccumulator {
  constructor() {
    /** @type {Record<string, import("./types.js").SliceState>} */
    this.state = {};
  }

  /**
   * @param {import("./types.js").GovernedReceipt} entry
   */
  applyEntry(entry) {
    this.state[entry.slice] = {
      lastOutput: entry.output,
      lastStatus: entry.status,
      lastRunId: entry.id,
      lastTimestamp: entry.timestamp,
    };
  }

  /**
   * @param {import("./continuityLedger.js").ContinuityLedger} ledger
   */
  rebuildFromLedger(ledger) {
    this.state = reduceLedger(ledger.all());
  }

  /**
   * @param {string} sliceId
   */
  getSliceState(sliceId) {
    return this.state[sliceId] ?? null;
  }

  snapshot() {
    return { ...this.state };
  }
}
