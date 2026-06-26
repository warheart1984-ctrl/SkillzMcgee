/**
 * Content fingerprint for a continuity ledger (AS-1 anchor).
 * Sync FNV-1a — works in browser and Node test runner.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function ledgerFingerprint(entries) {
  const payload = entries
    .map((e) => `${e.id}|${e.timestamp}|${e.status}|${e.slice}`)
    .join("\n");
  let h = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `AS-${(h >>> 0).toString(16).padStart(8, "0")}`;
}
