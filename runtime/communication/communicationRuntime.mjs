import { generateCommunicationCanon, freezeCommunicationCanon } from "./canonGenerator.mjs";
import { parseCanon } from "./canonParser.mjs";
import { computeCommunicationDrift } from "./communicationDrift.mjs";
import { computeContinuityMetrics, evaluateContinuity } from "./continuityFold.mjs";
import { enforceCommunicationRules } from "./enforcement.mjs";
import { evaluateCrossLaneInvariants } from "./invariantStore.mjs";
import { getLaneContract, listLaneContracts, updateLaneStatus, upsertLaneContract } from "./laneRegistry.mjs";
import { queryCommunicationLedger, writeCommunicationLedgerEntry } from "./ledger.mjs";
import { listEpochs, closeEpoch } from "./epochStore.mjs";
import { activateCommunicationKillSwitch, deactivateCommunicationKillSwitch, isCommunicationHalting } from "./communicationControl.mjs";

export function listCommunicationTicks(filters = {}) {
  return queryCommunicationLedger({ entry_type: "communicationTick", filters });
}

export function appendCommunicationTick(tick) {
  const previous = listCommunicationTicks({ lane_id: tick.lane_id }).at(-1);
  const enforced = enforceCommunicationRules(tick, previous);
  const stored = writeCommunicationLedgerEntry(enforced.tick);
  for (const effect of enforced.sideEffects) writeCommunicationLedgerEntry(effect);
  const invariantTicks = evaluateCrossLaneInvariants(listCommunicationTicks(), listLaneContracts());
  for (const result of invariantTicks.filter((item) => !item.ok)) writeCommunicationLedgerEntry(result);
  return { status: "ok", tick: stored, sideEffects: enforced.sideEffects };
}

export function appendCommunicationGovernanceTick(tick) {
  return writeCommunicationLedgerEntry({
    entry_type: "communicationGovernanceTick",
    decision_type: "ack",
    receipts: [],
    ...tick,
  });
}

export function replayCommunication({ from, to, lane_id } = {}) {
  return queryCommunicationLedger({
    entry_type: "communicationTick",
    from,
    to,
    filters: { lane_id },
  });
}

export function getCommunicationState() {
  const ticks = listCommunicationTicks();
  const lanes = listLaneContracts();
  const drift = computeCommunicationDrift(ticks);
  const continuity = computeContinuityMetrics(ticks);
  return {
    lanes,
    ticks,
    epochs: listEpochs(),
    drift,
    continuity,
    containment: evaluateContinuity(continuity),
    ledger: queryCommunicationLedger(),
    halted: isCommunicationHalting(),
  };
}

export async function getCommunicationCanon() {
  return generateCommunicationCanon();
}

export async function getParsedCommunicationCanon() {
  return parseCanon(await generateCommunicationCanon());
}

export function splitLane({ source_lane_id, new_lanes, rationale, operator_id }) {
  updateLaneStatus(source_lane_id, "SPLIT");
  const source = getLaneContract(source_lane_id);
  for (const lane of new_lanes) {
    upsertLaneContract({
      ...source,
      ...lane,
      status: "ACTIVE",
      created_at: new Date().toISOString(),
    });
  }
  return writeCommunicationLedgerEntry({
    entry_type: "communicationLaneSplitTick",
    timestamp: new Date().toISOString(),
    source_lane_id,
    new_lanes,
    rationale,
    operator_id,
  });
}

export function mergeLanes({ source_lanes, target_lane_id, rationale, operator_id }) {
  for (const laneId of source_lanes) updateLaneStatus(laneId, "MERGED");
  return writeCommunicationLedgerEntry({
    entry_type: "communicationLaneMergeTick",
    timestamp: new Date().toISOString(),
    source_lanes,
    target_lane_id,
    rationale,
    operator_id,
  });
}

export { closeEpoch, freezeCommunicationCanon, activateCommunicationKillSwitch, deactivateCommunicationKillSwitch };
