/**
 * Ledger replay — independently recompute indicators from recorded cosmos.
 */

import { projectFace } from "../faces/index.js";
import {
  computeBacklash,
  computeIndicators,
  dominantTensionKey,
} from "../cockpit/indicators.js";
import { tierToScore } from "../cockpit/tierScore.js";

/**
 * Recompute face projections and indicators from cosmos (ignores stored faces).
 * @param {import("../cockpit/indicators.js").ZoneTick} zoneTick
 */
export function replayFromLedger(zoneTick) {
  const cosmos = zoneTick.cosmos;

  const rpg = projectFace("rpg", cosmos);
  const gov = projectFace("governance", cosmos);
  const scr = projectFace("scripture", cosmos);
  const cos = projectFace("cosmology", cosmos);

  const mode = dominantTensionKey(cosmos);
  const backlash = computeBacklash(cosmos);
  const tierScore = tierToScore(cos.tier);
  const risk = tierScore + (backlash >= 5 ? 1 : 0);

  return {
    mode,
    backlash,
    tier: cos.tier,
    posture: gov.posture,
    verse: scr.verse,
    risk,
    faces: {
      rpg: { mode: rpg.mode, backlash: rpg.backlash, cycle: rpg.cycle },
      governance: { posture: gov.posture, dominantTension: gov.dominantTension },
      scripture: { verse: scr.verse, ordering: scr.ordering },
      cosmology: { tier: cos.tier, metrics: cos.metrics },
    },
  };
}

/**
 * Verify stored faces match independent replay.
 * @param {import("../cockpit/indicators.js").ZoneTick} zoneTick
 */
export function assertReplayConsistency(zoneTick) {
  const fromLedger = computeIndicators(zoneTick);
  const replayed = replayFromLedger(zoneTick);

  const mismatches = [];
  for (const key of ["mode", "backlash", "tier", "posture", "verse", "risk"]) {
    if (fromLedger[key] !== replayed[key]) {
      mismatches.push(`${key}: ledger=${fromLedger[key]} replay=${replayed[key]}`);
    }
  }
  return { ok: mismatches.length === 0, mismatches, fromLedger, replayed };
}
