/**
 * frs_exchange — in-memory send/receive bus (stub transport)
 */

import { verifyEnvelope, createRejectionReceipt } from "./verify.js";
import { signWithNodeKey } from "./sign.js";

/** @type {Map<string, import('./envelope.js').ExchangeEnvelope[]>} */
const inbox = new Map();

/** @type {import('./envelope.js').ExchangeEnvelope[]} */
const outbox = [];

/**
 * @param {string} targetNodeId
 * @param {import('./envelope.js').ExchangeEnvelope} envelope
 */
export async function sendEnvelope(targetNodeId, envelope) {
  const signed = envelope.signature ? envelope : signWithNodeKey(envelope, envelope.senderId);
  if (!inbox.has(targetNodeId)) inbox.set(targetNodeId, []);
  inbox.get(targetNodeId).push(signed);
  outbox.push(signed);
}

/**
 * @param {import('./envelope.js').ExchangeEnvelope} envelope
 * @param {string} localNodeId
 */
export function receiveEnvelope(envelope, localNodeId) {
  if (!verifyEnvelope(envelope)) {
    return {
      type: "FederatedEvent",
      accepted: false,
      rejection: createRejectionReceipt(envelope, "Envelope verification failed"),
    };
  }

  return {
    type: "FederatedEvent",
    accepted: true,
    payloadType: envelope.payloadType,
    payload: envelope.payload,
    senderId: envelope.senderId,
    receivedBy: localNodeId,
    timestamp: Date.now(),
  };
}

export function drainInbox(nodeId) {
  const messages = inbox.get(nodeId) ?? [];
  inbox.set(nodeId, []);
  return messages;
}

export function getOutbox() {
  return [...outbox];
}

export function clearBus() {
  inbox.clear();
  outbox.length = 0;
}
