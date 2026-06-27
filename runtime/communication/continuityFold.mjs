import { getDriftPoints } from "../../substrate/drift-engine.mjs";
import { computeCommunicationContinuity } from "./communicationDrift.mjs";

export function computeRuntimeContinuity() {
  const points = getDriftPoints();
  const runtime_drift = points.length
    ? Math.max(...points.map((point) => Math.abs((point.actual ?? 0) - (point.expected ?? 0)) / Math.max(1, Math.abs(point.expected ?? 1))))
    : 0;
  return { runtime_drift };
}

export function computeContinuityMetrics(communicationTicks = []) {
  const runtime = computeRuntimeContinuity();
  const comm = computeCommunicationContinuity(communicationTicks);
  const continuity_score = Math.max(runtime.runtime_drift, comm.communication_drift);
  return {
    runtime_drift: runtime.runtime_drift,
    governance_drift: 0,
    cockpit_drift: 0,
    communication_drift: comm.communication_drift,
    continuity_score,
  };
}

export function evaluateContinuity(continuity) {
  const score = continuity.continuity_score;
  if (score > 0.5) return { state: "FAIL_CLOSED", trigger: "continuity" };
  if (score > 0.3) return { state: "CONTAINMENT_EPOCH", trigger: "continuity" };
  if (score > 0.15) return { state: "NOTIFY", trigger: "continuity" };
  if (score > 0.05) return { state: "WARN", trigger: "continuity" };
  return { state: "OK", trigger: null };
}
