/**
 * Client â€” anchor normalized messages as communicationTick entries (lane-scoped).
 */
import { getActiveLaneId } from "./laneContext.js";

export async function writeCommunicationTick(normalized, options = {}) {
  const laneId = options.laneId ?? getActiveLaneId();

  const tick = {
    entry_type: "communicationTick",
    lane_id: laneId,
    timestamp: new Date().toISOString(),
    direction: normalized.direction,
    category: normalized.category,
    core_claim: normalized.coreClaim,
    impact: normalized.impact ?? normalized.normativeImpact,
    normative_impact: normalized.normativeImpact,
    required_action: normalized.requiredAction,
    required_action_detail: normalized.requiredActionDetail,
    targets: normalized.targets,
    repository_targets: normalized.repositoryTargets,
    altitude: normalized.altitude,
    latency: normalized.latency,
    source_lane_id: options.sourceLaneId,
    source_tick_id: options.sourceTickId,
    governance_receipt_id: options.governanceReceiptId,
  };

  const res = await fetch("/api/ledger/communication", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tick),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Ledger write failed (${res.status})`);
  }

  return data;
}
