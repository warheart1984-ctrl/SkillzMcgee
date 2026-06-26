/**
 * Substration receipts — receipt-level traceability proving necessity.
 */

/**
 * @typedef {import('./objectives.js').GovernanceObjectiveId} GovernanceObjectiveId
 */

/**
 * @typedef {Object} SubstrationReceipt
 * @property {string} id
 * @property {string} timestamp
 * @property {string} substrationId
 * @property {GovernanceObjectiveId} governanceObjectiveId
 * @property {string} observationSummary
 * @property {string} needSummary
 * @property {string} taskSummary
 * @property {string[]} evidencePaths
 * @property {string} policyOutcome
 * @property {string} governanceDecision
 * @property {string} stateTransitionSummary
 */

/**
 * @param {object} params
 * @param {import('../substrations/contracts.js').SubstrationContract} params.contract
 * @param {unknown} params.observation
 * @param {unknown} params.need
 * @param {unknown} params.task
 * @param {{ paths: string[]; summary?: string }} params.evidence
 * @param {string} params.policyOutcome
 * @param {string} params.governanceDecision
 * @param {string} params.stateTransitionSummary
 * @returns {SubstrationReceipt}
 */
export function makeSubstrationReceipt({
  contract,
  observation,
  need,
  task,
  evidence,
  policyOutcome,
  governanceDecision,
  stateTransitionSummary,
}) {
  return {
    id: `${contract.runtime.id}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    substrationId: contract.runtime.id,
    governanceObjectiveId: contract.governance.governanceObjectiveId,
    observationSummary: summarize(observation),
    needSummary: summarize(need),
    taskSummary: summarize(task),
    evidencePaths: evidence.paths ?? [],
    policyOutcome,
    governanceDecision,
    stateTransitionSummary,
  };
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function summarize(value) {
  if (value == null) return "null";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Collect ledger paths from execution evidence and contract traceability.
 * @param {object | object[] | null} evidence
 * @param {import('../substrations/contracts.js').SubstrationContract} contract
 * @returns {string[]}
 */
export function collectEvidencePaths(evidence, contract) {
  /** @type {Set<string>} */
  const paths = new Set();
  const trace = contract.governance.traceabilityLinks?.evidenceLedgerPath;
  if (trace) paths.add(trace);

  const items = Array.isArray(evidence) ? evidence : evidence ? [evidence] : [];
  for (const item of items) {
    if (item?.ledgerPath) paths.add(item.ledgerPath);
    if (item?.paths) {
      for (const p of item.paths) paths.add(p);
    }
  }

  for (const produced of contract.runtime.evidenceProduced ?? []) {
    paths.add(`cosmicStream/${produced}`);
  }

  return [...paths];
}
