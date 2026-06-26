/**
 * Law kernel — shape drift vs canonical capability output schema.
 */

import { getAllCapabilities } from "../../../substrate/capabilities-registry.mjs";

function expectedOutputKeys(capabilityId) {
  const cap = getAllCapabilities().find((c) => c.id === capabilityId);
  if (!cap?.outputSchema?.properties) return [];
  return Object.keys(cap.outputSchema.properties);
}

/**
 * @param {{
 *   capabilityId: string,
 *   output?: Record<string, unknown>,
 *   outputHash?: string,
 *   timestamp?: string,
 *   envelope?: { outputHash?: string; timestamp?: string },
 * }} receiptLike
 */
export function evaluateLawKernel(receiptLike) {
  const violations = [];
  const drift = [];

  const outputHash = receiptLike.outputHash ?? receiptLike.envelope?.outputHash;
  const timestamp = receiptLike.timestamp ?? receiptLike.envelope?.timestamp;

  if (!outputHash) violations.push("Missing output hash");
  if (!timestamp) violations.push("Missing timestamp");

  const expectedKeys = expectedOutputKeys(receiptLike.capabilityId);
  if (expectedKeys.length > 0) {
    const actualKeys = Object.keys(receiptLike.output ?? {});
    const missing = expectedKeys.filter((k) => !actualKeys.includes(k));
    const extra = actualKeys.filter((k) => !expectedKeys.includes(k));

    if (missing.length) drift.push({ type: "missingFields", fields: missing });
    if (extra.length) drift.push({ type: "extraFields", fields: extra });
  }

  return {
    ok: violations.length === 0 && drift.length === 0,
    violations,
    drift,
  };
}
