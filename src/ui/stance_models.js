/**
 * Stance strip data models — aggregates governance read-models for the cockpit.
 */

import { GOVERNANCE_OBJECTIVE_IDS, GOVERNANCE_OBJECTIVES } from "../governance/objectives.js";
import { getSafeMode } from "../governance/safe_mode.js";
import { getEscalationState } from "../governance/escalation.js";

/** Active constitutional charter (CKCE-1 / AAES-OS binding). */
export const ACTIVE_CHARTER = {
  id: "CKCE-1",
  subsystem: "AAES-OS",
  label: "WOLF-1 Constitutional Kernel",
  objectiveCount: GOVERNANCE_OBJECTIVE_IDS.length,
};

const WAVE_PERIOD_MS = 3000;

/**
 * @typedef {Object} LawContextModel
 * @property {string} charterId
 * @property {string} subsystem
 * @property {string} label
 * @property {number} objectiveCount
 * @property {boolean} charterJustActivated
 */

/**
 * @typedef {Object} MissionThreadModel
 * @property {string} threadId
 * @property {string} focus
 * @property {number} progressPct
 * @property {number} coherencePct
 * @property {string[]} lineage
 */

/**
 * @typedef {Object} TensionModel
 * @property {number} index
 * @property {'emerald' | 'amber' | 'crimson'} band
 * @property {number} drift
 * @property {number[]} driftVector
 * @property {string} status
 */

/**
 * @typedef {Object} EscalationModel
 * @property {string} mode
 * @property {string} name
 * @property {'green' | 'yellow' | 'red'} ring
 * @property {boolean} emergency
 * @property {string[]} restrictions
 */

/**
 * @typedef {Object} StanceStripModel
 * @property {LawContextModel} lawContext
 * @property {MissionThreadModel} missionThread
 * @property {TensionModel} tension
 * @property {EscalationModel} escalation
 * @property {number} wavePeriodMs
 */

let lastCharterKey = ACTIVE_CHARTER.id;

/**
 * @param {object} [input]
 * @returns {StanceStripModel}
 */
export function buildStanceStripModel(input = {}) {
  const charterKey = input.charterId ?? ACTIVE_CHARTER.id;
  const charterJustActivated = input.charterJustActivated ?? charterKey !== lastCharterKey;
  lastCharterKey = charterKey;

  const mission = input.missionThread ?? {};
  const continuity = input.continuity ?? {};
  const drift = continuity.drift ?? input.drift ?? 0;
  const tensionIndex = clamp01(input.tensionIndex ?? drift);
  const escalation = getEscalationState();

  return {
    lawContext: {
      charterId: charterKey,
      subsystem: ACTIVE_CHARTER.subsystem,
      label: ACTIVE_CHARTER.label,
      objectiveCount: GOVERNANCE_OBJECTIVE_IDS.length,
      charterJustActivated,
    },
    missionThread: {
      threadId: mission.threadId ?? input.threadId ?? "thread.federation.tick",
      focus: mission.focus ?? input.missionFocus ?? "Continuity governance cycle",
      progressPct: clampPct(mission.progressPct ?? input.progressPct ?? 62),
      coherencePct: clampPct(mission.coherencePct ?? input.coherencePct ?? 88),
      lineage: mission.lineage ?? input.threadLineage ?? ["observe", "need", "task", "receipt"],
    },
    tension: {
      index: tensionIndex,
      band: tensionBand(tensionIndex),
      drift,
      driftVector: continuity.driftVector ?? buildDriftVector(drift, continuity),
      status: continuity.healthSummary?.status ?? input.healthStatus ?? healthFromTension(tensionIndex),
    },
    escalation: {
      mode: escalation.mode,
      name: escalation.name,
      ring: escalation.ring,
      emergency: escalation.emergency,
      restrictions: escalation.restrictions,
    },
    wavePeriodMs: WAVE_PERIOD_MS,
  };
}

/**
 * Derive stance from cosmic / continuity snapshot.
 * @param {object} [cosmic]
 */
export function stanceFromCosmic(cosmic = {}) {
  const tick = cosmic.tickResult ?? {};
  const fold = cosmic.fold ?? {};
  const needCount = tick.needCount ?? 0;
  const taskCount = tick.taskCount ?? 0;
  const progress = taskCount > 0 ? Math.min(100, 40 + taskCount * 8) : needCount > 0 ? 25 : 62;

  return buildStanceStripModel({
    continuity: {
      drift: fold.drift ?? (fold.globalRootValid === false ? 0.72 : 0.12),
      healthSummary: {
        status: tick.ok === false ? "critical" : fold.globalRootValid === false ? "degraded" : "healthy",
      },
    },
    missionThread: {
      threadId: `tick.${cosmic.tick ?? 0}`,
      focus: tick.ok === false ? "Will abort — governance deferred" : "Federation Mind → Will → Spine",
      progressPct: progress,
      coherencePct: fold.globalRootValid === false ? 54 : 91,
      lineage: ["Mind", "Will", "Spine", "Receipt"],
    },
    tensionIndex: tick.ok === false ? 0.85 : fold.globalRootValid === false ? 0.55 : 0.18,
  });
}

function clamp01(n) {
  return Math.max(0, Math.min(1, Number(n) || 0));
}

function clampPct(n) {
  return Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
}

function tensionBand(index) {
  if (index < 0.35) return "emerald";
  if (index < 0.65) return "amber";
  return "crimson";
}

function healthFromTension(index) {
  if (index < 0.35) return "healthy";
  if (index < 0.65) return "degraded";
  return "critical";
}

function buildDriftVector(drift, continuity) {
  const skew = continuity.timeSkew ?? {};
  const values = Object.values(skew);
  if (values.length > 0) {
    return values.slice(0, 8).map((v) => clamp01(Math.abs(v) / 1000));
  }
  return Array.from({ length: 6 }, (_, i) => clamp01(drift * (0.6 + i * 0.07)));
}

export { WAVE_PERIOD_MS };
