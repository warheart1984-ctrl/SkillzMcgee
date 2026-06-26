/**
 * frs_genesis — multi-cosmos resets (F6, G1-G4)
 */

import crypto from "crypto";
import { hashPayload } from "../../singularity/merkle.js";

/**
 * @typedef {string} NodeId
 */

/**
 * @typedef {Object} GenesisEvent
 * @property {string} genesisId
 * @property {number} epoch
 * @property {NodeId} initiatedBy
 * @property {NodeId[]} participatingNodes
 * @property {Record<NodeId, string>} preStateFingerprints
 * @property {Record<NodeId, string>} [postStateFingerprints]
 * @property {boolean} committed
 */

/**
 * @typedef {Object} GenesisSignature
 * @property {string} genesisId
 * @property {NodeId} nodeId
 * @property {string} signature
 * @property {number} timestamp
 */

/**
 * @typedef {Object} GenesisTopology
 * @property {string} genesisId
 * @property {NodeId[]} nodes
 * @property {number} quorum
 */

function signGenesisId(genesisId, nodeId) {
  return crypto.createHmac("sha256", `genesis:${nodeId}`).update(genesisId).digest("hex");
}

/**
 * @param {NodeId[]} nodes
 * @param {NodeId} initiatedBy
 * @param {number} epoch
 * @param {Record<NodeId, string>} preStateFingerprints
 */
export function proposeGenesis(nodes, initiatedBy, epoch, preStateFingerprints) {
  const genesisId = hashPayload({ epoch, nodes, pre: preStateFingerprints, ts: Date.now() });
  return {
    genesisId,
    epoch,
    initiatedBy,
    participatingNodes: nodes,
    preStateFingerprints,
    committed: false,
  };
}

/**
 * @param {string} genesisId
 * @param {NodeId} nodeId
 */
export function signGenesis(genesisId, nodeId) {
  return {
    genesisId,
    nodeId,
    signature: signGenesisId(genesisId, nodeId),
    timestamp: Date.now(),
  };
}

/**
 * @param {GenesisSignature[]} signatures
 */
export function collectGenesisSignatures(signatures) {
  /** @type {Record<NodeId, GenesisSignature>} */
  const map = {};
  for (const sig of signatures) {
    map[sig.nodeId] = sig;
  }
  return map;
}

/**
 * @param {GenesisEvent} event
 * @param {GenesisSignature[]} signatures
 * @param {GenesisTopology} topology
 * @param {Record<NodeId, string>} postStateFingerprints
 */
export function commitGenesis(event, signatures, topology, postStateFingerprints) {
  const sigMap = collectGenesisSignatures(signatures);
  const signedNodes = Object.keys(sigMap);

  const quorumMet =
    signedNodes.length >= topology.quorum &&
    topology.nodes.every((n) => signedNodes.includes(n));

  if (!quorumMet) {
    throw new Error("G1: Genesis quorum not met");
  }

  return {
    ...event,
    postStateFingerprints,
    committed: true,
  };
}

/**
 * @param {GenesisEvent} event
 * @param {GenesisSignature[]} signatures
 * @param {GenesisTopology} topology
 */
export function verifyGenesis(event, signatures, topology) {
  if (!event.committed) return false;

  const sigMap = collectGenesisSignatures(signatures);
  const signedNodes = Object.keys(sigMap);

  const quorumMet =
    signedNodes.length >= topology.quorum &&
    topology.nodes.every((n) => signedNodes.includes(n));

  if (!quorumMet) return false;

  for (const sig of signatures) {
    if (signGenesisId(sig.genesisId, sig.nodeId) !== sig.signature) return false;
  }

  return true;
}

export function createGenesisTopology(genesisId, nodes, quorum = nodes.length) {
  return { genesisId, nodes, quorum };
}
