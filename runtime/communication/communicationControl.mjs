let COMM_HALTED = false;

export function activateCommunicationKillSwitch(operator_id, rationale, writer) {
  COMM_HALTED = true;
  return writer?.({
    entry_type: "communicationKillSwitchTick",
    timestamp: new Date().toISOString(),
    trigger: "communication",
    metadata: { operator_id, rationale },
  });
}

export function deactivateCommunicationKillSwitch(operator_id, rationale, writer) {
  COMM_HALTED = false;
  return writer?.({
    entry_type: "communicationKillSwitchReleaseTick",
    timestamp: new Date().toISOString(),
    trigger: "communication",
    metadata: { operator_id, rationale },
  });
}

export function isCommunicationHalting() {
  return COMM_HALTED;
}

export function guardCommunicationIO() {
  if (COMM_HALTED) {
    throw new Error("Communication subsystem halted by Kill Switch");
  }
}
