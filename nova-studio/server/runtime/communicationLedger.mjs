/**
 * communicationTick ledger â€” governed human communication evidence stream.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  validateCommunicationTick,
  validateCommunicationTickInput,
} from "../../../types/envelopes/ledgerEntry.mjs";
import { appendEvidenceEntry } from "./evidenceLedger.mjs";
import { broadcastCommunicationTick } from "./broadcaster.mjs";
import {
  appendCommunicationDriftTick,
  appendDriftTick,
  enforceCommunicationTick,
  evaluateDriftContainment,
  listCommunicationTicksFiltered,
  suspendLane,
} from "./communicationGovernance.mjs";
import { guardCommunicationIO } from "./communicationControl.mjs";
import {
  enforceCommunicationRules,
  classifyMessage,
} from "./communicationEnforcement.mjs";
import { recordTickInEpoch } from "./communicationEpochs.mjs";
import { getLaneDriftStates, computeCommunicationContinuity } from "./communicationContinuity.mjs";
import { applyCrossLanePropagation } from "./communicationPropagation.mjs";
import { runCrossLaneInvariants } from "./communicationInvariants.mjs";
import { getTickCanonMetadata } from "./canonFreeze.mjs";
import {
  computeContinuityMetrics,
  evaluateContinuity,
  writeContinuityContainmentTick,
} from "./continuityFold.mjs";
import { broadcastStudioState } from "./broadcaster.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const LOG_DIR = path.join(REPO_ROOT, ".runtime/communication-ledger");
const LOG_PATH = path.join(LOG_DIR, "ticks.jsonl");

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function applyUnifiedContainment(tick, enforcement, trigger = "communication") {
  const fold = computeContinuityMetrics();
  const evaluation = evaluateContinuity(fold);

  if (evaluation.state === "OK" && enforcement.containment_action === "ok") {
    return evaluation;
  }

  const containmentTick = writeContinuityContainmentTick({
    entry_type: "continuityContainmentTick",
    trigger,
    continuity_score: fold.continuity_score,
    drift_vector: fold.drift_vector,
    state: evaluation.state,
    metadata: {
      lane_id: tick.lane_id,
      tick_id: tick.id,
      communication_composite: tick.drift_vector?.composite,
    },
  });

  if (
    evaluation.state === "CONTAINMENT_EPOCH" ||
    evaluation.state === "FAIL_CLOSED" ||
    enforcement.containment_action === "containment_epoch" ||
    enforcement.containment_action === "fail_closed"
  ) {
    suspendLane(
      tick.lane_id,
      `Automatic Containment Epoch â€” Trigger: ${trigger === "communication" ? "Communication Drift" : trigger}`,
    );
    broadcastStudioState({
      containment: true,
      lane_id: tick.lane_id,
      state: evaluation.state,
      trigger,
      tick: containmentTick,
    });
  }

  return { ...evaluation, containmentTick };
}

export function appendCommunicationTick(body, context = {}) {
  guardCommunicationIO();

  const inputValidation = validateCommunicationTickInput(body);
  if (!inputValidation.ok) {
    throw new Error(inputValidation.error);
  }

  if (!body.category && body.core_claim) {
    body.category = classifyMessage(body.core_claim);
  }

  let working = { ...body };
  const rulesResult = enforceCommunicationRules(working, context);
  if (!rulesResult.ok && rulesResult.error?.includes("containment")) {
    throw new Error(rulesResult.error);
  }
  if (rulesResult.ok && rulesResult.tick) {
    working = rulesResult.tick;
  }

  const enforcement = enforceCommunicationTick(working, context);
  if (!enforcement.ok) {
    throw new Error(enforcement.error);
  }

  const canonMeta = getTickCanonMetadata();

  const tick = {
    id: working.id ?? `CT-${crypto.randomUUID()}`,
    entry_type: "communicationTick",
    timestamp: working.timestamp ?? new Date().toISOString(),
    lane_id: working.lane_id,
    comm_constitution_version: enforcement.comm_constitution_version,
    canon_state: canonMeta.canon_state,
    canon_version: canonMeta.canon_version,
    direction: working.direction,
    category: working.category,
    core_claim: working.core_claim,
    impact: working.impact ?? "neither",
    normative_impact: working.normative_impact,
    required_action: working.required_action ?? "none",
    required_action_detail: working.required_action_detail,
    targets: working.targets ?? [],
    repository_targets: working.repository_targets ?? [],
    altitude: working.altitude ?? "human",
    latency: working.latency ?? "whenever",
    drift_vector: enforcement.drift_vector,
    source_lane_id: working.source_lane_id ?? working.rerouted_from,
    source_tick_id: working.source_tick_id,
    governance_receipt_id: working.governance_receipt_id ?? context.governance_receipt_id,
    corridor_status: enforcement.corridor_status,
    drift_violations: enforcement.violations,
    rerouted_from: working.rerouted_from,
    epoch_id: rulesResult.epochSummary?.epoch_id,
  };

  const recordValidation = validateCommunicationTick(tick);
  if (!recordValidation.ok) {
    throw new Error(recordValidation.error);
  }

  if (enforcement.violations.length > 0) {
    const driftType = enforcement.corridor_status === "identity_drift"
      ? "communicationIdentityDrift"
      : "communicationCorridorDrift";
    appendDriftTick(driftType, tick, enforcement.violations);
  }

  const containment = enforcement.containment_action;
  if (containment !== "ok") {
    appendCommunicationDriftTick(
      tick,
      enforcement.drift_vector,
      enforcement.violations,
      containment,
    );
  }

  recordTickInEpoch(tick.lane_id, tick.drift_vector.composite);

  ensureLogDir();
  fs.appendFileSync(LOG_PATH, `${JSON.stringify(tick)}\n`, "utf8");
  appendEvidenceEntry(tick);
  broadcastCommunicationTick(tick);

  applyCrossLanePropagation(getLaneDriftStates());
  runCrossLaneInvariants();
  applyUnifiedContainment(tick, enforcement, "communication");

  return tick;
}

export function listCommunicationTicks(limit = 50, options = {}) {
  return listCommunicationTicksFiltered({
    laneId: options.laneId ?? options.lane_id,
    governanceOverride: options.governanceOverride ?? options.governance_override ?? false,
    limit,
  });
}

export { computeCommunicationContinuity };
