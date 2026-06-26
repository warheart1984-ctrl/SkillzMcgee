/**
 * FRS-1 — Federated Reality Stack orchestrator
 *
 * Node runs → AS-Ω fold → identity tag → continuity update → optional exchange
 */

import { foldSingularity } from "../singularity/absoluteSingularity.js";
import { bootNodeIdentity } from "./frs_identity/index.js";
import {
  createEnvelopeFromIdentity,
  createCosmosSnapshot,
  createSnapshotPayload,
  signWithNodeKey,
  sendEnvelope,
  receiveEnvelope,
} from "./frs_exchange/index.js";
import {
  emptyContinuityState,
  updateNodeRoot,
  nodeRootFromAsOmega,
  verifyGlobalContinuity,
} from "./frs_continuity/index.js";
import { detectConflicts, proposeReconciliation, applyReconciliation, logReconciliation } from "./frs_reconcile/index.js";

/**
 * Boot federated node: identity + continuity state.
 * @param {object} [options]
 * @param {string} [options.identityPath]
 */
export function bootFederatedNode(options = {}) {
  const { identity, rekeyReceipt } = bootNodeIdentity(options.identityPath);
  const continuity = emptyContinuityState();
  return { identity, rekeyReceipt, continuity };
}

/**
 * Run AS-Ω fold with federated metadata (L8 + L4 integration).
 * @param {any[]} ledger
 * @param {import('./frs_identity/index.js').NodeIdentity} identity
 * @param {import('./frs_continuity/continuity.js').GlobalContinuityState} continuity
 */
export function foldFederatedSingularity(ledger, identity, continuity) {
  const asOmega = foldSingularity(ledger, {
    meta: {
      nodeId: identity.nodeId,
      nodeFingerprint: identity.fingerprint.hash,
      frsVersion: "FRS-1.0",
    },
  });

  const nodeRoot = nodeRootFromAsOmega(identity.nodeId, asOmega, ledger.length);
  const updatedContinuity = updateNodeRoot(continuity, nodeRoot);

  return {
    asOmega,
    nodeRoot,
    continuity: updatedContinuity,
    globalContinuityValid: verifyGlobalContinuity(updatedContinuity),
  };
}

/**
 * Package and send AS-Ω snapshot to peer node.
 * @param {any} asOmega
 * @param {import('./frs_identity/index.js').NodeIdentity} identity
 * @param {number} ledgerHeight
 * @param {string} targetNodeId
 */
export async function publishCosmosSnapshot(asOmega, identity, ledgerHeight, targetNodeId) {
  const snapshot = createCosmosSnapshot(asOmega, identity, ledgerHeight);
  const envelope = createEnvelopeFromIdentity(
    identity,
    "snapshot",
    createSnapshotPayload(snapshot),
  );
  const signed = signWithNodeKey(envelope, identity.nodeId);
  await sendEnvelope(targetNodeId, signed);
  return { snapshot, envelope: signed };
}

/**
 * Receive and process federated envelope.
 * @param {import('./frs_exchange/envelope.js').ExchangeEnvelope} envelope
 * @param {string} localNodeId
 * @param {import('./frs_continuity/continuity.js').GlobalContinuityState} continuity
 */
export function ingestFederatedEnvelope(envelope, localNodeId, continuity) {
  const event = receiveEnvelope(envelope, localNodeId);
  if (!event.accepted) return { event, continuity };

  if (envelope.payloadType === "snapshot" && envelope.payload) {
    const nodeRoot = {
      nodeId: envelope.senderId,
      globalMerkleRoot: envelope.payload.globalMerkleRoot,
      lineageRoots: envelope.payload.lineageRoots ?? {},
      height: envelope.payload.ledgerHeight ?? 0,
      timestamp: Date.now(),
    };
    continuity = updateNodeRoot(continuity, nodeRoot);
  }

  const conflicts = detectConflicts(continuity);
  const reconciliations = conflicts.map((c) => {
    const plan = proposeReconciliation(c);
    const final = applyReconciliation(continuity, plan);
    return logReconciliation(c, plan, final);
  });

  return { event, continuity, conflicts, reconciliations };
}

export {
  bootNodeIdentity,
  foldSingularity,
  detectConflicts,
  verifyGlobalContinuity,
};
