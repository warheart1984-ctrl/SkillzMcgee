/**
 * frs_exchange — envelope verification (E1, E2)
 */

import crypto from "crypto";
import { envelopeDigest } from "./envelope.js";
import { verifyRemoteFingerprint } from "../frs_identity/verify.js";

const DEFAULT_KEY = "frs-dev-signing-key";

/**
 * @param {import('./envelope.js').ExchangeEnvelope} envelope
 * @param {string} [signingKey]
 * @returns {boolean}
 */
export function verifyEnvelopeSignature(envelope, signingKey = DEFAULT_KEY) {
  if (!envelope.signature) return false;
  const digest = envelopeDigest(envelope);
  const expected = crypto
    .createHmac("sha256", signingKey)
    .update(digest)
    .digest("hex");
  if (envelope.signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(envelope.signature, "hex"),
    Buffer.from(expected, "hex"),
  );
}

export function verifyEnvelopeSignatureForNode(envelope) {
  return verifyEnvelopeSignature(envelope, `${DEFAULT_KEY}:${envelope.senderId}`);
}

/**
 * Full envelope verification: signature + optional remote identity.
 * @param {import('./envelope.js').ExchangeEnvelope} envelope
 * @param {{ config?: any, environment?: any, fingerprint?: any }} [remoteIdentity]
 */
export function verifyEnvelope(envelope, remoteIdentity = null) {
  if (!verifyEnvelopeSignatureForNode(envelope)) return false;
  if (remoteIdentity?.fingerprint && remoteIdentity?.config && remoteIdentity?.environment) {
    if (!verifyRemoteFingerprint(remoteIdentity.fingerprint, remoteIdentity.config, remoteIdentity.environment)) {
      return false;
    }
    if (remoteIdentity.fingerprint.hash !== envelope.senderFingerprint) return false;
  }
  return true;
}

/**
 * @param {import('./envelope.js').ExchangeEnvelope} envelope
 * @param {string} reason
 */
export function createRejectionReceipt(envelope, reason) {
  return {
    type: "FederatedRejectionReceipt",
    senderId: envelope.senderId,
    payloadType: envelope.payloadType,
    reason,
    timestamp: Date.now(),
  };
}
