/**
 * First-order behavioral grammar — WHEN → THEN → MUST SATISFY
 */

import { ORGANISM_INVARIANTS } from "../goals/invariants.js";

const I = ORGANISM_INVARIANTS;

/**
 * @typedef {Object} BehaviorRule
 * @property {string} id
 * @property {(ctx: import('../substrations/types.js').SubstrationContext) => boolean} when
 * @property {(ctx: import('../substrations/types.js').SubstrationContext) => import('../goals/types.js').Goal} then
 * @property {string[]} mustSatisfy
 * @property {boolean} [suspended]
 * @property {boolean} [priorityBoost]
 */

/** @returns {BehaviorRule[]} */
export function createBehaviorRules() {
  return [
    {
      id: "protect_continuity_under_conflict",
      when: (ctx) =>
        (ctx.continuityState.conflicts?.length || 0) > 0 ||
        ctx.continuityState.globalRootValid === false ||
        ctx.continuityState.instabilityTrend === "rising",
      then: () => ({
        id: `goal:restore_stability:${Date.now()}`,
        domain: "continuity",
        description: "Restore global stability and resolve active conflicts",
        priority: "critical",
        constraints: [I.CONTINUITY_FIRST, I.NO_UNLOGGED_MUTATION, I.CONSTITUTIONAL_BINDING],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.CONTINUITY_FIRST, I.PRESERVE_LINEAGE_SOVEREIGNTY, I.NO_UNLOGGED_MUTATION],
    },

    {
      id: "repair_continuity_fabric",
      when: (ctx) =>
        (ctx.continuityState.sovereigntyViolations?.length || 0) > 0 ||
        (ctx.continuityState.brokenLineages?.length || 0) > 0,
      then: () => ({
        id: `goal:repair_fabric:${Date.now()}`,
        domain: "continuity",
        description: "Repair lineage chains and restore sovereignty",
        priority: "high",
        constraints: [I.CONTINUITY_FIRST, I.PRESERVE_LINEAGE_SOVEREIGNTY, I.NO_UNLOGGED_MUTATION],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.PRESERVE_LINEAGE_SOVEREIGNTY, I.BIDIRECTIONAL_COHERENCE],
    },

    {
      id: "fork_universe_on_structured_drift",
      when: (ctx) =>
        (ctx.continuityState.drift || 0) > 0.7 && ctx.continuityState.instabilityTrend !== "chaotic",
      then: () => ({
        id: `goal:fork_universe:${Date.now()}`,
        domain: "evolution",
        description: "Fork universe to preserve divergent trajectories",
        priority: "medium",
        constraints: [I.CONTINUITY_FIRST, I.BIDIRECTIONAL_COHERENCE, I.NO_SILENT_AUTHORITY_EXPANSION],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.BIDIRECTIONAL_COHERENCE, I.NO_SILENT_AUTHORITY_EXPANSION],
    },

    {
      id: "collapse_unstable_subsystem",
      when: (ctx) =>
        (ctx.continuityState.collapseCandidates?.length || 0) > 0 &&
        ctx.continuityState.instabilityTrend === "rising",
      then: () => ({
        id: `goal:collapse_subsystem:${Date.now()}`,
        domain: "stability",
        description: "Collapse unstable subsystem to restore continuity",
        priority: "high",
        constraints: [I.CONTINUITY_FIRST, I.NO_UNLOGGED_MUTATION, I.BIDIRECTIONAL_COHERENCE],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.CONTINUITY_FIRST, I.BIDIRECTIONAL_COHERENCE],
    },

    {
      id: "initiate_genesis_when_all_else_fails",
      when: (ctx) =>
        ctx.continuityState.instabilityTrend === "rising" &&
        (ctx.continuityState.drift || 0) > 0.8 &&
        ctx.continuityState.reconciliationExhausted === true &&
        ctx.continuityState.collapseExhausted === true,
      then: () => ({
        id: `goal:initiate_genesis:${Date.now()}`,
        domain: "evolution",
        description: "Initiate controlled genesis event to reset cosmological substrate",
        priority: "critical",
        constraints: [I.CONTINUITY_FIRST, I.CONSTITUTIONAL_BINDING, I.NO_SILENT_AUTHORITY_EXPANSION],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.CONSTITUTIONAL_BINDING, I.NO_SILENT_AUTHORITY_EXPANSION],
    },

    {
      id: "transition_epoch_on_boundary_signals",
      when: (ctx) =>
        (ctx.continuityState.epochSignals?.length || 0) > 0 &&
        ctx.continuityState.instabilityTrend === "rising",
      then: () => ({
        id: `goal:transition_epoch:${Date.now()}`,
        domain: "governance",
        description: "Transition to next epoch to preserve continuity",
        priority: "high",
        constraints: [I.CONTINUITY_FIRST, I.PRESERVE_LINEAGE_SOVEREIGNTY, I.CONSTITUTIONAL_BINDING],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.PRESERVE_LINEAGE_SOVEREIGNTY, I.CONTINUITY_FIRST],
    },

    {
      id: "preemptive_stabilization_from_prediction",
      when: (ctx) => (ctx.continuityState.predictedInstability?.level || 0) > 0.6,
      then: () => ({
        id: `goal:preemptive_stabilization:${Date.now()}`,
        domain: "continuity",
        description: "Preemptively stabilize predicted future instability",
        priority: "medium",
        constraints: [I.CONTINUITY_FIRST, I.NO_UNLOGGED_MUTATION, I.CONSTITUTIONAL_BINDING],
        createdAt: Date.now(),
      }),
      mustSatisfy: [I.CONTINUITY_FIRST, I.NO_UNLOGGED_MUTATION],
    },
  ];
}

/** Default shared rules instance */
export const behaviorRules = createBehaviorRules();
