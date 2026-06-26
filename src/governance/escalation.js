/**
 * Escalation / override state — cycles governance posture and logs continuity receipts.
 */

import { getSafeMode, setSafeMode, SAFE_MODES } from "./safe_mode.js";
import { appendReceiptJsonl } from "./continuity_ledger.js";

const MODE_ORDER = ["S0", "S1", "S2", "S3"];

/**
 * @returns {{ mode: string; name: string; ring: 'green' | 'yellow' | 'red'; emergency: boolean; restrictions: string[] }}
 */
export function getEscalationState() {
  const { mode, info } = getSafeMode();
  return {
    mode,
    name: info.name,
    ring: ringForMode(mode),
    emergency: mode === "S3",
    restrictions: info.restrictions,
  };
}

/**
 * @param {string} mode
 * @returns {'green' | 'yellow' | 'red'}
 */
function ringForMode(mode) {
  if (mode === "S0") return "green";
  if (mode === "S1" || mode === "S2") return "yellow";
  return "red";
}

/**
 * Cycle S0 → S1 → S2 → S3 → S0 and append continuity receipt.
 * @param {{ cause?: string; actor?: string }} [opts]
 */
export function cycleEscalation(opts = {}) {
  const { mode } = getSafeMode();
  const idx = MODE_ORDER.indexOf(mode);
  const next = MODE_ORDER[(idx + 1) % MODE_ORDER.length];
  setSafeMode(next);
  const receipt = {
    id: `escalation-${Date.now()}`,
    timestamp: new Date().toISOString(),
    substrationId: "SUB.SAFE_MODE_GUARD",
    governanceObjectiveId: "GOV.GOV.SAFE_MODE_PROFILE",
    policyOutcome: "escalation",
    governanceDecision: `Posture ${mode} → ${next}`,
    stateTransitionSummary: opts.cause ?? "Manual escalation toggle",
    evidencePaths: ["ledger/governance/escalation"],
    actor: opts.actor ?? "cockpit",
    escalationFrom: mode,
    escalationTo: next,
  };
  appendReceiptJsonl(receipt);
  return { previous: mode, current: next, receipt, state: getEscalationState() };
}

/**
 * Set explicit escalation mode and log receipt.
 * @param {string} mode
 * @param {{ cause?: string; actor?: string }} [opts]
 */
export function setEscalationMode(mode, opts = {}) {
  const { mode: previous } = getSafeMode();
  setSafeMode(mode);
  const receipt = {
    id: `escalation-${Date.now()}`,
    timestamp: new Date().toISOString(),
    substrationId: "SUB.SAFE_MODE_GUARD",
    governanceObjectiveId: "GOV.GOV.SAFE_MODE_PROFILE",
    policyOutcome: "escalation",
    governanceDecision: `Posture ${previous} → ${mode}`,
    stateTransitionSummary: opts.cause ?? "Governance posture set",
    evidencePaths: ["ledger/governance/escalation"],
    actor: opts.actor ?? "cockpit",
    escalationFrom: previous,
    escalationTo: mode,
  };
  appendReceiptJsonl(receipt);
  return { previous, current: mode, receipt, state: getEscalationState() };
}

export { MODE_ORDER, SAFE_MODES };
