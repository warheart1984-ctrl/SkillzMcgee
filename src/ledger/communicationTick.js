/**
 * communicationTick builder — governed human-to-human communication evidence.
 */
import crypto from "node:crypto";
import { zeroDriftVector } from "../../types/envelopes/ledgerEntry.mjs";

/**
 * @param {Object} fields
 * @returns {import("../../types/envelopes/ledgerEntry.mjs").CommunicationTick & { id: string }}
 */
export function createCommunicationTick(fields) {
  return {
    id: fields.id ?? `CT-${crypto.randomUUID()}`,
    entry_type: "communicationTick",
    lane_id: fields.lane_id,
    comm_constitution_version: fields.comm_constitution_version ?? "1.0.0",
    timestamp: fields.timestamp ?? new Date().toISOString(),
    direction: fields.direction,
    category: fields.category,
    core_claim: fields.core_claim,
    impact: fields.impact ?? "neither",
    required_action: fields.required_action ?? "none",
    targets: fields.targets ?? [],
    altitude: fields.altitude ?? "human",
    latency: fields.latency ?? "whenever",
    drift_vector: fields.drift_vector ?? zeroDriftVector(),
    normative_impact: fields.normative_impact,
    required_action_detail: fields.required_action_detail,
    repository_targets: fields.repository_targets,
    corridor_status: fields.corridor_status ?? "ok",
    drift_violations: fields.drift_violations ?? [],
  };
}

/**
 * @param {import("../semantic-bridge/types.js").NormalizedMessage} normalized
 * @param {string} laneId
 */
export function communicationTickFromNormalized(normalized, laneId) {
  return createCommunicationTick({
    lane_id: laneId,
    comm_constitution_version: "1.0.0",
    direction: normalized.direction,
    category: normalized.category,
    core_claim: normalized.coreClaim,
    impact: normalized.impact ?? normalized.normativeImpact ?? "neither",
    normative_impact: normalized.normativeImpact,
    required_action: String(normalized.requiredAction ?? "none"),
    required_action_detail: normalized.requiredActionDetail,
    targets: normalized.targets ?? [],
    repository_targets: normalized.repositoryTargets,
    altitude: normalized.altitude,
    latency: normalized.latency,
  });
}
