/**
 * SubstrationEngine — runs 30 substrations against federation state
 *
 * Tick pipeline:
 * 1. analyze (per substration)
 * 2. deriveNeeds (aggregate)
 * 3. planTasks (aggregate)
 * 4. act (executors receive full task list)
 */

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
    this.substrations = substrations;
  }

  /**
   * Mind phase — analyze continuity, derive needs, plan tasks (no execution).
   * @param {import('./types.js').SubstrationContext} ctx
   * @returns {Promise<{ needs: import('./types.js').SubstrationNeed[]; tasks: import('./types.js').SubstrationTask[] }>}
   */
  async plan(ctx) {
    /** @type {Map<string, any>} */
    const analyses = new Map();
    /** @type {import('./types.js').SubstrationNeed[]} */
    const allNeeds = [];
    /** @type {import('./types.js').SubstrationTask[]} */
    const allTasks = [];

    for (const s of this.substrations) {
      if (!s.enabled || !s.analyze) continue;
      analyses.set(s.id, s.analyze(ctx));
    }

    for (const s of this.substrations) {
      if (!s.enabled || !s.deriveNeeds) continue;
      const analysis = analyses.get(s.id) ?? null;
      const needs = s.deriveNeeds(ctx, analysis).map((n) => ({
        ...n,
        sourceSubstration: s.id,
      }));
      for (const need of needs) {
        ctx.ledger.log("CONTINUITY_NEED", { need, substration: s.id });
        allNeeds.push(need);
      }
    }

    for (const s of this.substrations) {
      if (!s.enabled || !s.planTasks) continue;
      const tasks = s.planTasks(ctx, allNeeds).map((t) => ({
        ...t,
        sourceSubstration: s.id,
      }));
      allTasks.push(...tasks);
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

      if (TICK_ONLY.has(s.id)) {
        await s.act(ctx, []);
        actedBy.push(s.id);
        continue;
      }

      if (TASK_EXECUTORS.has(s.id) && allTasks.length > 0) {
        await s.act(ctx, allTasks);
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
    }));
  }
}
