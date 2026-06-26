/**
 * CRK-1 governance evaluator — approves/denies substration actions against objectives.
 */

/**
 * @typedef {import('../governance/objectives.js').GovernanceObjectiveId} GovernanceObjectiveId
 */

/**
 * @typedef {Object} GovernanceEvaluationContext
 * @property {GovernanceObjectiveId} objectiveId
 * @property {import('../substrations/contracts.js').SubstrationContract} contract
 * @property {string[]} evidencePaths
 * @property {import('../substrations/types.js').SubstrationTask} [task]
 */

/**
 * @typedef {Object} GovernanceDecision
 * @property {boolean} approved
 * @property {string} reason
 * @property {"approve" | "reject" | "defer" | "escalate"} policyOutcome
 */

/**
 * @param {GovernanceEvaluationContext} evalCtx
 * @param {import('../substrations/types.js').SubstrationContext} [runtimeCtx]
 * @returns {Promise<GovernanceDecision>}
 */
export async function evaluateSubstrationGovernance(evalCtx, runtimeCtx) {
  const { objectiveId, contract, evidencePaths, task } = evalCtx;

  if (contract.governance.governanceObjectiveId !== objectiveId) {
    return {
      approved: false,
      reason: "Substration governance objective mismatch.",
      policyOutcome: "reject",
    };
  }

  if (evidencePaths.length === 0) {
    return {
      approved: false,
      reason: "No evidence provided for governance evaluation.",
      policyOutcome: "defer",
    };
  }

  const crk1 = runtimeCtx?.crk1;
  if (task && crk1?.checkActionAgainstInvariants) {
    const check = await crk1.checkActionAgainstInvariants(task, [], runtimeCtx);
    if (check !== true) {
      return {
        approved: false,
        reason: check?.reason ?? "CRK-1 invariant violation",
        policyOutcome: "reject",
      };
    }
  }

  if (task && crk1?.checkAction) {
    const allowed = await crk1.checkAction(task, runtimeCtx);
    if (!allowed) {
      return {
        approved: false,
        reason: "CRK-1 checkAction vetoed substration execution.",
        policyOutcome: "reject",
      };
    }
  }

  if (objectiveId === "GOV.RUN.RECEIPT_REQUIRED") {
    const hasReceiptPath = evidencePaths.some(
      (p) => p.includes("receipt") || p.includes("cosmicStream") || p.includes("ledger"),
    );
    if (!hasReceiptPath) {
      return {
        approved: false,
        reason: "Receipt objective requires auditable evidence ledger path.",
        policyOutcome: "defer",
      };
    }
  }

  if (
    objectiveId === "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED" &&
    runtimeCtx?.continuityState?.globalRootValid === false
  ) {
    const hasFailSafeEvidence = evidencePaths.length > 0;
    if (!hasFailSafeEvidence) {
      return {
        approved: false,
        reason: "Fail-safe objective requires logged evidence when continuity is invalid.",
        policyOutcome: "escalate",
      };
    }
  }

  return {
    approved: true,
    reason: "Objective satisfied under current policy and evidence.",
    policyOutcome: "approve",
  };
}
