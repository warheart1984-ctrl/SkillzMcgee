import { projectFace } from "../../faces/index.js";

/**
 * @param {import("./multizone.js").Zone} zone
 * @returns {boolean}
 */
export function checkParadox(zone) {
  const cos = projectFace("cosmology", zone.cosmos);
  if (cos.tier === "Paradox" || cos.tier === "Hyper-Prime") {
    zone.cosmos.horizon += 2;
    zone.cosmos.memory += 2;
    return true;
  }
  return false;
}

/**
 * Whether a paradox storm may trigger.
 * @param {import("./multizone.js").Zone} zone
 */
export function shouldTriggerParadoxStorm(zone) {
  const cos = projectFace("cosmology", zone.cosmos);
  const rpg = projectFace("rpg", zone.cosmos);
  return (
    cos.tier === "Paradox" ||
    cos.tier === "Hyper-Prime" ||
    rpg.backlash >= 5
  );
}
