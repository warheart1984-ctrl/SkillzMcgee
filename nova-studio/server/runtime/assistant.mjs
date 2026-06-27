/**
 * Deterministic reply refinement â€” local assistant with continuity-aware guard.
 */
import { register } from "tsx/esm/api";
import { guardCommunicationIO } from "./communicationControl.mjs";
import { canGenerateReply } from "./communicationEnforcement.mjs";
import { getLane, loadConstitution } from "./communicationGovernance.mjs";
import { getActiveEpoch } from "./communicationEpochs.mjs";

let refineFn = null;

async function loadRefine() {
  if (!refineFn) {
    register();
    const mod = await import("../../../src/runtime/replyAssistant.js");
    refineFn = mod.refineReply;
  }
  return refineFn;
}

export async function handleAssistantRefine(body) {
  guardCommunicationIO();

  const normalized = body.normalized;
  const draft = String(body.draft ?? "");
  const laneId = body.lane_id ?? "jon-darz-architecture";

  if (!normalized || typeof normalized !== "object") {
    throw new Error("normalized object required");
  }

  const lane = getLane(laneId);
  if (!lane) throw new Error(`Unknown lane: ${laneId}`);

  const epoch = getActiveEpoch(laneId);
  const currentDrift = { composite: epoch?.drift_max ?? 0 };

  const proposed = {
    category: normalized.category ?? "human",
    altitude: normalized.altitude ?? "engineering",
    impact: normalized.impact ?? normalized.normativeImpact ?? "neither",
    projected_drift: body.projected_drift ?? 0.08,
  };

  const guard = canGenerateReply(lane, currentDrift, proposed);
  if (!guard.ok) {
    return {
      blocked: true,
      reason: guard.reason,
      corridorViolations: guard.corridorViolations,
      projectedComposite: guard.projectedComposite,
      governance_prompt:
        "Reply would exceed the lane's corridor / drift thresholds. Options: lower altitude, change category, or route to different lane.",
    };
  }

  const refineReply = await loadRefine();
  return { refined: refineReply(normalized, draft), guard };
}
