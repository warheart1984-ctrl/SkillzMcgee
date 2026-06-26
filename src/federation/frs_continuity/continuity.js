/**
 * frs_continuity — Global Merkle + federated lineage (F4, C1-C4)
 */

import { hashPayload } from "../../singularity/merkle.js";

/**
 * @typedef {string} NodeId
 */

/**
 * @typedef {Object} MigrationReceipt
 * @property {string} migrationId
 * @property {any} export
 * @property {any} [import]
 * @property {number} timestamp
 */

/**
 * @typedef {Object} NodeRoot
 * @property {NodeId} nodeId
 * @property {string} globalMerkleRoot
 * @property {Record<string, string>} lineageRoots
 * @property {number} height
 * @property {number} timestamp
 */

/**
 * @typedef {Object} FederatedLineageEntry
 * @property {string} lineageId
 * @property {NodeId} originNode
 * @property {NodeId} currentNode
 * @property {MigrationReceipt[]} migrationHistory
 */

/**
 * @typedef {Object} GlobalContinuityState
 * @property {NodeRoot[]} nodeRoots
 * @property {string} globalRoot
 * @property {Record<string, FederatedLineageEntry>} federatedLineages
 */

export function emptyContinuityState() {
  return {
    nodeRoots: [],
    globalRoot: "",
    federatedLineages: {},
  };
}

/**
 * @param {GlobalContinuityState} state
 * @returns {string}
 */
export function computeGlobalRoot(state) {
  const sorted = state.nodeRoots
    .slice()
    .sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  return hashPayload(sorted);
}

/**
 * @param {GlobalContinuityState} state
 * @param {NodeRoot} root
 * @returns {GlobalContinuityState}
 */
export function updateNodeRoot(state, root) {
  const next = { ...state, nodeRoots: [...state.nodeRoots] };
  const idx = next.nodeRoots.findIndex((r) => r.nodeId === root.nodeId);
  if (idx >= 0) next.nodeRoots[idx] = root;
  else next.nodeRoots.push(root);
  next.globalRoot = computeGlobalRoot(next);
  return next;
}

/**
 * @param {GlobalContinuityState} state
 * @param {FederatedLineageEntry} entry
 * @returns {GlobalContinuityState}
 */
export function registerLineage(state, entry) {
  const federatedLineages = { ...state.federatedLineages };
  const existing = federatedLineages[entry.lineageId];

  if (!existing) {
    federatedLineages[entry.lineageId] = { ...entry, migrationHistory: [...entry.migrationHistory] };
  } else {
    if (existing.originNode !== entry.originNode) {
      throw new Error("C2: lineageId has conflicting originNode");
    }
    federatedLineages[entry.lineageId] = {
      ...existing,
      currentNode: entry.currentNode,
      migrationHistory: [...entry.migrationHistory],
    };
  }

  return { ...state, federatedLineages };
}

/**
 * @param {GlobalContinuityState} state
 * @param {string} lineageId
 */
export function getLineage(state, lineageId) {
  return state.federatedLineages[lineageId] ?? null;
}

/**
 * @param {GlobalContinuityState} state
 */
export function verifyGlobalContinuity(state) {
  const recomputed = computeGlobalRoot({ ...state, globalRoot: "" });
  if (recomputed !== state.globalRoot) return false;

  for (const entry of Object.values(state.federatedLineages)) {
    for (let i = 1; i < entry.migrationHistory.length; i++) {
      const prev = entry.migrationHistory[i - 1];
      const curr = entry.migrationHistory[i];
      if (curr.timestamp < prev.timestamp) return false;
    }
  }
  return true;
}

/**
 * Build NodeRoot from AS-Ω fold output.
 * @param {NodeId} nodeId
 * @param {any} asOmegaState
 * @param {number} height
 */
export function nodeRootFromAsOmega(nodeId, asOmegaState, height) {
  return {
    nodeId,
    globalMerkleRoot: asOmegaState.merkle?.globalRoot ?? "",
    lineageRoots: asOmegaState.merkle?.lineageRoots ?? {},
    height,
    timestamp: Date.now(),
  };
}
