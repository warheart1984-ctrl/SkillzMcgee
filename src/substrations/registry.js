/**
 * Full registry — WOLF-1 scaffolds + 30 federation substration descriptors.
 */

import { continuitySubstrations } from "./cluster_continuity.js";
import { fieldAttractorSubstrations } from "./cluster_field_attractor.js";
import { governanceSubstrations } from "./cluster_governance.js";
import { cosmologicalSubstrations } from "./cluster_cosmological.js";
import { temporalMetaSubstrations } from "./cluster_temporal_meta.js";
import { contractFor } from "./contracts.js";
import { WOLF1_SCAFFOLD_CONTRACTS } from "./scaffolds/index.js";
import { GOVERNANCE_OBJECTIVE_IDS, GOVERNANCE_OBJECTIVES } from "../governance/objectives.js";

export const substrations = [
  ...continuitySubstrations,
  ...fieldAttractorSubstrations,
  ...governanceSubstrations,
  ...cosmologicalSubstrations,
  ...temporalMetaSubstrations,
];

/** Federation contracts derived from behavioral descriptors. */
export const FEDERATION_SUBSTRATION_CONTRACTS = substrations.map((s) => contractFor(s));

/** WOLF-1 foundational scaffolds (SUB.*) + federation contracts. */
export const ALL_SUBSTRATION_CONTRACTS = [
  ...WOLF1_SCAFFOLD_CONTRACTS,
  ...FEDERATION_SUBSTRATION_CONTRACTS,
];

/** @type {Record<string, import('./contract_types.js').SubstrationContract>} */
export const SUBSTRATIONS_BY_ID = Object.fromEntries(
  ALL_SUBSTRATION_CONTRACTS.map((c) => [c.runtime.id, c]),
);

/** @type {Record<import('../governance/objectives.js').GovernanceObjectiveId, import('./contract_types.js').SubstrationContract[]>} */
export const SUBSTRATIONS_BY_OBJECTIVE = ALL_SUBSTRATION_CONTRACTS.reduce((acc, contract) => {
  const objId = contract.governance.governanceObjectiveId;
  (acc[objId] ??= []).push(contract);
  return acc;
}, /** @type {Record<string, import('./contract_types.js').SubstrationContract[]>} */ ({}));

/**
 * @param {import('../governance/objectives.js').GovernanceObjectiveId} id
 * @returns {import('./contract_types.js').SubstrationContract[]}
 */
export function getSubstrationsForObjective(id) {
  return SUBSTRATIONS_BY_OBJECTIVE[id] ?? [];
}

/**
 * Print substration map grouped by governance objective (CLI).
 */
export function printSubstrationsCli() {
  console.log("Substrations by Governance Objective:\n");
  for (const id of GOVERNANCE_OBJECTIVE_IDS) {
    const subs = SUBSTRATIONS_BY_OBJECTIVE[id] ?? [];
    if (subs.length === 0) continue;
    console.log(`${id}:`);
    for (const s of subs) {
      console.log(`  - ${s.runtime.id}`);
    }
    console.log();
  }
}

/**
 * ASCII federation graph (objectives → substrations).
 */
export function printGraphCli() {
  console.log("Federation Graph (Objectives → Substrations):\n");
  for (const id of GOVERNANCE_OBJECTIVE_IDS) {
    const subs = SUBSTRATIONS_BY_OBJECTIVE[id] ?? [];
    if (subs.length === 0) continue;
    const name = GOVERNANCE_OBJECTIVES[id].name;
    console.log(`${id} (${name})`);
    for (const s of subs) {
      console.log(`    └─ ${s.runtime.id}`);
    }
    console.log();
  }
}

/**
 * Split runtime deps into substration (required) vs external module (optional).
 * @param {string[]} deps
 * @param {Set<string>} substrationIds
 * @returns {{ dependencies: string[]; optionalDependencies: string[] }}
 */
export function classifyDependencies(deps, substrationIds) {
  const dependencies = [];
  const optionalDependencies = [];
  for (const dep of deps ?? []) {
    if (substrationIds.has(dep)) {
      dependencies.push(dep);
    } else {
      optionalDependencies.push(dep);
    }
  }
  return { dependencies, optionalDependencies };
}

/**
 * Serialize contract for Python governance gate.
 * @param {import('./contract_types.js').SubstrationContract} contract
 * @param {Set<string>} substrationIds
 */
export function exportSubstrationContract(contract, substrationIds) {
  const { dependencies, optionalDependencies } = classifyDependencies(
    contract.runtime.dependencies,
    substrationIds,
  );
  return {
    runtime: {
      id: contract.runtime.id,
      inputs: contract.runtime.inputs,
      outputs: contract.runtime.outputs,
      dependencies,
      optionalDependencies,
      executionSemantics: contract.runtime.executionSemantics,
      failureDetection: contract.runtime.failureDetection,
      evidenceProduced: contract.runtime.evidenceProduced,
    },
    governance: {
      id: contract.governance.id,
      governanceObjectiveId: contract.governance.governanceObjectiveId,
      uniqueContribution: contract.governance.uniqueContribution,
      admissionCriteria: contract.governance.admissionCriteria,
      successMetrics: contract.governance.successMetrics,
      retirementCriteria: contract.governance.retirementCriteria,
      traceabilityLinks: contract.governance.traceabilityLinks,
      admissionStatus: contract.governance.admissionStatus,
    },
  };
}

/**
 * JSON export for Python bridge (by governance objective).
 */
export function exportSubstrationsByObjective() {
  const ids = new Set(ALL_SUBSTRATION_CONTRACTS.map((c) => c.runtime.id));
  /** @type {Record<string, ReturnType<typeof exportSubstrationContract>[]>} */
  const out = {};
  for (const [oid, subs] of Object.entries(SUBSTRATIONS_BY_OBJECTIVE)) {
    out[oid] = subs.map((s) => exportSubstrationContract(s, ids));
  }
  return out;
}

/**
 * JSON export for Python bridge (by substration id).
 */
export function exportSubstrationsById() {
  const ids = new Set(ALL_SUBSTRATION_CONTRACTS.map((c) => c.runtime.id));
  /** @type {Record<string, ReturnType<typeof exportSubstrationContract>>} */
  const out = {};
  for (const [sid, contract] of Object.entries(SUBSTRATIONS_BY_ID)) {
    out[sid] = exportSubstrationContract(contract, ids);
  }
  return out;
}

/**
 * Full registry export for Python governance gate.
 */
export function exportSubstrationRegistry() {
  return {
    byObjective: exportSubstrationsByObjective(),
    byId: exportSubstrationsById(),
  };
}

export {
  continuitySubstrations,
  fieldAttractorSubstrations,
  governanceSubstrations,
  cosmologicalSubstrations,
  temporalMetaSubstrations,
  WOLF1_SCAFFOLD_CONTRACTS,
};
