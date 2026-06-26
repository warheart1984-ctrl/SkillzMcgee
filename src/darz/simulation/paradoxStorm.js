import { coreTick } from "../../cosmology/negotiant_core.js";
import { cloneCosmos, TENSION_KEYS } from "../../cosmology/core_contract.js";
import { projectFace } from "../../faces/index.js";
import { dominantTensionKey } from "../../cockpit/indicators.js";

const TIER_ORDER = ["Prime", "Anti-Prime", "Paradox", "Return", "Hyper-Prime"];

const OPPOSITES = {
  becoming: "resistance",
  resistance: "becoming",
  memory: "horizon",
  horizon: "memory",
};

/**
 * @param {import("./multizone.js").Zone} zone
 * @param {() => number} [rng]
 */
export function echoSurge(zone, rng = Math.random) {
  const next = cloneCosmos(zone.cosmos);
  next.memory += 2;
  zone.cosmos = coreTick(next);
  return {
    event: "Echo Surge",
    roll: Math.floor(rng() * 10) + 1,
    scripture: "The past reasserts itself.",
    zone: zone.name,
  };
}

/**
 * @param {import("./multizone.js").Zone} zone
 */
export function horizonShear(zone) {
  const next = cloneCosmos(zone.cosmos);
  next.horizon += 3;
  zone.cosmos = coreTick(next);
  return { event: "Horizon Shear", zone: zone.name };
}

/**
 * @param {import("./multizone.js").Zone} zone
 */
export function modeInversion(zone) {
  const dom = dominantTensionKey(zone.cosmos);
  const opp = OPPOSITES[dom];
  if (!opp) {
    const next = cloneCosmos(zone.cosmos);
    next.equilibrium = Math.max(0, next.equilibrium - 1);
    zone.cosmos = coreTick(next);
    return { event: "Mode Inversion", zone: zone.name, note: "Equilibrium destabilized" };
  }
  const next = cloneCosmos(zone.cosmos);
  const domVal = next[dom];
  next[dom] = next[opp];
  next[opp] = domVal;
  zone.cosmos = coreTick(next);
  return { event: "Mode Inversion", zone: zone.name, from: dom, to: opp };
}

/**
 * @param {import("./multizone.js").Zone} zone
 */
export function fractureEvent(zone) {
  return {
    event: "Fracture Event",
    zone: zone.name,
    subZones: [`${zone.name}-A`, `${zone.name}-B`],
    scripture: "Sundering Verse",
  };
}

/**
 * @param {import("./multizone.js").Zone} zone
 */
export function tensionCascade(zone) {
  const next = cloneCosmos(zone.cosmos);
  for (const key of TENSION_KEYS) next[key] += 1;
  zone.cosmos = coreTick(next);

  const cos = projectFace("cosmology", zone.cosmos);
  const idx = TIER_ORDER.indexOf(cos.tier);
  if (idx >= 0 && idx < TIER_ORDER.length - 1) {
    // commentary: tier escalation narrated; cosmos already spun
  }

  return {
    event: "Tension Cascade",
    zone: zone.name,
    tier: cos.tier,
    backlashReset: true,
  };
}

/**
 * @param {import("./multizone.js").Zone} zone
 * @param {() => number} [rng]
 */
export function hyperPrimeRewrite(zone, rng = Math.random) {
  const next = {};
  for (const key of TENSION_KEYS) {
    next[key] = Math.floor(rng() * 8);
  }
  zone.cosmos = coreTick(next);
  return {
    event: "Hyper-Prime Rewrite",
    zone: zone.name,
    alert: "CRITICAL",
    scripture: "And the world was rewritten in the image of its own contradiction.",
  };
}

/**
 * @param {import("./multizone.js").Zone} zone
 * @param {() => number} [rng]
 */
export function paradoxStorm(zone, rng = Math.random) {
  const rpg = projectFace("rpg", zone.cosmos);
  const roll = Math.floor(rng() * 10) + 1 + rpg.backlash;

  if (roll <= 4) return echoSurge(zone, rng);
  if (roll <= 7) return horizonShear(zone);
  if (roll <= 10) return modeInversion(zone);
  if (roll <= 13) return fractureEvent(zone);
  if (roll <= 16) return tensionCascade(zone);
  return hyperPrimeRewrite(zone, rng);
}
