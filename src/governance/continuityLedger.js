import { validateEntry } from "./validator.js";

/**
 * Append-only continuity ledger (K1).
 */
export class ContinuityLedger {
  constructor() {
    /** @type {import("./types.js").GovernedReceipt[]} */
    this.entries = [];
    /** @type {Set<string>} */
    this._ids = new Set();
  }

  /**
   * @param {import("./types.js").GovernedReceipt} entry
   */
  append(entry) {
    validateEntry(entry);
    if (this._ids.has(entry.id)) {
      throw new Error("K1: duplicate receipt id — ledger is append-only");
    }
    this.entries.push(Object.freeze({ ...entry }));
    this._ids.add(entry.id);
    return entry.id;
  }

  all() {
    return [...this.entries];
  }

  byId(id) {
    return this.entries.find((e) => e.id === id) ?? null;
  }

  get length() {
    return this.entries.length;
  }

  /** Test-only reset; not for production governance paths. */
  _resetForTests() {
    this.entries = [];
    this._ids.clear();
  }
}
