import { RECEIPT_STATUSES } from "./invariants.js";

/**
 * Validates receipt shape before append (K0).
 * @param {Record<string, unknown>} entry
 */
export function validateEntry(entry) {
  if (!entry || typeof entry !== "object") {
    throw new Error("K0: entry must be an object");
  }
  if (typeof entry.id !== "string" || !entry.id) {
    throw new Error("K0: id is required");
  }
  if (typeof entry.timestamp !== "string" || !entry.timestamp) {
    throw new Error("K0: timestamp is required");
  }
  if (typeof entry.slice !== "string" || !entry.slice) {
    throw new Error("K0: slice is required");
  }
  if (!RECEIPT_STATUSES.includes(entry.status)) {
    throw new Error(`K0: status must be one of ${RECEIPT_STATUSES.join(", ")}`);
  }
  if (!("output" in entry)) {
    throw new Error("K0: output is required");
  }
  if (!entry.laws || typeof entry.laws !== "object") {
    throw new Error("K0: laws result is required");
  }
  if (entry.laws.allowed === false) {
    const violations = entry.laws.violations;
    if (!Array.isArray(violations) || violations.length === 0) {
      throw new Error("K0: rejected intents must record violations");
    }
  }
  return true;
}
