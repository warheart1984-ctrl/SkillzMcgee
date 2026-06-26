/**
 * Cluster IV — Cosmological evolution (6 substrations)
 */

import { now } from "./actions.js";

/** @type {import('./types.js').SubstrationDescriptor[]} */
export const cosmologicalSubstrations = [
  {
    id: "genesis_candidate_detector",
    name: "Genesis Candidate Detector",
    cluster: "cosmological_evolution",
    purpose: "Identify when new genesis events are beneficial.",
    enabled: true,
    analyze: (ctx) => ({
      instabilityTrend: ctx.continuityState.instabilityTrend || "stable",
      drift: ctx.continuityState.drift || 0,
    }),
    deriveNeeds: (ctx, analysis) => {
      const needs = [];
      const t = now();
      if (analysis.instabilityTrend === "rising" && analysis.drift > 0.5) {
        const need = {
          id: `need:genesis_candidate:${t}`,
          type: "evaluate_genesis_candidate",
          severity: "high",
          reason: "System instability suggests genesis candidate",
          createdAt: t,
        };
        ctx.ledger.log("GENESIS_CANDIDATE_NEED", { need, analysis });
        needs.push(need);
      }
      return needs;
    },
    planTasks: (_ctx, needs) => {
      const tasks = [];
      const t = now();
      for (const need of needs.filter((n) => n.type === "evaluate_genesis_candidate")) {
        tasks.push({
          id: `task:genesis:${t}`,
          needId: need.id,
          action: "evaluate_genesis_candidate",
          params: {},
          createdAt: t,
        });
      }
      return tasks;
    },
  },

  {
    id: "multi_genesis_orchestrator",
    name: "Multi-Genesis Orchestrator",
    cluster: "cosmological_evolution",
    purpose: "Coordinate simultaneous genesis events.",
    enabled: true,
    deriveNeeds: () => {
      const t = now();
      return [
        {
          id: `need:multi_genesis_scan:${t}`,
          type: "scan_multi_genesis",
          severity: "medium",
          reason: "Periodic multi-genesis scan",
          createdAt: t,
        },
      ];
    },
  },

  {
    id: "cosmological_drift_engine",
    name: "Cosmological Drift Engine",
    cluster: "cosmological_evolution",
    purpose: "Allow controlled divergence between universes.",
    enabled: true,
    analyze: (ctx) => ({
      drift: ctx.continuityState.drift || 0,
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      if (analysis.drift > 0.8) {
        needs.push({
          id: `need:drift_control:${t}`,
          type: "control_cosmological_drift",
          severity: "critical",
          reason: "Cosmological drift too high",
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "universe_fork_manager",
    name: "Universe Fork Manager",
    cluster: "cosmological_evolution",
    purpose: "Handle intentional branching of cosmos states.",
    enabled: true,
    deriveNeeds: () => {
      const t = now();
      return [
        {
          id: `need:fork_scan:${t}`,
          type: "scan_fork_conditions",
          severity: "low",
          reason: "Periodic fork condition scan",
          createdAt: t,
        },
      ];
    },
  },

  {
    id: "universe_merge_engine",
    name: "Universe Merge Engine",
    cluster: "cosmological_evolution",
    purpose: "Allow two universes to recombine.",
    enabled: true,
    analyze: (ctx) => ({
      mergeCandidates: ctx.continuityState.mergeCandidates || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const c of analysis.mergeCandidates) {
        needs.push({
          id: `need:merge:${c.id}:${t}`,
          type: "evaluate_universe_merge",
          severity: "high",
          reason: `Universe merge candidate: ${c.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "cosmological_memory_substrate",
    name: "Cosmological Memory Substrate",
    cluster: "cosmological_evolution",
    purpose: "Store long-term history of epochs and universes.",
    enabled: true,
    act: async (ctx) => {
      ctx.ledger.log("COSMOLOGICAL_MEMORY_TICK", {
        timestamp: now(),
      });
    },
  },
];
