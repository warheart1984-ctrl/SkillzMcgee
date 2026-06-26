/**
 * Substration lifecycle — constitutional pipeline per substration.
 * Purpose is durable. Implementation is replaceable. Evidence is the arbiter.
 */

import { logConstitutionalStage, runConstitutionalExecution } from "./constitutional_flow.js";
import { executeContinuityAction } from "./actions.js";
import { evaluateAdmission } from "./contracts.js";

/**
 * @typedef {Object} SubstrationRunResult
 * @property {any} observation
 * @property {import('./types.js').SubstrationNeed[]} needs
 * @property {import('./types.js').SubstrationTask[]} tasks
 * @property {object[]} evidence
 * @property {object[]} policyOutcomes
 * @property {object[]} decisions
 * @property {object[]} govDecisions
 * @property {import('../governance/receipts.js').SubstrationReceipt[]} receipts
 * @property {boolean} admitted
 */

/**
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {import('./types.js').SubstrationDescriptor} descriptor
 * @param {import('./contracts.js').SubstrationContract} contract
 * @param {{
 *   skipObservation?: boolean;
 *   skipNeeds?: boolean;
 *   skipTaskPlanning?: boolean;
 *   needsForTaskPlanning?: import('./types.js').SubstrationNeed[];
 * }} [options]
 * @returns {Promise<Pick<SubstrationRunResult, 'observation' | 'needs' | 'tasks' | 'admitted'>>}
 */
export async function runSubstrationPlan(ctx, descriptor, contract, options = {}) {
  const { governance } = contract;
  const id = descriptor.id;

  if (!options.skipObservation && !options.skipNeeds) {
    const admission = evaluateAdmission(contract, {
      objectiveAtRisk: (ctx.continuityState?.conflicts?.length ?? 0) > 0,
    });

    if (!admission.admitted && governance.admissionStatus === "provisional") {
      ctx.ledger.log("SUBSTRATION_DEFERRED", {
        substrationId: id,
        governanceObjectiveId: governance.governanceObjectiveId,
        reason: admission.reason,
      });
      return { observation: null, needs: [], tasks: [], admitted: false };
    }
  }

  const observation =
    !options.skipObservation && descriptor.analyze ? descriptor.analyze(ctx) : null;
  if (observation != null) {
    logConstitutionalStage(ctx.ledger, "observation", {
      substrationId: id,
      governanceObjectiveId: governance.governanceObjectiveId,
      observation,
    });
  }

  const needs =
    !options.skipNeeds && descriptor.deriveNeeds
      ? descriptor.deriveNeeds(ctx, observation).map((n) => ({
          ...n,
          sourceSubstration: id,
          governanceObjectiveId: governance.governanceObjectiveId,
        }))
      : [];

  for (const need of needs) {
    logConstitutionalStage(ctx.ledger, "need", {
      substrationId: id,
      governanceObjectiveId: governance.governanceObjectiveId,
      need,
    });
    ctx.ledger.log("CONTINUITY_NEED", { need, substration: id });
  }

  const planningNeeds = options.needsForTaskPlanning ?? needs;
  const tasks =
    !options.skipTaskPlanning && descriptor.planTasks
      ? descriptor.planTasks(ctx, planningNeeds).map((t) => ({
          ...t,
          sourceSubstration: id,
        }))
      : [];

  for (const task of tasks) {
    logConstitutionalStage(ctx.ledger, "task", {
      substrationId: id,
      governanceObjectiveId: governance.governanceObjectiveId,
      task,
    });
  }

  return { observation, needs, tasks, admitted: true };
}

/**
 * Full constitutional lifecycle for one substration.
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {import('./types.js').SubstrationDescriptor} descriptor
 * @param {import('./contracts.js').SubstrationContract} contract
 * @param {import('./types.js').SubstrationTask[]} [tasksOverride]
 * @returns {Promise<SubstrationRunResult>}
 */
export async function runSubstration(ctx, descriptor, contract, tasksOverride) {
  const plan = await runSubstrationPlan(ctx, descriptor, contract);
  if (!plan.admitted) {
    return {
      ...plan,
      evidence: [],
      policyOutcomes: [],
      decisions: [],
      govDecisions: [],
      receipts: [],
    };
  }

  const tasks = tasksOverride ?? plan.tasks;
  /** @type {object[]} */
  const evidence = [];
  /** @type {object[]} */
  const policyOutcomes = [];
  /** @type {object[]} */
  const decisions = [];
  /** @type {object[]} */
  const govDecisions = [];
  /** @type {import('../governance/receipts.js').SubstrationReceipt[]} */
  const receipts = [];

  if (descriptor.act && tasks.length > 0) {
    if (descriptor.id === "continuity_tasks_engine") {
      for (const task of tasks) {
        const result = await runConstitutionalExecution(ctx, task, contract, executeContinuityAction);
        if (result.evidence) evidence.push(result.evidence);
        if (result.policyOutcome) policyOutcomes.push(result.policyOutcome);
        if (result.govDecision) govDecisions.push(result.govDecision);
        if (result.receipt) receipts.push(result.receipt);
      }
    } else {
      await descriptor.act(ctx, tasks);
    }
  } else if (descriptor.act) {
    await descriptor.act(ctx, []);
  }

  return {
    observation: plan.observation,
    needs: plan.needs,
    tasks,
    evidence,
    policyOutcomes,
    decisions,
    govDecisions,
    receipts,
    admitted: true,
  };
}
