/**
 * Build zoneTick ledger entries from zone state + face projections.
 */

import { projectFace } from "../faces/index.js";

let tickCounter = 0;

/**
 * @param {string} zoneId
 * @param {import("../tension/types.js").Tension} cosmos
 * @param {{ sourceEvents?: string[], timestamp?: string }} [meta]
 */
export function createZoneTick(zoneId, cosmos, meta = {}) {
  const rpg = projectFace("rpg", cosmos);
  const governance = projectFace("governance", cosmos);
  const scripture = projectFace("scripture", cosmos);
  const cosmology = projectFace("cosmology", cosmos);

  tickCounter += 1;
  const id = `zoneTick-${zoneId}-${tickCounter}`;

  return {
    id,
    zoneId,
    timestamp: meta.timestamp ?? new Date().toISOString(),
    cosmos: { ...cosmos },
    faces: {
      rpg: {
        mode: rpg.mode,
        backlash: rpg.backlash,
        cycle: { ...rpg.cycle },
      },
      governance: { posture: governance.posture },
      scripture: { verse: scripture.verse, ordering: [...scripture.ordering] },
      cosmology: { tier: cosmology.tier },
    },
    sourceEvents: meta.sourceEvents ?? [],
  };
}

/** Reset test counter */
export function resetZoneTickCounter() {
  tickCounter = 0;
}
