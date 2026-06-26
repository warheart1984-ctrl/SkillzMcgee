/**
 * RPG archetype labels — interpretive layer over validated RPG face `mode`.
 * Not constitutional.
 */

/** @type {Record<string, string>} */
export const MODE_ARCHETYPE = {
  Becoming: "Initiator",
  Resistance: "Defender",
  Memory: "Keeper",
  Horizon: "Seer",
  Equilibrium: "Balancer",
};

/**
 * @param {string} mode — dominant tension name from RPG face
 * @returns {string}
 */
export function archetypeForMode(mode) {
  return MODE_ARCHETYPE[mode] ?? mode;
}
