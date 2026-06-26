/**
 * SubstrationEngine — orchestral executor under law (not a source of law).
 *
 * Governance Objective → Contract (runtime + governance) → Implementation
 *   → Observation → Need → Task → Execution → Evidence
 *   → Policy Evaluation → Policy Outcome → Governance Decision → State Transition
 */

import { contractFor } from "./contracts.js";
import { runConstitutionalExecution } from "./constitutional_flow.js";
import { runSubstrationPlan } from "./lifecycle.js";
import { executeContinuityAction } from "./actions.js";

/** Substrations that execute on the aggregated task list */
const TASK_EXECUTORS = new Set([
  "continuity_tasks_engine",
  "continuity_agents",
  "continuity_repair_substrate",
]);

/** Substrations that tick without tasks */
const TICK_ONLY = new Set([
  "meta_continuity_substrate",
  "cosmological_memory_substrate",
]);

/**
 * @param {import('./types.js').SubstrationDescriptor[]} substrations
 */
export class SubstrationEngine {
  constructor(substrations) {
    this.substrations = substrations.map((s) => ({
      ...s,
      contract: s.contract ?? contractFor(s),
    }));
    /** @type {Map<string, import('./contracts.js').SubstrationContract>} */
    this.contracts = new Map(this.substrations.map((s) => [s.id, s.contract]));
  }

  /**
   * Mind phase — analyze continuity, derive needs, plan tasks (no execution).
   * @param {import('./types.js').SubstrationContext} ctx
   * @returns {Promise<{ needs: import('./types.js').SubstrationNeed[]; tasks: import('./types.js').SubstrationTask[] }>}
   */
  async plan(ctx) {
    /** @type {import('./types.js').SubstrationNeed[]} */
    const allNeeds = [];
    /** @type {import('./types.js').SubstrationTask[]} */
    const allTasks = [];

    for (const s of this.substrations) {
      if (!s.enabled) continue;
      const contract = this.contracts.get(s.id);
      if (!contract) continue;

      const partial = await runSubstrationPlan(ctx, s, contract, { skipTaskPlanning: true });
      if (!partial.admitted) continue;
      allNeeds.push(...partial.needs);
    }

    for (const s of this.substrations) {
      if (!s.enabled || !s.planTasks) continue;
      const contract = this.contracts.get(s.id);
      if (!contract) continue;

      const partial = await runSubstrationPlan(ctx, s, contract, {
        skipObservation: true,
        skipNeeds: true,
        needsForTaskPlanning: allNeeds,
      });
      allTasks.push(...partial.tasks);
    }

    return { needs: allNeeds, tasks: allTasks };
  }

  /**
   * Will phase — execute planned substration tasks.
   * @param {import('./types.js').SubstrationContext} ctx
   * @param {{ needs: import('./types.js').SubstrationNeed[]; tasks: import('./types.js').SubstrationTask[] }} plan
   * @returns {Promise<{ actedBy: string[] }>}
   */
  async act(ctx, plan) {
    const { tasks: allTasks } = plan;
    /** @type {string[]} */
    const actedBy = [];

    for (const s of this.substrations) {
      if (!s.enabled || !s.act) continue;
      const contract = this.contracts.get(s.id);
      if (!contract) continue;

      if (TICK_ONLY.has(s.id)) {
        await s.act(ctx, []);
        actedBy.push(s.id);
        continue;
      }

      if (TASK_EXECUTORS.has(s.id) && allTasks.length > 0) {
        if (s.id === "continuity_tasks_engine") {
          for (const task of allTasks) {
            await runConstitutionalExecution(ctx, task, contract, executeContinuityAction);
          }
        } else {
          await s.act(ctx, allTasks);
        }
        actedBy.push(s.id);
      }
    }

    return { actedBy };
  }

  /**
   * Full tick — plan then act (legacy convenience).
   * @param {import('./types.js').SubstrationContext} ctx
   * @returns {Promise<import('./types.js').TickResult>}
   */
  async tick(ctx) {
    const plan = await this.plan(ctx);
    const { actedBy } = await this.act(ctx, plan);
    return { ...plan, actedBy };
  }

  getByCluster(cluster) {
    return this.substrations.filter((s) => s.cluster === cluster);
  }

  list() {
    return this.substrations.map((s) => ({
      id: s.id,
      name: s.name,
      cluster: s.cluster,
      enabled: s.enabled,
      governanceObjectiveId: s.contract?.governance?.governanceObjectiveId,
      admissionStatus: s.contract?.governance?.admissionStatus,
      uniqueContribution: s.contract?.governance?.uniqueContribution,
    }));
  }

  getContract(substrationId) {
    return this.contracts.get(substrationId);
  }
}
