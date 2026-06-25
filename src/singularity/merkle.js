/**
 * AS-3 — Merkle receipt hashing + roots
 */

import crypto from "crypto";

function hashPayload(payload) {
  const data =
    typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function hashReceipt(receipt) {
  return hashPayload({
    slice: receipt.slice,
    actor: receipt.actor,
    input: receipt.input,
    output: receipt.output,
    timestamp: receipt.timestamp,
  });
}

export function merkleRoot(hashes) {
  if (hashes.length === 0) return null;
  let level = hashes.slice();
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = level[i + 1] || a;
      next.push(hashPayload(a + b));
    }
    level = next;
  }
  return level[0];
}

export { hashPayload };
