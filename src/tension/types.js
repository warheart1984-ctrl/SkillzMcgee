/**
 * TENSION language — types and modal modes.
 */

/** @typedef {{ becoming: number, resistance: number, memory: number, horizon: number, equilibrium: number }} Tension */

/** @type {readonly string[]} */
export const MODES = [
  "NEGOTIATE",
  "REFUSE",
  "GENERATE",
  "SCALE",
  "DISSOLVE",
  "REBIRTH",
  "PARADOX",
  "INVERT",
  "AUTHOR",
  "GOVERN",
];

/**
 * @param {Partial<Tension>} partial
 * @returns {Tension}
 */
export function tension(partial = {}) {
  return {
    becoming: partial.becoming ?? 5,
    resistance: partial.resistance ?? 5,
    memory: partial.memory ?? 5,
    horizon: partial.horizon ?? 5,
    equilibrium: partial.equilibrium ?? 5,
  };
}

/**
 * @param {string} mode
 * @returns {mode is typeof MODES[number]}
 */
export function isMode(mode) {
  return MODES.includes(mode);
}

/**
 * @param {Tension} t
 * @returns {Record<string, number>}
 */
export function tensionToRecord(t) {
  return {
    becoming: t.becoming,
    resistance: t.resistance,
    memory: t.memory,
    horizon: t.horizon,
    equilibrium: t.equilibrium,
  };
}
