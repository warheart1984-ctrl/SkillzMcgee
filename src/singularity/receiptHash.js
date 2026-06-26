import { sha256Hex } from "./sha256.js";

/**
 * Canonical JSON for hash-stable receipt payloads.
 * @param {unknown} value
 */
export function canonicalJson(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => canonicalJson(v)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(",")}}`;
}

/**
 * AS-3 — SHA-256 hash of governed receipt payload (excludes hash fields).
 * @param {import("../governance/types.js").GovernedReceipt} receipt
 */
export function hashReceiptPayload(receipt) {
  const payload = {
    id: receipt.id,
    timestamp: receipt.timestamp,
    actor: receipt.actor,
    slice: receipt.slice,
    intent: receipt.intent,
    output: receipt.output,
    status: receipt.status,
    laws: receipt.laws,
    parentId: receipt.parentId ?? null,
    lineageId: receipt.lineageId ?? null,
    depth: receipt.depth ?? 0,
  };
  return sha256Hex(canonicalJson(payload));
}

/**
 * Attach receiptHash and parentHash to a receipt.
 * @param {import("../governance/types.js").GovernedReceipt} receipt
 * @param {Map<string, import("../governance/types.js").GovernedReceipt>} byId
 */
export function attachReceiptHash(receipt, byId) {
  const parentHash =
    receipt.parentId && byId.get(receipt.parentId)?.receiptHash
      ? byId.get(receipt.parentId).receiptHash
      : null;
  const receiptHash = hashReceiptPayload(receipt);
  return { ...receipt, receiptHash, parentHash };
}

/**
 * Batch enrich lineage + hashes in ledger order.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function enrichReceiptChain(entries) {
  const withLineage = enrichLineageOrdered(entries);
  const byId = new Map();
  /** @type {import("../governance/types.js").GovernedReceipt[]} */
  const result = [];
  for (const entry of withLineage) {
    const hashed = attachReceiptHash(entry, byId);
    result.push(hashed);
    byId.set(hashed.id, hashed);
  }
  return result;
}

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
function enrichLineageOrdered(entries) {
  const sorted = [...entries].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );
  const byId = new Map();
  /** @type {import("../governance/types.js").GovernedReceipt[]} */
  const out = [];
  for (const entry of sorted) {
    const parentId =
      entry.parentId ?? (out.length > 0 ? out.at(-1).id : undefined);
    const base = { ...entry, parentId };
    const parent = parentId ? byId.get(parentId) : null;
    const lineageId = parent ? (parent.lineageId ?? parent.id) : base.id;
    const depth = parent ? (parent.depth ?? 0) + 1 : 0;
    const next = { ...base, lineageId, depth };
    out.push(next);
    byId.set(next.id, next);
  }
  return out;
}

/**
 * Prepare a new receipt for append (lineage + hash).
 * @param {import("../governance/types.js").GovernedReceipt} draft
 * @param {import("../governance/types.js").GovernedReceipt[]} existing
 */
export function prepareReceiptForAppend(draft, existing) {
  const chain = enrichReceiptChain([...existing, draft]);
  return chain.at(-1);
}
