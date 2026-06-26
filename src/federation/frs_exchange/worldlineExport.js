/**
 * frs_exchange — worldline export (E3)
 */

import { hashReceipt, merkleRoot } from "../../singularity/merkle.js";

/**
 * @typedef {Object} WorldlinePayload
 * @property {string} lineageId
 * @property {any[]} receipts
 * @property {number} exportHeight
 * @property {{ merkleRoot: string, receiptHashes: string[] }} proof
 */

/**
 * @param {string} lineageId
 * @param {any[]} receipts
 * @param {number} exportHeight
 * @returns {WorldlinePayload}
 */
export function exportWorldline(lineageId, receipts, exportHeight) {
  const receiptHashes = receipts.map((r) => r.hash ?? hashReceipt(r));
  return {
    lineageId,
    receipts,
    exportHeight,
    proof: {
      merkleRoot: merkleRoot(receiptHashes),
      receiptHashes,
    },
  };
}

export function verifyWorldlinePayload(payload) {
  const recomputed = merkleRoot(payload.proof.receiptHashes);
  return recomputed === payload.proof.merkleRoot;
}
