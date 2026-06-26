/**
 * Cockpit indicators — reproducible from zoneTick evidence (cockpit-indicators.md v1.0.0).
 */

import { TENSION_KEYS } from "../cosmology/core_contract.js";
import { tierToScore } from "./tierScore.js";

/**
 * @param {import("../tension/types.js").Tension} cosmos
 * @returns {string}
 */
export function dominantTensionKey(cosmos) {
  let best = TENSION_KEYS[0];
  let bestVal = cosmos[best];
  for (const key of TENSION_KEYS) {
    if (cosmos[key] > bestVal) {
      best = key;
      bestVal = cosmos[key];
    }
  }
  return best;
}

/**
 * @param {import("../tension/types.js").Tension} cosmos
 * @returns {number}
 */
export function computeBacklash(cosmos) {
  const values = TENSION_KEYS.map((k) => cosmos[k]);
  return Math.max(...values) - Math.min(...values);
}

/**
 * @typedef {{
 *   id?: string,
 *   zoneId?: string,
 *   timestamp?: string,
 *   cosmos: import("../tension/types.js").Tension,
 *   faces?: {
 *     rpg?: { mode?: string, backlash?: number, cycle?: object },
 *     governance?: { posture?: string },
 *     scripture?: { verse?: string, ordering?: string[] },
 *     cosmology?: { tier?: string },
 *   },
 * }} ZoneTick
 */

/**
 * @param {ZoneTick} zoneTick
 * @returns {{
 *   mode: string,
 *   backlash: number,
 *   tier: string | undefined,
 *   posture: string | undefined,
 *   verse: string | undefined,
 *   risk: number,
 * }}
 */
export function computeIndicators(zoneTick) {
  const t = zoneTick.cosmos;
  const mode = dominantTensionKey(t);
  const backlash = computeBacklash(t);

  const tier = zoneTick.faces?.cosmology?.tier;
  const posture = zoneTick.faces?.governance?.posture;
  const verse = zoneTick.faces?.scripture?.verse;

  const tierScore = tierToScore(tier);
  const risk = tierScore + (backlash >= 5 ? 1 : 0);

  return { mode, backlash, tier, posture, verse, risk };
}
