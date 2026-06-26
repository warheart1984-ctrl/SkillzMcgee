/**
 * frs_exchange — snapshot packaging (F2)
 */

/**
 * @typedef {Object} CosmosSnapshot
 * @property {any} asOmegaState
 * @property {number} ledgerHeight
 * @property {Record<string, string>} lineageRoots
 * @property {string} globalMerkleRoot
 * @property {string} nodeId
 * @property {string} nodeFingerprint
 */

/**
 * @param {any} asOmegaState
 * @param {import('../frs_identity/index.js').NodeIdentity} identity
 * @param {number} ledgerHeight
 * @returns {CosmosSnapshot}
 */
export function createCosmosSnapshot(asOmegaState, identity, ledgerHeight) {
  return {
    asOmegaState,
    ledgerHeight,
    lineageRoots: asOmegaState.merkle?.lineageRoots ?? {},
    globalMerkleRoot: asOmegaState.merkle?.globalRoot ?? "",
    nodeId: identity.nodeId,
    nodeFingerprint: identity.fingerprint.hash,
  };
}

/**
 * Verify snapshot Merkle roots match AS-Ω output (F2).
 * @param {CosmosSnapshot} snapshot
 */
export function verifySnapshot(snapshot) {
  const state = snapshot.asOmegaState;
  if (!state?.merkle) return false;
  if (state.merkle.globalRoot !== snapshot.globalMerkleRoot) return false;
  return true;
}

/**
 * @param {CosmosSnapshot} snapshot
 */
export function createSnapshotPayload(snapshot) {
  return {
    asOmegaState: snapshot.asOmegaState,
    ledgerHeight: snapshot.ledgerHeight,
    lineageRoots: snapshot.lineageRoots,
    globalMerkleRoot: snapshot.globalMerkleRoot,
  };
}
