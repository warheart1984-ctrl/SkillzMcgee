/**
 * Cluster II — Field & attractor (6 substrations)
 */

import { now } from "./actions.js";

/** @type {import('./types.js').SubstrationDescriptor[]} */
export const fieldAttractorSubstrations = [
  {
    id: "stability_attractor_fields",
    name: "Stability Attractor Fields",
    cluster: "field_attractor",
    purpose: "Pull system toward stable configurations.",
    enabled: true,
    analyze: (ctx) => ({
      instability: ctx.continuityState.conflicts?.length || 0,
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      if (analysis.instability > 0) {
        needs.push({
          id: `need:stability:${t}`,
          type: "increase_stability_pressure",
          severity: "medium",
          reason: "Instability detected in continuity state",
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "divergence_dampening_field",
    name: "Divergence Dampening Field",
    cluster: "field_attractor",
    purpose: "Reduce chaotic drift between nodes.",
    enabled: true,
    analyze: (ctx) => ({
      drift: ctx.continuityState.drift || 0,
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      if (analysis.drift > 0) {
        needs.push({
          id: `need:dampen_drift:${t}`,
          type: "dampen_drift",
          severity: "high",
          reason: "Node drift detected",
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "migration_flow_field",
    name: "Migration Flow Field",
    cluster: "field_attractor",
    purpose: "Optimize worldline movement across nodes.",
    enabled: true,
    analyze: (ctx) => ({
      congestion: ctx.continuityState.nodeCongestion || {},
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const nodeId of Object.keys(analysis.congestion)) {
        if (analysis.congestion[nodeId] > 0.7) {
          needs.push({
            id: `need:rebalance:${nodeId}:${t}`,
            type: "rebalance_lineages",
            severity: "medium",
            reason: `Node ${nodeId} is congested`,
            createdAt: t,
          });
        }
      }
      return needs;
    },
  },

  {
    id: "reconciliation_gravity_well",
    name: "Reconciliation Gravity Well",
    cluster: "field_attractor",
    purpose: "Pull conflicting states toward resolution.",
    enabled: true,
    analyze: (ctx) => ({
      conflictClusters: ctx.continuityState.conflictClusters || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const cluster of analysis.conflictClusters) {
        needs.push({
          id: `need:resolve_cluster:${cluster.id}:${t}`,
          type: "pull_toward_resolution",
          severity: "high",
          reason: `Conflict cluster detected: ${cluster.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "epoch_boundary_field",
    name: "Epoch Boundary Field",
    cluster: "field_attractor",
    purpose: "Detect approach to natural epoch boundaries.",
    enabled: true,
    analyze: (ctx) => ({
      instabilityTrend: ctx.continuityState.instabilityTrend || "stable",
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      if (analysis.instabilityTrend === "rising") {
        needs.push({
          id: `need:epoch_review:${t}`,
          type: "evaluate_epoch_boundary",
          severity: "medium",
          reason: "Instability trend rising",
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "collapse_operator_substrate",
    name: "Collapse Operator Substrate",
    cluster: "field_attractor",
    purpose: "Allow partial resets without full genesis.",
    enabled: true,
    analyze: (ctx) => ({
      collapseCandidates: ctx.continuityState.collapseCandidates || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const c of analysis.collapseCandidates) {
        needs.push({
          id: `need:collapse:${c.id}:${t}`,
          type: "collapse_subsystem",
          severity: "critical",
          reason: `Subsystem collapse candidate: ${c.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
    planTasks: (_ctx, needs) => {
      const tasks = [];
      const t = now();
      for (const need of needs.filter((n) => n.type === "collapse_subsystem")) {
        tasks.push({
          id: `task:collapse:${t}`,
          needId: need.id,
          action: "collapse_subsystem",
          params: { subsystemId: need.reason },
          createdAt: t,
        });
      }
      return tasks;
    },
  },
];
