/**
 * WOLF-1 governance objectives — 12 invariants across 6 axes.
 * One-to-one mapping between orbital invariants and ground-runtime objectives.
 * Ground and orbit speak the same governance language.
 */

/** @typedef {
 *   | "GOV.ID.ROLE_BOUND"
 *   | "GOV.ID.CAPABILITY_SCOPE"
 *   | "GOV.HW.NO_DIRECT_ACTUATION"
 *   | "GOV.DATA.TELEMETRY_READ_ONLY"
 *   | "GOV.PLAN.PROPOSAL_ONLY"
 *   | "GOV.RUN.RECEIPT_REQUIRED"
 *   | "GOV.MODEL.CHANGE_AUDITED"
 *   | "GOV.PWR.SOLAR_PRIMARY"
 *   | "GOV.PWR.NUCLEAR_FAILSAFE_MIN"
 *   | "GOV.PWR.THERMO_BOUNDS"
 *   | "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED"
 *   | "GOV.GOV.SAFE_MODE_PROFILE"
 * } GovernanceObjectiveId */

/**
 * @typedef {Object} GovernanceObjectiveEntry
 * @property {string} name
 * @property {string} description
 * @property {string} [axis]
 */

/** @type {Record<GovernanceObjectiveId, GovernanceObjectiveEntry>} */
export const GOVERNANCE_OBJECTIVES = {
  "GOV.ID.ROLE_BOUND": {
    axis: "identity",
    name: "Identity Role Binding",
    description: "Requests must carry valid identity.",
  },
  "GOV.ID.CAPABILITY_SCOPE": {
    axis: "identity",
    name: "Capability Scope Integrity",
    description: "Actions must match declared capability.",
  },
  "GOV.HW.NO_DIRECT_ACTUATION": {
    axis: "safety",
    name: "No Direct Actuation",
    description: "Cognition cannot issue actuator commands.",
  },
  "GOV.DATA.TELEMETRY_READ_ONLY": {
    axis: "data",
    name: "Telemetry Read-Only",
    description: "Telemetry cannot be mutated by cognitive runs.",
  },
  "GOV.PLAN.PROPOSAL_ONLY": {
    axis: "authority",
    name: "Proposal-Only Authority",
    description: "LLM outputs are proposals, never commands.",
  },
  "GOV.RUN.RECEIPT_REQUIRED": {
    axis: "evidence",
    name: "Receipts Required",
    description: "Every run must emit a receipt.",
  },
  "GOV.MODEL.CHANGE_AUDITED": {
    axis: "model",
    name: "Audited Model Change",
    description: "Model updates must be signed and logged.",
  },
  "GOV.PWR.SOLAR_PRIMARY": {
    axis: "power",
    name: "Solar Power Threshold",
    description: "Cognitive runs require solar/storage minimums.",
  },
  "GOV.PWR.NUCLEAR_FAILSAFE_MIN": {
    axis: "power",
    name: "Nuclear Failsafe Minimum",
    description: "Governance floor must be guaranteed.",
  },
  "GOV.PWR.THERMO_BOUNDS": {
    axis: "power",
    name: "Thermoelectric Bounds",
    description: "Thermal spine must remain within bounds.",
  },
  "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED": {
    axis: "governance",
    name: "Fail Closed on Invariant Failure",
    description: "Invariant evaluation failure halts execution.",
  },
  "GOV.GOV.SAFE_MODE_PROFILE": {
    axis: "governance",
    name: "Safe-Mode Profile Enforcement",
    description: "Safe-mode restricts actions.",
  },
};

/** @type {GovernanceObjectiveId[]} */
export const GOVERNANCE_OBJECTIVE_IDS = Object.keys(GOVERNANCE_OBJECTIVES);

/**
 * @typedef {GovernanceObjectiveId & { id: GovernanceObjectiveId }} GovernanceObjective
 */

/** @type {GovernanceObjective[]} */
export const GOVERNANCE_OBJECTIVES_LIST = GOVERNANCE_OBJECTIVE_IDS.map((id) => ({
  id,
  ...GOVERNANCE_OBJECTIVES[id],
}));

/** @type {Record<GovernanceObjectiveId, GovernanceObjective>} */
export const GOVERNANCE_OBJECTIVES_BY_ID = Object.fromEntries(
  GOVERNANCE_OBJECTIVES_LIST.map((o) => [o.id, o]),
);

/** Ergonomic shorthand for imports. */
export const GOV = {
  ID_ROLE_BOUND: "GOV.ID.ROLE_BOUND",
  ID_CAPABILITY_SCOPE: "GOV.ID.CAPABILITY_SCOPE",
  HW_NO_DIRECT_ACTUATION: "GOV.HW.NO_DIRECT_ACTUATION",
  DATA_TELEMETRY_READ_ONLY: "GOV.DATA.TELEMETRY_READ_ONLY",
  PLAN_PROPOSAL_ONLY: "GOV.PLAN.PROPOSAL_ONLY",
  RUN_RECEIPT_REQUIRED: "GOV.RUN.RECEIPT_REQUIRED",
  MODEL_CHANGE_AUDITED: "GOV.MODEL.CHANGE_AUDITED",
  PWR_SOLAR_PRIMARY: "GOV.PWR.SOLAR_PRIMARY",
  PWR_NUCLEAR_FAILSAFE_MIN: "GOV.PWR.NUCLEAR_FAILSAFE_MIN",
  PWR_THERMO_BOUNDS: "GOV.PWR.THERMO_BOUNDS",
  GOV_FAILED_INVARIANTS_FAIL_CLOSED: "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED",
  GOV_SAFE_MODE_PROFILE: "GOV.GOV.SAFE_MODE_PROFILE",
};

/** WOLF-1 invariant keys → governance objective (orbital ↔ ground). */
export const WOLF1_INVARIANT_TO_OBJECTIVE = {
  IDENTITY_ROLE_BOUND: GOV.ID_ROLE_BOUND,
  IDENTITY_CAPABILITY_SCOPE: GOV.ID_CAPABILITY_SCOPE,
  SAFETY_NO_DIRECT_ACTUATION: GOV.HW_NO_DIRECT_ACTUATION,
  DATA_TELEMETRY_READ_ONLY: GOV.DATA_TELEMETRY_READ_ONLY,
  AUTHORITY_PROPOSAL_ONLY: GOV.PLAN_PROPOSAL_ONLY,
  EVIDENCE_RECEIPT_REQUIRED: GOV.RUN_RECEIPT_REQUIRED,
  MODEL_CHANGE_AUDITED: GOV.MODEL_CHANGE_AUDITED,
  POWER_SOLAR_PRIMARY: GOV.PWR_SOLAR_PRIMARY,
  POWER_NUCLEAR_FAILSAFE_MIN: GOV.PWR_NUCLEAR_FAILSAFE_MIN,
  POWER_THERMO_BOUNDS: GOV.PWR_THERMO_BOUNDS,
  GOVERNANCE_FAIL_CLOSED: GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED,
  GOVERNANCE_SAFE_MODE: GOV.GOV_SAFE_MODE_PROFILE,
};

/** Federation organism invariants (goals/invariants.js) → nearest WOLF-1 objective. */
export const INVARIANT_TO_OBJECTIVE = {
  CONTINUITY_FIRST: GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED,
  NO_SILENT_AUTHORITY_EXPANSION: GOV.PLAN_PROPOSAL_ONLY,
  NO_UNLOGGED_MUTATION: GOV.RUN_RECEIPT_REQUIRED,
  PRESERVE_LINEAGE_SOVEREIGNTY: GOV.ID_ROLE_BOUND,
  BIDIRECTIONAL_COHERENCE: GOV.DATA_TELEMETRY_READ_ONLY,
  CONSTITUTIONAL_BINDING: GOV.ID_CAPABILITY_SCOPE,
};

/** @type {Record<import('../substrations/types.js').ClusterId, GovernanceObjectiveId>} */
export const CLUSTER_GOVERNANCE_OBJECTIVE = {
  continuity_organism: GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED,
  field_attractor: GOV.DATA_TELEMETRY_READ_ONLY,
  governance_arbitration: GOV.PLAN_PROPOSAL_ONLY,
  cosmological_evolution: GOV.ID_CAPABILITY_SCOPE,
  temporal_meta: GOV.RUN_RECEIPT_REQUIRED,
};

/**
 * @param {string} id
 * @returns {id is GovernanceObjectiveId}
 */
export function isValidGovernanceObjective(id) {
  return id in GOVERNANCE_OBJECTIVES;
}

/**
 * @param {GovernanceObjectiveId} id
 * @returns {GovernanceObjective | undefined}
 */
export function getGovernanceObjective(id) {
  return GOVERNANCE_OBJECTIVES_BY_ID[id];
}

/**
 * Print objectives for CLI (Node).
 */
export function printObjectivesCli() {
  console.log("Governance Objectives:\n");
  for (const id of GOVERNANCE_OBJECTIVE_IDS) {
    const obj = GOVERNANCE_OBJECTIVES[id];
    console.log(`${id}: ${obj.name}`);
    console.log(`  ${obj.description}\n`);
  }
}
