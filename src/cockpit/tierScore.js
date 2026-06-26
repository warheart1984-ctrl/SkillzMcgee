/**
 * Cosmology tier → numeric risk score (cockpit-indicators.md §2.8).
 * Canonical mapping — must match Cosmology Face thresholds.
 */

/** @type {Record<string, number>} */
export const TIER_SCORES = {
  Prime: 0,
  "Anti-Prime": 1,
  Paradox: 2,
  Return: 1,
  "Hyper-Prime": 3,
};

/**
 * @param {string | undefined} tier
 * @returns {number}
 */
export function tierToScore(tier) {
  switch (tier) {
    case "Prime":
      return 0;
    case "Anti-Prime":
      return 1;
    case "Paradox":
      return 2;
    case "Return":
      return 1;
    case "Hyper-Prime":
      return 3;
    default:
      return 0;
  }
}
