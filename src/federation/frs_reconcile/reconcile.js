/**
 * frs_reconcile — conflict detection and resolution (F5, R1-R4)
 */

import { computeGlobalRoot } from "../frs_continuity/continuity.js";

/**
 * @typedef {string} NodeId
 */

/**
 * @typedef {'merkle_mismatch' | 'lineage_divergence' | 'snapshot_inconsistency'} ConflictType
 */

/**
 * @typedef {'rollforward' | 'rollback' | 'merge' | 'quarantine'} ReconciliationStrategy
 */

/**
 * @param {import('../frs_continuity/continuity.js').GlobalContinuityState} state
 */
export function detectConflicts(state) {
  /** @type {any[]} */
  const conflicts = [];

  const rootsByNode = state.nodeRoots.map((r) => r.globalMerkleRoot);
  const uniqueRoots = new Set(rootsByNode);
  if (uniqueRoots.size > 1) {
    conflicts.push({
      conflictId: `conflict:merkle:${Date.now()}`,
      nodesInvolved: state.nodeRoots.map((r) => r.nodeId),
      type: "merkle_mismatch",
      details: { roots: state.nodeRoots.map((r) => ({ nodeId: r.nodeId, root: r.globalMerkleRoot })) },
    });
  }

  for (const [lineageId, entry] of Object.entries(state.federatedLineages)) {
    const origins = new Set([entry.originNode]);
    if (origins.size > 1) {
      conflicts.push({
        conflictId: `conflict:lineage:${lineageId}`,
        nodesInvolved: [entry.originNode, entry.currentNode],
        type: "lineage_divergence",
        details: { lineageId, entry },
      });
    }
  }

  const recomputed = computeGlobalRoot({ ...state, globalRoot: "" });
  if (state.globalRoot && recomputed !== state.globalRoot) {
    conflicts.push({
      conflictId: `conflict:snapshot:${Date.now()}`,
      nodesInvolved: state.nodeRoots.map((r) => r.nodeId),
      type: "snapshot_inconsistency",
      details: { expected: state.globalRoot, recomputed },
    });
  }

  return conflicts;
}

/**
 * @param {any} conflict
 * @returns {import('./reconcile.js').ReconciliationPlan}
 */
export function proposeReconciliation(conflict) {
  /** @type {ReconciliationStrategy} */
  let strategy = "merge";
  if (conflict.type === "merkle_mismatch") strategy = "quarantine";
  if (conflict.type === "lineage_divergence") strategy = "rollback";
  if (conflict.type === "snapshot_inconsistency") strategy = "rollforward";

  return {
    conflictId: conflict.conflictId,
    strategy,
    steps: [
      `Detect conflict type: ${conflict.type}`,
      `Apply strategy: ${strategy}`,
      `Nodes involved: ${conflict.nodesInvolved.join(", ")}`,
    ],
  };
}

/**
 * @param {import('../frs_continuity/continuity.js').GlobalContinuityState} state
 * @param {any} plan
 */
export function applyReconciliation(state, plan) {
  let resultingGlobalRoot = state.globalRoot;

  if (plan.strategy === "rollforward") {
    resultingGlobalRoot = computeGlobalRoot(state);
  }

  return {
    conflictId: plan.conflictId,
    resolvedAt: Date.now(),
    resultingGlobalRoot,
    notes: `Applied strategy ${plan.strategy}`,
  };
}

/**
 * @param {any} conflict
 * @param {any} plan
 * @param {any} final
 */
export function logReconciliation(conflict, plan, final) {
  return {
    type: "FinalizedStateReceipt",
    conflict,
    plan,
    final,
    timestamp: Date.now(),
  };
}

/**
 * CRK-1 constitutional veto hook (R4).
 * @param {any} plan
 * @param {string[]} allowedStrategies
 */
export function validateReconciliationPlan(plan, allowedStrategies = ["rollforward", "rollback", "merge", "quarantine"]) {
  return allowedStrategies.includes(plan.strategy);
}
