import { projectFace } from "../../faces/index.js";

/**
 * @param {import("../simulation/multizone.js").Zone} zone
 * @param {{ write: (entry: object) => void }} logger
 */
export function logZoneTick(zone, logger) {
  const scr = projectFace("scripture", zone.cosmos);
  logger.write({
    zone: zone.name,
    verse: scr.verse,
    ordering: scr.ordering,
    timestamp: Date.now(),
  });
}
