/**
 * frs_exchange — genesis broadcast (E4)
 */

/**
 * @typedef {Object} GenesisPayload
 * @property {string} genesisId
 * @property {string} preStateFingerprint
 * @property {string} [postStateFingerprint]
 * @property {string[]} participatingNodes
 * @property {string} signature
 */

/**
 * @param {string} genesisId
 * @param {string} preStateFingerprint
 * @param {string[]} participatingNodes
 * @param {string} nodeSignature
 */
export function broadcastGenesisSignature(genesisId, preStateFingerprint, participatingNodes, nodeSignature) {
  return {
    genesisId,
    preStateFingerprint,
    participatingNodes,
    signature: nodeSignature,
  };
}

export function createGenesisSignatureReceipt(payload, nodeId) {
  return {
    type: "GenesisSignatureReceipt",
    genesisId: payload.genesisId,
    nodeId,
    timestamp: Date.now(),
  };
}
