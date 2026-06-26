/**
 * Substration dual-contract types (runtime + governance).
 * @module
 */

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
 * @typedef {Object} SubstrationRuntimeContract
 * @property {string} id
 * @property {string[]} inputs
 * @property {string[]} outputs
 * @property {string[]} dependencies
 * @property {string[]} [optionalDependencies]
 * @property {string} executionSemantics
 * @property {string} failureDetection
 * @property {string[]} evidenceProduced
 */

/**
 * @typedef {'provisional' | 'permanent'} AdmissionStatus
 */

/**
 * @typedef {Object} SubstrationGovernanceContract
 * @property {string} id
 * @property {GovernanceObjectiveId} governanceObjectiveId
 * @property {string} uniqueContribution
 * @property {string} admissionCriteria
 * @property {string} successMetrics
 * @property {string} retirementCriteria
 * @property {TraceabilityLinks} traceabilityLinks
 * @property {AdmissionStatus} [admissionStatus]
 * @property {number} [architecturalPressureScore]
 */

/**
 * @typedef {Object} SubstrationContract
 * @property {SubstrationRuntimeContract} runtime
 * @property {SubstrationGovernanceContract} governance
 */

export {};
