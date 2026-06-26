/**
 * Cluster I — Continuity organism (6 substrations)
 */

import { now, executeContinuityAction } from "./actions.js";

/** @type {import('./types.js').SubstrationDescriptor[]} */
export const continuitySubstrations = [
  {
    id: "continuity_needs_engine",
    name: "Continuity Needs Engine",
    cluster: "continuity_organism",
    purpose: "Assess continuity health and derive needs.",
    enabled: true,
    analyze: (ctx) => {
      const state = ctx.continuityState;
      return {
        conflictCount: state.conflicts?.length || 0,
        globalRootValid: state.globalRootValid ?? true,
      };
    },
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();

      if (!analysis.globalRootValid) {
        needs.push({
          id: `need:global_root:${t}`,
          type: "recompute_global_root",
          severity: "critical",
          reason: "Global root invalid",
          createdAt: t,
        });
      }

      if (analysis.conflictCount > 0) {
        needs.push({
          id: `need:reconcile:${t}`,
          type: "run_reconciliation",
          severity: "high",
          reason: "Conflicts detected in continuity state",
          createdAt: t,
        });
      }

      return needs;
    },
    planTasks: (_ctx, needs) => {
      const tasks = [];
      const t = now();
      for (const need of needs) {
        tasks.push({
          id: `task:${need.type}:${t}`,
          needId: need.id,
          action: need.type,
          params: {},
          createdAt: t,
        });
      }
      return tasks;
    },
  },

  {
    id: "continuity_tasks_engine",
    name: "Continuity Tasks Engine",
    cluster: "continuity_organism",
    purpose: "Coordinate execution of continuity tasks.",
    enabled: true,
    act: async (ctx, tasks) => {
      for (const task of tasks) {
        await executeContinuityAction(ctx, task);
      }
    },
  },

  {
    id: "continuity_agents",
    name: "Continuity Agents",
    cluster: "continuity_organism",
    purpose: "Spawn agents to execute continuity tasks.",
    enabled: true,
    act: async (ctx, tasks) => {
      for (const task of tasks) {
        if (ctx.agents?.spawn) {
          await ctx.agents.spawn("continuity_agent", {
            task,
            continuityState: ctx.continuityState,
          });
        }
        ctx.ledger.log("CONTINUITY_AGENT_SPAWN", { task });
      }
    },
  },

  {
    id: "continuity_immunity_layer",
    name: "Continuity Immunity Layer",
    cluster: "continuity_organism",
    purpose: "Detect and neutralize harmful state patterns.",
    enabled: true,
    analyze: (ctx) => ({
      harmfulPatterns: ctx.continuityState.harmfulPatterns || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const pattern of analysis.harmfulPatterns) {
        needs.push({
          id: `need:neutralize:${pattern.id}:${t}`,
          type: "neutralize_pattern",
          severity: "critical",
          reason: `Harmful pattern detected: ${pattern.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
    planTasks: (_ctx, needs) => {
      const tasks = [];
      const t = now();
      for (const need of needs.filter((n) => n.type === "neutralize_pattern")) {
        tasks.push({
          id: `task:neutralize:${t}`,
          needId: need.id,
          action: "neutralize_pattern",
          params: { patternId: need.reason },
          createdAt: t,
        });
      }
      return tasks;
    },
  },

  {
    id: "continuity_repair_substrate",
    name: "Continuity Repair Substrate",
    cluster: "continuity_organism",
    purpose: "Repair damaged lineage chains and Merkle segments.",
    enabled: true,
    act: async (ctx, tasks) => {
      for (const task of tasks) {
        if (task.action === "repair_lineage_chain") {
          ctx.ledger.log("REPAIR_LINEAGE", task.params);
          if (ctx.baseLedger?.repairLineage) {
            await ctx.baseLedger.repairLineage(task.params?.lineageId);
          }
        }
      }
    },
  },

  {
    id: "continuity_forecasting_engine",
    name: "Continuity Forecasting Engine",
    cluster: "continuity_organism",
    purpose: "Predict future continuity failures.",
    enabled: true,
    analyze: (ctx) => ({
      trend: ctx.continuityState.trend || "stable",
    }),
    deriveNeeds: (_ctx, analysis) => {
      if (analysis.trend === "rising") {
        const t = now();
        return [
          {
            id: `need:increase_reconciliation:${t}`,
            type: "increase_reconciliation_frequency",
            severity: "medium",
            reason: "Instability trend rising",
            createdAt: t,
          },
        ];
      }
      return [];
    },
  },
];
