import { coreTick } from "../../cosmology/negotiant_core.js";
import { cloneCosmos, TENSION_KEYS } from "../../cosmology/core_contract.js";

/**
 * @param {import("./multizone.js").World} world
 * @param {string} zoneName
 * @param {keyof import("../../tension/types.js").Tension} tensionUsed
 * @returns {import("./multizone.js").Zone}
 */
export function applyPlayerAction(world, zoneName, tensionUsed) {
  const zone = world.getZone(zoneName);
  if (!zone) throw new Error(`Unknown zone: ${zoneName}`);
  if (!TENSION_KEYS.includes(tensionUsed)) {
    throw new Error(`Invalid tension: ${tensionUsed}`);
  }

  const next = cloneCosmos(zone.cosmos);
  next[tensionUsed] += 1;
  zone.cosmos = coreTick(next);
  return zone;
}
