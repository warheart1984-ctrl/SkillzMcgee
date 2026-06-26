/**
 * Two-contract model — behavior (runtime) separated from authority (governance).
 * The engine orchestrates runtime; CRK-1 evaluates governance legitimacy.
 */

import {
  CLUSTER_GOVERNANCE_OBJECTIVE,
  GOV,
} from "./governance_objectives.js";

/** @typedef {'provisional' | 'permanent'} AdmissionStatus */

/**
 * @typedef {import('../governance/objectives.js').GovernanceObjectiveId} GovernanceObjectiveId
 */

/**
 * @typedef {Object} TraceabilityLinks
 * @property {string} requirementId
 * @property {string} adrId
 * @property {string} ctsId
 * @property {string} evidenceLedgerPath
 * @property {string} [replicationNote]
 */

/**
 * Runtime contract — how it behaves (mechanics).
 * @typedef {Object} SubstrationRuntimeContract
 * @property {string} id
 * @property {string[]} inputs
 * @property {string[]} outputs
 * @property {string[]} dependencies
 * @property {string} executionSemantics
 * @property {string} failureDetection
 * @property {string[]} evidenceProduced
 */

/**
 * Governance contract — why it exists (legitimacy).
 * @typedef {Object} SubstrationGovernanceContract
 * @property {string} id
 * @property {GovernanceObjectiveId} governanceObjectiveId
 * @property {string} uniqueContribution
 * @property {string} admissionCriteria
 * @property {string} successMetrics
 * @property {string} retirementCriteria
 * @property {TraceabilityLinks} traceabilityLinks
 * @property {AdmissionStatus} admissionStatus
 * @property {number} architecturalPressureScore
 */

/**
 * @typedef {Object} SubstrationContract
 * @property {SubstrationRuntimeContract} runtime
 * @property {SubstrationGovernanceContract} governance
 */

/** @type {Record<import('./types.js').ClusterId, Partial<SubstrationRuntimeContract>>} */
const CLUSTER_RUNTIME_DEFAULTS = {
  continuity_organism: {
    inputs: ["continuityState", "conflicts", "globalRootValid", "healthSummary"],
    outputs: ["SubstrationNeed", "SubstrationTask", "CONTINUITY_TASK_EXECUTED"],
    dependencies: ["crk1", "cosmic_ledger"],
    executionSemantics: "analyze → deriveNeeds → planTasks → act via constitutional envelope",
    failureDetection: "Invalid global root, unresolved conflicts, or vetoed tasks in cosmic stream",
    evidenceProduced: ["CONTINUITY_NEED", "CONTINUITY_TASK_EXECUTED", "CONSTITUTIONAL_FLOW"],
  },
  field_attractor: {
    inputs: ["continuityState.drift", "continuityState.instabilityTrend", "epochSignals"],
    outputs: ["SubstrationNeed", "field_pressure_receipt"],
    dependencies: ["continuity_needs_engine"],
    executionSemantics: "Field analysis emits dampening needs; no direct state mutation",
    failureDetection: "Rising drift without dampening need emission",
    evidenceProduced: ["CONTINUITY_NEED", "CONTINUITY_ACTION"],
  },
  governance_arbitration: {
    inputs: ["conflicts", "sovereigntyViolations", "constitutionalDrift"],
    outputs: ["arbitration_need", "quorum_signal"],
    dependencies: ["crk1", "frs_reconcile"],
    executionSemantics: "Arbitration proposals deferred to CRK-1 reconciliation cycle",
    failureDetection: "Repeated arbitration without reconciliation outcome",
    evidenceProduced: ["RECONCILIATION_APPLIED", "CRK1_INTENT_VETOED"],
  },
  cosmological_evolution: {
    inputs: ["drift", "instabilityTrend", "genesisSignals", "forkCandidates"],
    outputs: ["genesis_need", "fork_task", "merge_task"],
    dependencies: ["crk1.evaluateGenesisCandidate", "asOmega"],
    executionSemantics: "Genesis/fork evaluation only through CRK-1 gated actions",
    failureDetection: "Genesis/fork signals without logged evaluation",
    evidenceProduced: ["GENESIS_CANDIDATE_NEED", "CONTINUITY_ACTION"],
  },
  temporal_meta: {
    inputs: ["timeSkew", "predictedInstability", "lineageGraph"],
    outputs: ["temporal_need", "meta_health_snapshot"],
    dependencies: ["cosmic_ledger", "continuity_forecasting_engine"],
    executionSemantics: "Observational rollup; tick-only without constitutional mutation",
    failureDetection: "Meta tick without health snapshot or rising predicted instability",
    evidenceProduced: ["META_CONTINUITY_TICK", "CONTINUITY_NEED"],
  },
};

/** @type {Record<import('./types.js').ClusterId, Partial<SubstrationGovernanceContract>>} */
const CLUSTER_GOVERNANCE_DEFAULTS = {
  continuity_organism: {
    admissionCriteria: "Proven continuity pressure with logged needs over 3+ epochs",
    successMetrics: "Global root valid; conflict count trending down; veto rate < 20%",
    retirementCriteria: "Zero derived needs for N consecutive epochs with healthy continuity",
    admissionStatus: "permanent",
    architecturalPressureScore: 80,
  },
  field_attractor: {
    admissionCriteria: "Drift exceeds threshold in 3+ consecutive observations",
    successMetrics: "Drift dampened within reconciliation window",
    retirementCriteria: "Drift below threshold across full reconciliation cycle",
    admissionStatus: "provisional",
    architecturalPressureScore: 40,
  },
  governance_arbitration: {
    admissionCriteria: "Unresolved conflicts or sovereignty violations present",
    successMetrics: "Reconciliation applied; quorum stable",
    retirementCriteria: "No sovereignty violations; constitutional drift within bounds",
    admissionStatus: "provisional",
    architecturalPressureScore: 50,
  },
  cosmological_evolution: {
    admissionCriteria: "Genesis or fork signals with instability trend rising",
    successMetrics: "Genesis evaluated; cosmological drift bounded",
    retirementCriteria: "No genesis candidates; drift stable",
    admissionStatus: "provisional",
    architecturalPressureScore: 35,
  },
  temporal_meta: {
    admissionCriteria: "Temporal skew or predicted instability above threshold",
    successMetrics: "Meta health snapshot emitted; predictions actionable",
    retirementCriteria: "Temporal skew normalized; predictions below threshold",
    admissionStatus: "provisional",
    architecturalPressureScore: 30,
  },
};

/** @type {Record<string, { uniqueContribution?: string; dependencies?: string[]; governanceObjectiveId?: GovernanceObjectiveId }>} */
const SUBSTRATION_OVERRIDES = {
  continuity_needs_engine: {
    uniqueContribution: "Single source of truth for continuity-derived needs from live FRS state",
    dependencies: ["getContinuityState", "detectConflicts"],
    governanceObjectiveId: GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED,
  },
  continuity_tasks_engine: {
    uniqueContribution: "Translates aggregated needs into executable task envelopes under CRK-1",
    dependencies: ["continuity_needs_engine"],
    governanceObjectiveId: GOV.RUN_RECEIPT_REQUIRED,
  },
  continuity_agents: {
    uniqueContribution: "Dispatches repair agents for high-severity continuity needs",
    dependencies: ["continuity_tasks_engine", "agents.spawn"],
    governanceObjectiveId: GOV.HW_NO_DIRECT_ACTUATION,
  },
  continuity_immunity_layer: {
    uniqueContribution: "Detects sovereignty violations before they propagate across nodes",
    dependencies: ["continuityState.sovereigntyViolations"],
    governanceObjectiveId: GOV.ID_CAPABILITY_SCOPE,
  },
  continuity_repair_substrate: {
    uniqueContribution: "Executes lineage repair against broken chain signals",
    dependencies: ["crk1.repairLineage", "continuity_tasks_engine"],
    governanceObjectiveId: GOV.ID_ROLE_BOUND,
  },
  continuity_forecasting_engine: {
    uniqueContribution: "Emits preemptive needs from predicted instability trends",
    dependencies: ["continuityState.predictedInstability"],
    governanceObjectiveId: GOV.DATA_TELEMETRY_READ_ONLY,
  },
  genesis_candidate_detector: {
    uniqueContribution: "Isolates genesis evaluation from ad-hoc drift handling",
    dependencies: ["crk1.evaluateGenesisCandidate"],
    governanceObjectiveId: GOV.ID_CAPABILITY_SCOPE,
  },
  meta_continuity_substrate: {
    uniqueContribution: "Cross-substration health rollup without mutating constitutional state",
    dependencies: ["cosmic_ledger"],
    governanceObjectiveId: GOV.RUN_RECEIPT_REQUIRED,
  },
  constitutional_drift_detector: {
    uniqueContribution: "Surfaces constitutional drift before silent authority expansion",
    governanceObjectiveId: GOV.GOV_SAFE_MODE_PROFILE,
  },
  federated_quorum_engine: {
    uniqueContribution: "Quorum signals for federation-wide governance decisions",
    governanceObjectiveId: GOV.PLAN_PROPOSAL_ONLY,
  },
  stability_attractor_fields: {
    uniqueContribution: "Provides targeted stabilization when field drift threatens coherence",
    governanceObjectiveId: GOV.DATA_TELEMETRY_READ_ONLY,
  },
};

export const GRADUATION_PRESSURE_THRESHOLD = 75;

/**
 * @param {import('./types.js').SubstrationDescriptor} descriptor
 * @returns {TraceabilityLinks}
 */
export function traceabilityFor(descriptor) {
  return {
    requirementId: `REQ.SUB.${descriptor.id}`,
    adrId: `ADR.SUB.${descriptor.cluster}`,
    ctsId: `CTS.FRS1.${descriptor.id}`,
    evidenceLedgerPath: `cosmicStream/${descriptor.id}`,
    replicationNote: "Purpose durable; implementation replaceable — evidence is the arbiter (WOLF-1)",
  };
}

/**
 * @param {import('./types.js').SubstrationDescriptor} descriptor
 * @returns {SubstrationContract}
 */
export function contractFor(descriptor) {
  const runtimeDefaults =
    CLUSTER_RUNTIME_DEFAULTS[descriptor.cluster] ?? CLUSTER_RUNTIME_DEFAULTS.continuity_organism;
  const govDefaults =
    CLUSTER_GOVERNANCE_DEFAULTS[descriptor.cluster] ?? CLUSTER_GOVERNANCE_DEFAULTS.continuity_organism;
  const override = SUBSTRATION_OVERRIDES[descriptor.id] ?? {};

  /** @type {SubstrationRuntimeContract} */
  const runtime = {
    id: descriptor.id,
    inputs: override.inputs ?? runtimeDefaults.inputs ?? [],
    outputs: override.outputs ?? runtimeDefaults.outputs ?? [],
    dependencies: override.dependencies ?? runtimeDefaults.dependencies ?? [],
    executionSemantics:
      override.executionSemantics ??
      runtimeDefaults.executionSemantics ??
      "analyze → deriveNeeds → planTasks → act",
    failureDetection:
      override.failureDetection ??
      runtimeDefaults.failureDetection ??
      "Cosmic stream anomaly detection",
    evidenceProduced: override.evidenceProduced ?? runtimeDefaults.evidenceProduced ?? [],
  };

  /** @type {SubstrationGovernanceContract} */
  const governance = {
    id: descriptor.id,
    governanceObjectiveId:
      override.governanceObjectiveId ??
      CLUSTER_GOVERNANCE_OBJECTIVE[descriptor.cluster] ??
      GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED,
    uniqueContribution:
      override.uniqueContribution ?? `${descriptor.name}: ${descriptor.purpose}`,
    admissionCriteria:
      override.admissionCriteria ??
      govDefaults.admissionCriteria ??
      "Repeated architectural pressure proves stable capability gap",
    successMetrics:
      override.successMetrics ??
      govDefaults.successMetrics ??
      "Needs addressed; evidence logged; veto rate acceptable",
    retirementCriteria:
      override.retirementCriteria ??
      govDefaults.retirementCriteria ??
      "Defer when objective preserved without this substration",
    traceabilityLinks: traceabilityFor(descriptor),
    admissionStatus: govDefaults.admissionStatus ?? "provisional",
    architecturalPressureScore: govDefaults.architecturalPressureScore ?? 0,
  };

  return { runtime, governance };
}

/**
 * @param {import('./types.js').SubstrationDescriptor[]} descriptors
 * @returns {Map<string, SubstrationContract>}
 */
export function buildContractRegistry(descriptors) {
  const map = new Map();
  for (const d of descriptors) {
    map.set(d.id, d.contract ?? contractFor(d));
  }
  return map;
}

/**
 * Admission doctrine — substration exists only as best current protector of objective.
 * @param {SubstrationContract} contract
 * @param {{ needEmissionCount?: number; objectiveAtRisk?: boolean }} [metrics]
 * @returns {{ admitted: boolean; reason: string }}
 */
export function evaluateAdmission(contract, metrics = {}) {
  const { governance } = contract;
  if (governance.admissionStatus === "permanent") {
    return { admitted: true, reason: "permanent_admission" };
  }
  if (metrics.objectiveAtRisk || (metrics.needEmissionCount ?? 0) > 0) {
    return { admitted: true, reason: "objective_at_risk" };
  }
  return { admitted: false, reason: "insufficient_architectural_pressure" };
}

/**
 * Retirement doctrine — evidence says objective preserved without this implementation.
 * @param {SubstrationContract} contract
 * @param {{ epochsStable?: number; needEmissionCount?: number }} [metrics]
 * @returns {{ retire: boolean; reason: string }}
 */
export function evaluateRetirement(contract, metrics = {}) {
  const stable = (metrics.epochsStable ?? 0) >= 5;
  const noNeeds = (metrics.needEmissionCount ?? 0) === 0;
  if (stable && noNeeds && contract.governance.admissionStatus === "provisional") {
    return { retire: true, reason: "retirement_criteria_met" };
  }
  return { retire: false, reason: contract.governance.retirementCriteria };
}

/**
 * Graduation — provisional → permanent when pressure proven (Bradley principle).
 * @param {SubstrationContract} contract
 * @param {{ needEmissionCount?: number; epochsStable?: number; vetoRate?: number }} [metrics]
 * @returns {{ graduate: boolean; reason: string }}
 */
export function evaluateGraduation(contract, metrics = {}) {
  if (contract.governance.admissionStatus === "permanent") {
    return { graduate: true, reason: "already_permanent" };
  }

  const pressure =
    contract.governance.architecturalPressureScore + (metrics.needEmissionCount ?? 0) * 2;
  const stable = (metrics.epochsStable ?? 0) >= 3;
  const lowVeto = (metrics.vetoRate ?? 0) < 0.2;

  if (pressure >= GRADUATION_PRESSURE_THRESHOLD && stable && lowVeto) {
    return { graduate: true, reason: "architectural_pressure_proven" };
  }

  return {
    graduate: false,
    reason: `pressure=${pressure}, stable=${stable}, lowVeto=${lowVeto}`,
  };
}

/**
 * Engine must not embed law — policy hooks live in CRK-1 only.
 * @param {SubstrationContract} contract
 * @returns {boolean}
 */
export function isOrchestralOnly(contract) {
  const path = contract.governance.traceabilityLinks.evidenceLedgerPath;
  return !path.startsWith("substration.law");
}
