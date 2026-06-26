/**
 * Cosmic ledger — append-only stream for substration / federation narrative
 */

/**
 * @typedef {Object} CosmicLedger
 * @property {(eventType: string, payload: any) => void} log
 * @property {() => any[]} readStream
 */

/**
 * @param {any} baseLedger
 * @returns {CosmicLedger}
 */
export function createCosmicLedger(baseLedger) {
  /** @type {any[]} */
  const cosmicStream = baseLedger?.cosmicStream ?? [];

  if (!baseLedger.cosmicStream) {
    baseLedger.cosmicStream = cosmicStream;
  }

  return {
    log(eventType, payload) {
      const entry = {
        stream: "cosmic",
        type: eventType,
        payload,
        timestamp: Date.now(),
      };
      cosmicStream.push(entry);
      if (typeof baseLedger.append === "function") {
        baseLedger.append({ ...entry, slice: "cosmic", actor: "substration", status: "ok" });
      }
    },
    readStream() {
      return [...cosmicStream];
    },
  };
}
