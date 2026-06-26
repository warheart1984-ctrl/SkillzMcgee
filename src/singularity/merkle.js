import { sha256Hex } from "./sha256.js";
import { groupByLineage } from "./lineage.js";
import { hashReceiptPayload } from "./receiptHash.js";

/**
 * @param {string[]} hashes
 */
export function merkleRoot(hashes) {
  if (hashes.length === 0) return sha256Hex("empty-ledger");
  let layer = [...hashes];
  while (layer.length > 1) {
    const next = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] ?? left;
      next.push(sha256Hex(left + right));
    }
    layer = next;
  }
  return layer[0];
}

/**
 * AS-3 — Merkle roots for local chain, lineages, and full ledger.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function buildMerkleRoots(entries) {
  const hashes = entries.map((e) => e.receiptHash).filter(Boolean);
  const lineages = groupByLineage(entries);
  /** @type {Record<string, string>} */
  const lineageRoots = {};
  for (const [lineageId, chain] of lineages) {
    const chainHashes = chain.map((e) => e.receiptHash).filter(Boolean);
    lineageRoots[lineageId] = merkleRoot(chainHashes);
  }

  return {
    localRoot: merkleRoot(hashes.slice(-1)),
    lineageRoots,
    globalRoot: merkleRoot(hashes),
  };
}

/**
 * Verify hash chain integrity (parentHash links).
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function verifyHashChain(entries) {
  const byId = new Map(entries.map((e) => [e.id, e]));
  for (const entry of entries) {
    if (!entry.receiptHash) return false;
    if (entry.parentId) {
      const parent = byId.get(entry.parentId);
      if (!parent?.receiptHash) return false;
      if (entry.parentHash !== parent.receiptHash) return false;
    } else if (entry.parentHash != null) {
      return false;
    }
    if (hashReceiptPayload(entry) !== entry.receiptHash) return false;
  }
  return true;
}
