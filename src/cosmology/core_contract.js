/**
 * Negotiant Core constitutional contract (v1.0.0).
 * Invariants, validation, and version — not interpretive faces.
 */

/** @typedef {import("../tension/types.js").Tension} Cosmos */

export const NEGOTIANT_CORE_VERSION = "1.0.0";

export const NEGOTIANT_GLYPH = "⟴";

export const NEGOTIANT_SENTENCE =
  "Reality is the recursive negotiation of tensions across all modes.";

/** @type {readonly (keyof Cosmos)[]} */
export const TENSION_KEYS = [
  "becoming",
  "resistance",
  "memory",
  "horizon",
  "equilibrium",
];

/** Max absolute tension per tick without governance override (§5.6). */
export const STABILITY_BOUND = 1000;

/**
 * @param {unknown} cosmos
 * @returns {cosmos is Cosmos}
 */
export function isValidCosmos(cosmos) {
  if (!cosmos || typeof cosmos !== "object") return false;
  for (const key of TENSION_KEYS) {
    const v = /** @type {Record<string, unknown>} */ (cosmos)[key];
    if (typeof v !== "number" || !Number.isFinite(v)) return false;
  }
  const keys = Object.keys(cosmos);
  if (keys.length !== TENSION_KEYS.length) return false;
  return TENSION_KEYS.every((k) => keys.includes(k));
}

/**
 * @param {Cosmos} cosmos
 * @returns {Cosmos}
 */
export function cloneCosmos(cosmos) {
  return {
    becoming: cosmos.becoming,
    resistance: cosmos.resistance,
    memory: cosmos.memory,
    horizon: cosmos.horizon,
    equilibrium: cosmos.equilibrium,
  };
}

/**
 * @param {Cosmos} cosmos
 * @returns {boolean}
 */
export function withinStabilityBound(cosmos) {
  return TENSION_KEYS.every((k) => Math.abs(cosmos[k]) <= STABILITY_BOUND);
}

/**
 * @param {Cosmos} before
 * @param {Cosmos} after
 * @returns {{ ok: boolean, violations: string[] }}
 */
export function assertTransitionInvariants(before, after) {
  /** @type {string[]} */
  const violations = [];
  if (!isValidCosmos(before)) violations.push("pre-state invalid");
  if (!isValidCosmos(after)) violations.push("post-state invalid");
  if (!withinStabilityBound(after)) violations.push("post-state exceeds stability bound");
  const beforeKeys = Object.keys(before).sort();
  const afterKeys = Object.keys(after).sort();
  if (beforeKeys.join() !== afterKeys.join()) violations.push("shape changed");
  return { ok: violations.length === 0, violations };
}
