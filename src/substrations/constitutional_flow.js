/**
 * Constitutional execution flow for substrations.
 *
 * Governance Objective → Contract (runtime + governance) → Implementation
 *   → Observation → Need → Task → Execution → Evidence
 *   → Policy Evaluation → Policy Outcome → Governance Decision → State Transition
 *
 * The Substration Engine is orchestral — it runs this pipeline and delegates
 * policy to CRK-1. It never emits law.
 */

import { evaluateSubstrationGovernance } from "../crk1/governance_evaluator.js";
import { evaluateInvariant, buildRunContext } from "../crk1/invariant_evaluator.js";
import { safeModeProfileApplied } from "../governance/safe_mode.js";
import { collectEvidencePaths, makeSubstrationReceipt } from "../governance/receipts.js";
import { appendSubstrationReceipt } from "../governance/continuity_ledger.js";

/** @typedef {'observation' | 'need' | 'task' | 'execution' | 'evidence' | 'policy_evaluation' | 'policy_outcome' | 'governance_decision' | 'state_transition'} ConstitutionalStage */

/** @type {ConstitutionalStage[]} */
export const CONSTITUTIONAL_STAGES = [
  "observation",
  "need",
  "task",
  "execution",
  "evidence",
  "policy_evaluation",
  "policy_outcome",
  "governance_decision",
  "state_transition",
];

/**
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 * @param {ConstitutionalStage} stage
 * @param {object} payload
 */
export function logConstitutionalStage(ledger, stage, payload) {
  ledger.log("CONSTITUTIONAL_FLOW", {
    stage,
    ...payload,
    timestamp: Date.now(),
  });
}

/**
 * @param {import('./contracts.js').SubstrationContract} contract
 * @returns {string}
 */
function contractSubstrationId(contract) {
  return contract.governance?.id ?? contract.runtime?.id ?? "unknown";
}

/**
 * Policy evaluation — delegates to CRK-1 only (never inline law).
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {import('./types.js').SubstrationTask} task
 * @param {import('./contracts.js').SubstrationContract} [contract]
 * @returns {Promise<{ allowed: boolean; reason?: string; hook?: string }>}
 */
export async function evaluatePolicy(ctx, task, contract) {
  const crk1 = ctx.crk1;
  if (!crk1?.checkActionAgainstInvariants && !crk1?.checkAction) {
    return { allowed: true, hook: "none" };
  }

  if (crk1.checkActionAgainstInvariants) {
    const check = await crk1.checkActionAgainstInvariants(task, [], ctx);
    if (check !== true) {
      return {
        allowed: false,
        reason: check?.reason ?? "invariant_violation",
        hook: "crk1.checkActionAgainstInvariants",
      };
    }
  }

  if (crk1.checkAction) {
    const allowed = await crk1.checkAction(task, ctx);
    if (!allowed) {
      return { allowed: false, reason: "crk1.checkAction_vetoed", hook: "crk1.checkAction" };
    }
  }

  const trace = contract?.governance?.traceabilityLinks;
  return {
    allowed: true,
    hook: trace?.ctsId ?? "crk1",
  };
}

/**
 * Governance decision — logged here; binding occurs in governanceTick (Spine).
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {{ allowed: boolean; reason?: string; hook?: string }} policyOutcome
 * @param {import('./contracts.js').SubstrationContract} contract
 */
export async function governanceDecision(ctx, policyOutcome, contract) {
  return {
    decision: "defer_to_spine",
    governanceObjectiveId: contract.governance.governanceObjectiveId,
    allowed: policyOutcome.allowed,
    note: "Binding occurs in governanceTick — engine does not bind",
    traceability: contract.governance.traceabilityLinks,
  };
}

/**
 * State transition — observational log; constitutional binding in governanceTick.
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {{ type?: string; reason?: string; decision?: string; task?: import('./types.js').SubstrationTask }} transition
 * @param {import('./contracts.js').SubstrationContract} contract
 * @param {import('./types.js').SubstrationTask} [task]
 */
export async function applyStateTransition(ctx, transition, contract, task) {
  logConstitutionalStage(ctx.ledger, "state_transition", {
    substrationId: contractSubstrationId(contract),
    taskId: task?.id ?? transition.task?.id ?? null,
    action: task?.action ?? transition.task?.action ?? null,
    transitionType: transition.type ?? transition.decision ?? "unknown",
    reason: transition.reason ?? null,
    governanceObjectiveId: contract.governance.governanceObjectiveId,
    traceability: contract.governance.traceabilityLinks,
    continuitySnapshot: ctx.continuityState?.healthSummary?.status ?? null,
  });
}

/**
 * Run execution with constitutional envelope: policy → execute → evidence → decision → transition.
 * Governance binding happens in governanceTick.
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {import('./types.js').SubstrationTask} task
 * @param {import('./contracts.js').SubstrationContract} contract
 * @param {(ctx: import('./types.js').SubstrationContext, task: import('./types.js').SubstrationTask) => Promise<void>} execute
 */
export async function runConstitutionalExecution(ctx, task, contract, execute) {
  const substrationId = contractSubstrationId(contract);
  const { runtime, governance } = contract;

  logConstitutionalStage(ctx.ledger, "execution", {
    substrationId,
    taskId: task.id,
    action: task.action,
    executionSemantics: runtime.executionSemantics,
  });

  logConstitutionalStage(ctx.ledger, "policy_evaluation", {
    substrationId,
    taskId: task.id,
    governanceObjectiveId: governance.governanceObjectiveId,
    traceability: governance.traceabilityLinks,
  });

  const policy = await evaluatePolicy(ctx, task, contract);

  logConstitutionalStage(ctx.ledger, "policy_outcome", {
    substrationId,
    taskId: task.id,
    allowed: policy.allowed,
    reason: policy.reason ?? null,
    hook: policy.hook,
  });

  if (!policy.allowed) {
    ctx.ledger.log("CONSTITUTIONAL_TASK_VETOED", {
      substrationId,
      task,
      reason: policy.reason,
      governanceObjectiveId: governance.governanceObjectiveId,
    });

    const evidencePaths = collectEvidencePaths(null, contract);
    const govDecision = await evaluateSubstrationGovernance(
      {
        objectiveId: governance.governanceObjectiveId,
        contract,
        evidencePaths,
        task,
      },
      ctx,
    );

    logConstitutionalStage(ctx.ledger, "governance_decision", {
      substrationId,
      taskId: task.id,
      govDecision,
    });

    await applyStateTransition(
      ctx,
      { type: "no-op", reason: policy.reason ?? govDecision.reason },
      contract,
      task,
    );

    const receipt = makeSubstrationReceipt({
      contract,
      observation: null,
      need: null,
      task,
      evidence: { paths: evidencePaths, summary: "policy_vetoed" },
      policyOutcome: "reject",
      governanceDecision: policy.reason ?? govDecision.reason,
      stateTransitionSummary: "No-op under policy veto.",
    });
    await appendSubstrationReceipt(ctx.ledger, receipt);

    return {
      executed: false,
      vetoed: true,
      reason: policy.reason,
      policyOutcome: policy,
      govDecision,
      receipt,
    };
  }

  await execute(ctx, task);

  const evidence = {
    taskId: task.id,
    types: runtime.evidenceProduced,
    ledgerPath: governance.traceabilityLinks.evidenceLedgerPath,
  };
  const evidencePaths = collectEvidencePaths(evidence, contract);

  logConstitutionalStage(ctx.ledger, "evidence", {
    substrationId,
    taskId: task.id,
    evidenceTypes: runtime.evidenceProduced,
    ledgerPath: governance.traceabilityLinks.evidenceLedgerPath,
    evidencePaths,
  });

  const runContext = buildRunContext(ctx, {
    observation: null,
    need: null,
    task,
    evidence,
    receipt: evidence,
    safeModeProfileApplied: safeModeProfileApplied(),
  });
  const invResult = evaluateInvariant({
    objectiveId: governance.governanceObjectiveId,
    contract,
    runContext,
  });

  logConstitutionalStage(ctx.ledger, "policy_evaluation", {
    substrationId,
    taskId: task.id,
    stage: "invariant_evaluation",
    invResult,
  });

  if (!invResult.ok) {
    await applyStateTransition(
      ctx,
      { type: "no-op", reason: invResult.message },
      contract,
      task,
    );

    const receipt = makeSubstrationReceipt({
      contract,
      observation: null,
      need: null,
      task,
      evidence: { paths: evidencePaths, summary: "invariant_failed" },
      policyOutcome: "reject",
      governanceDecision: invResult.message,
      stateTransitionSummary: "No-op under invariant failure (fail safe, not silent).",
    });
    await appendSubstrationReceipt(ctx.ledger, receipt);

    return {
      executed: true,
      vetoed: false,
      invariantFailed: true,
      policyOutcome: policy,
      evidence: { ...evidence, paths: evidencePaths },
      invResult,
      receipt,
    };
  }

  const govDecision = await evaluateSubstrationGovernance(
    {
      objectiveId: governance.governanceObjectiveId,
      contract,
      evidencePaths,
      task,
    },
    ctx,
  );

  logConstitutionalStage(ctx.ledger, "governance_decision", {
    substrationId,
    taskId: task.id,
    govDecision,
  });

  if (!govDecision.approved) {
    await applyStateTransition(
      ctx,
      { type: "no-op", reason: govDecision.reason },
      contract,
      task,
    );

    const receipt = makeSubstrationReceipt({
      contract,
      observation: null,
      need: null,
      task,
      evidence: { paths: evidencePaths, summary: "executed_but_governance_deferred" },
      policyOutcome: govDecision.policyOutcome,
      governanceDecision: govDecision.reason,
      stateTransitionSummary: "No-op under governance evaluation.",
    });
    await appendSubstrationReceipt(ctx.ledger, receipt);

    return {
      executed: true,
      vetoed: false,
      governanceVetoed: true,
      policyOutcome: policy,
      evidence: { ...evidence, paths: evidencePaths },
      govDecision,
      receipt,
    };
  }

  await applyStateTransition(ctx, { type: "apply", task }, contract, task);

  const receipt = makeSubstrationReceipt({
    contract,
    observation: null,
    need: null,
    task,
    evidence: { paths: evidencePaths, summary: "execution_complete" },
    policyOutcome: govDecision.policyOutcome,
    governanceDecision: govDecision.reason,
    stateTransitionSummary: "Applied state transition (binding deferred to governanceTick).",
  });
  await appendSubstrationReceipt(ctx.ledger, receipt);

  return {
    executed: true,
    vetoed: false,
    policyOutcome: policy,
    evidence: { ...evidence, paths: evidencePaths },
    govDecision,
    invResult,
    receipt,
  };
}

/**
 * Log planning stages for a single substration (Mind phase).
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 * @param {string} substrationId
 * @param {import('./contracts.js').SubstrationContract} contract
 * @param {object} phases
 */
export function logPlanningFlow(ledger, substrationId, contract, phases) {
  const govId = contract?.governance?.governanceObjectiveId;
  if (phases.observation != null) {
    logConstitutionalStage(ledger, "observation", {
      substrationId,
      governanceObjectiveId: govId,
      observation: phases.observation,
    });
  }
  if (phases.needs?.length) {
    for (const need of phases.needs) {
      logConstitutionalStage(ledger, "need", {
        substrationId,
        governanceObjectiveId: govId,
        need,
      });
    }
  }
  if (phases.tasks?.length) {
    for (const task of phases.tasks) {
      logConstitutionalStage(ledger, "task", {
        substrationId,
        governanceObjectiveId: govId,
        task,
      });
    }
  }
}
