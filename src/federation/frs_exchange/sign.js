/**
 * frs_exchange — envelope signing
 */

import crypto from "crypto";
import { envelopeDigest } from "./envelope.js";

const DEFAULT_KEY = "frs-dev-signing-key";

/**
 * @param {import('./envelope.js').ExchangeEnvelope} envelope
 * @param {string} [signingKey]
 * @returns {import('./envelope.js').ExchangeEnvelope}
 */
export function signEnvelope(envelope, signingKey = DEFAULT_KEY) {
  const digest = envelopeDigest(envelope);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(digest)
    .digest("hex");
  return { ...envelope, signature };
}

export function signWithNodeKey(envelope, nodeId) {
  return signEnvelope(envelope, `${DEFAULT_KEY}:${nodeId}`);
}
