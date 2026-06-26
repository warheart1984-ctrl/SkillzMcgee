import { projectFace } from "../../faces/index.js";

const POSTURE_ACTIONS = {
  Propose: "expand",
  Refine: "fortify",
  Review: "archive",
  Forecast: "scout",
  Ratify: "consolidate",
};

/**
 * @param {{ id: string, actions?: string[] }} faction
 * @param {import("../simulation/multizone.js").Zone} zone
 */
export function factionStep(faction, zone) {
  const gov = projectFace("governance", zone.cosmos);
  const action = POSTURE_ACTIONS[gov.posture] ?? "observe";

  if (!faction.actions) faction.actions = [];
  faction.actions.push({ zone: zone.name, posture: gov.posture, action });

  return { factionId: faction.id, posture: gov.posture, action };
}
