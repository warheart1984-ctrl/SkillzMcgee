/**
 * Cluster III — Governance & arbitration (6 substrations)
 */

import { now } from "./actions.js";

/** @type {import('./types.js').SubstrationDescriptor[]} */
export const governanceSubstrations = [
  {
    id: "continuity_arbitration_engine",
    name: "Continuity Arbitration Engine",
    cluster: "governance_arbitration",
    purpose: "Decide which node's state is authoritative.",
    enabled: true,
    analyze: (ctx) => ({
      conflicts: ctx.continuityState.conflicts || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const conflict of analysis.conflicts) {
        needs.push({
          id: `need:arbitrate:${conflict.conflictId ?? conflict.id}:${t}`,
          type: "arbitrate_conflict",
          severity: "high",
          reason: `Conflict requires arbitration: ${conflict.conflictId ?? conflict.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "federated_rule_harmonizer",
    name: "Federated Rule Harmonizer",
    cluster: "governance_arbitration",
    purpose: "Keep CRK-1 rulesets compatible across nodes.",
    enabled: true,
    analyze: (ctx) => ({
      ruleDrift: ctx.federationConfig?.ruleDrift || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const drift of analysis.ruleDrift) {
        needs.push({
          id: `need:harmonize:${drift.node}:${t}`,
          type: "harmonize_rules",
          severity: "medium",
          reason: `Rule drift detected on node ${drift.node}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "constitutional_drift_detector",
    name: "Constitutional Drift Detector",
    cluster: "governance_arbitration",
    purpose: "Detect governance deviation in nodes.",
    enabled: true,
    analyze: (ctx) => ({
      driftSignals: ctx.continuityState.driftSignals || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const signal of analysis.driftSignals) {
        needs.push({
          id: `need:constitutional_review:${signal.node}:${t}`,
          type: "constitutional_review",
          severity: "high",
          reason: `Constitutional drift detected on node ${signal.node}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "lineage_sovereignty_manager",
    name: "Lineage Sovereignty Manager",
    cluster: "governance_arbitration",
    purpose: "Preserve lineage rights and constraints.",
    enabled: true,
    analyze: (ctx) => ({
      sovereigntyViolations: ctx.continuityState.sovereigntyViolations || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const v of analysis.sovereigntyViolations) {
        needs.push({
          id: `need:sovereignty:${v.lineage}:${t}`,
          type: "restore_lineage_sovereignty",
          severity: "critical",
          reason: `Lineage sovereignty violation: ${v.lineage}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "federated_quorum_engine",
    name: "Federated Quorum Engine",
    cluster: "governance_arbitration",
    purpose: "Determine when decisions have enough signatures.",
    enabled: true,
    analyze: (ctx) => ({
      pendingDecisions: ctx.continuityState.pendingDecisions || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const d of analysis.pendingDecisions) {
        needs.push({
          id: `need:quorum_check:${d.id}:${t}`,
          type: "check_quorum",
          severity: "medium",
          reason: `Decision requires quorum check: ${d.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },

  {
    id: "epoch_governance_substrate",
    name: "Epoch Governance Substrate",
    cluster: "governance_arbitration",
    purpose: "Manage transitions between epochs.",
    enabled: true,
    analyze: (ctx) => ({
      epochSignals: ctx.continuityState.epochSignals || [],
    }),
    deriveNeeds: (_ctx, analysis) => {
      const needs = [];
      const t = now();
      for (const s of analysis.epochSignals) {
        needs.push({
          id: `need:epoch_transition:${s.id}:${t}`,
          type: "evaluate_epoch_transition",
          severity: "high",
          reason: `Epoch transition signal detected: ${s.id}`,
          createdAt: t,
        });
      }
      return needs;
    },
  },
];
