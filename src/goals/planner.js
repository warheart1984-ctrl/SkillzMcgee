/**
 * Translate constitutional goals into substration tasks.
 */

import { now } from "../substrations/actions.js";

/** @type {Record<string, (goal: import('./types.js').Goal, ctx: import('../substrations/types.js').SubstrationContext) => import('../substrations/types.js').SubstrationTask[]>} */
const GOAL_PLANNERS = {
  restore_stability: (goal, ctx) => {
    const tasks = [];
    const t = now();
    const state = ctx.continuityState;

    if (!state.globalRootValid) {
      tasks.push({
        id: `task:recompute:${t}`,
        needId: goal.id,
        action: "recompute_global_root",
        params: {},
        createdAt: t,
      });
    }
    if ((state.conflicts?.length ?? 0) > 0) {
      tasks.push({
        id: `task:reconcile:${t}`,
        needId: goal.id,
        action: "run_reconciliation",
        params: {},
        createdAt: t,
      });
    }
    return tasks;
  },

  repair_fabric: (goal, ctx) => {
    const t = now();
    const tasks = [];
    for (const v of ctx.continuityState.sovereigntyViolations ?? []) {
      tasks.push({
        id: `task:sovereignty:${v.lineage}:${t}`,
        needId: goal.id,
        action: "restore_lineage_sovereignty",
        params: { lineageId: v.lineage },
        createdAt: t,
      });
    }
    for (const lineage of ctx.continuityState.brokenLineages ?? []) {
      tasks.push({
        id: `task:repair:${lineage.id}:${t}`,
        needId: goal.id,
        action: "repair_lineage_chain",
        params: { lineageId: lineage.id, reversible: true },
        createdAt: t,
      });
    }
    return tasks;
  },

  fork_universe: (goal) => {
    const t = now();
    return [
      {
        id: `task:fork:${t}`,
        needId: goal.id,
        action: "scan_fork_conditions",
        params: { reversible: true },
        createdAt: t,
      },
    ];
  },

  collapse_subsystem: (goal, ctx) => {
    const t = now();
    const candidate = ctx.continuityState.collapseCandidates?.[0];
    return [
      {
        id: `task:collapse:${t}`,
        needId: goal.id,
        action: "collapse_subsystem",
        params: {
          subsystemId: candidate?.id ?? "unstable_subsystem",
          reversible: true,
        },
        createdAt: t,
      },
    ];
  },

  initiate_genesis: (goal, ctx) => {
    const t = now();
    return [
      {
        id: `task:genesis:${t}`,
        needId: goal.id,
        action: "evaluate_genesis_candidate",
        params: {
          drift: ctx.continuityState.drift,
          instabilityTrend: ctx.continuityState.instabilityTrend,
        },
        createdAt: t,
      },
    ];
  },

  transition_epoch: (goal, ctx) => {
    const t = now();
    const signal = ctx.continuityState.epochSignals?.[0];
    return [
      {
        id: `task:epoch:${t}`,
        needId: goal.id,
        action: "evaluate_epoch_transition",
        params: { signalId: signal?.id },
        createdAt: t,
      },
    ];
  },

  preemptive_stabilization: (goal) => {
    const t = now();
    return [
      {
        id: `task:preempt:${t}`,
        needId: goal.id,
        action: "increase_stability_pressure",
        params: {},
        createdAt: t,
      },
    ];
  },

  resolve_conflicts: (goal, ctx) => GOAL_PLANNERS.restore_stability(goal, ctx),
};

/**
 * @param {import('./types.js').Goal} goal
 * @param {import('../substrations/types.js').SubstrationContext} [ctx]
 */
export function planTasksForGoal(goal, ctx = { continuityState: {} }) {
  const key = goal.id.split(":")[1] ?? goal.domain;
  const planner =
    GOAL_PLANNERS[key] ??
    GOAL_PLANNERS[goal.description?.toLowerCase().includes("repair") ? "repair_fabric" : "restore_stability"];

  if (goal.id.includes("restore_stability")) return GOAL_PLANNERS.restore_stability(goal, ctx);
  if (goal.id.includes("repair_fabric")) return GOAL_PLANNERS.repair_fabric(goal, ctx);
  if (goal.id.includes("fork_universe")) return GOAL_PLANNERS.fork_universe(goal, ctx);
  if (goal.id.includes("collapse_subsystem")) return GOAL_PLANNERS.collapse_subsystem(goal, ctx);
  if (goal.id.includes("initiate_genesis")) return GOAL_PLANNERS.initiate_genesis(goal, ctx);
  if (goal.id.includes("transition_epoch")) return GOAL_PLANNERS.transition_epoch(goal, ctx);
  if (goal.id.includes("preemptive_stabilization")) return GOAL_PLANNERS.preemptive_stabilization(goal, ctx);
  if (goal.id.includes("resolve_conflicts")) return GOAL_PLANNERS.resolve_conflicts(goal, ctx);

  return planner(goal, ctx);
}
