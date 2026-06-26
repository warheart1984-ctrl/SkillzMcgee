/**
 * DAR-Z continuity gap tensors (v0 lite).
 * Three registers from Stewardship Transfer: decision environment,
 * perception/salience, failure history.
 */

/**
 * @typedef {Object} DarzTensors
 * @property {{ count: number, recent: Array<{ id: string, violations?: string[] }> }} failureHistory
 * @property {{ runs: number, lastIntent: unknown, rejectionRate: number }} decisionEnvironment
 * @property {{ okRatio: number, recent: Array<{ id: string, slice: string, salient: boolean }> }} perceptionSalience
 */

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} receipts
 * @returns {DarzTensors}
 */
export function buildDarzTensors(receipts) {
  const failures = receipts.filter(
    (r) => r.status === "error" || r.laws?.allowed === false
  );
  const rejected = receipts.filter((r) => r.laws?.allowed === false);
  const okCount = receipts.filter((r) => r.status === "ok").length;

  const last = receipts.at(-1);
  const lastIntent =
    last && typeof last.intent === "object" ? last.intent : null;

  return {
    failureHistory: {
      count: failures.length,
      recent: failures.slice(-5).map((f) => ({
        id: f.id,
        violations: f.laws?.violations,
      })),
    },
    decisionEnvironment: {
      runs: receipts.length,
      lastIntent,
      rejectionRate:
        receipts.length > 0 ? rejected.length / receipts.length : 0,
    },
    perceptionSalience: {
      okRatio: receipts.length > 0 ? okCount / receipts.length : 0,
      recent: receipts.slice(-5).map((r) => ({
        id: r.id,
        slice: r.slice,
        salient: r.status === "ok" && r.laws?.allowed === true,
      })),
    },
  };
}
