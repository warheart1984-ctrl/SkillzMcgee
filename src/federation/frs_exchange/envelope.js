/**
 * frs_exchange — universal exchange envelope (E1)
 */

import { hashPayload } from "../../singularity/merkle.js";

/**
 * @typedef {'fingerprint' | 'snapshot' | 'worldline' | 'genesis' | 'rejection'} PayloadType
 */

/**
 * @typedef {Object} ExchangeEnvelope
 * @property {string} senderId
 * @property {string} senderFingerprint
 * @property {number} timestamp
 * @property {PayloadType} payloadType
 * @property {any} payload
 * @property {string} [signature]
 */

/**
 * @param {string} senderId
 * @param {string} senderFingerprint
 * @param {PayloadType} payloadType
 * @param {any} payload
 * @returns {ExchangeEnvelope}
 */
export function createEnvelope(senderId, senderFingerprint, payloadType, payload) {
  return {
    senderId,
    senderFingerprint,
    timestamp: Date.now(),
    payloadType,
    payload,
  };
}

/**
 * @param {import('../frs_identity/index.js').NodeIdentity} identity
 * @param {PayloadType} payloadType
 * @param {any} payload
 */
export function createEnvelopeFromIdentity(identity, payloadType, payload) {
  return createEnvelope(
    identity.nodeId,
    identity.fingerprint.hash,
    payloadType,
    payload,
  );
}

/**
 * @param {ExchangeEnvelope} envelope
 * @returns {string}
 */
export function envelopeDigest(envelope) {
  return hashPayload({
    senderId: envelope.senderId,
    senderFingerprint: envelope.senderFingerprint,
    timestamp: envelope.timestamp,
    payloadType: envelope.payloadType,
    payload: envelope.payload,
  });
}
