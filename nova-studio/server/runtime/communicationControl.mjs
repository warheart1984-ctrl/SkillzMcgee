/**
 * Communication kill switch — global halt of all communication lanes.
 */
import {
  getCurrentContinuityScore,
  writeContinuityContainmentTick,
} from "./continuityFold.mjs";
import { broadcastStudioState } from "./broadcaster.mjs";

let COMM_HALTED = false;
let haltMeta = null;

export function activateCommunicationKillSwitch(operator_id, rationale) {
  COMM_HALTED = true;
  haltMeta = {
    operator_id: operator_id ?? "operator:local",
    rationale: rationale ?? "Operator activated communication kill switch",
    activated_at: new Date().toISOString(),
  };

  const tick = writeContinuityContainmentTick({
    entry_type: "communicationKillSwitchTick",
    trigger: "communication",
    continuity_score: getCurrentContinuityScore(),
    state: "HALTED",
    metadata: haltMeta,
  });

  broadcastStudioState({ communication_halted: true, kill_switch: tick });
  return { halted: true, tick, ...haltMeta };
}

export function deactivateCommunicationKillSwitch(operator_id, rationale) {
  COMM_HALTED = false;
  const meta = {
    operator_id: operator_id ?? "operator:local",
    rationale: rationale ?? "Operator released communication kill switch",
    released_at: new Date().toISOString(),
  };

  const tick = writeContinuityContainmentTick({
    entry_type: "communicationKillSwitchReleaseTick",
    trigger: "communication",
    continuity_score: getCurrentContinuityScore(),
    state: "OK",
    metadata: meta,
  });

  haltMeta = null;
  broadcastStudioState({ communication_halted: false, kill_switch_release: tick });
  return { halted: false, tick, ...meta };
}

export function isCommunicationHalting() {
  return COMM_HALTED;
}

export function getKillSwitchState() {
  return { halted: COMM_HALTED, ...(haltMeta ?? {}) };
}

export function guardCommunicationIO() {
  if (isCommunicationHalting()) {
    throw new Error("Communication subsystem halted by Kill Switch");
  }
}
