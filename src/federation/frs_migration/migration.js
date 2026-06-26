/**
 * frs_migration — cross-node worldline movement (F3, M1-M4)
 */

import { merkleRoot, hashReceipt } from "../../singularity/merkle.js";

/**
 * @typedef {string} NodeId
 */

/**
 * @typedef {Object} Receipt
 * @property {string} id
 * @property {string} [hash]
 */

/**
 * @typedef {Object} WorldlineExport
 * @property {string} lineageId
 * @property {NodeId} fromNode
 * @property {NodeId} toNode
 * @property {Receipt[]} receipts
 * @property {number} exportHeight
 * @property {{ merkleRoot: string, receiptHashes: string[] }} proof
 */

/**
 * @typedef {Object} WorldlineImport
 * @property {string} lineageId
 * @property {NodeId} fromNode
 * @property {NodeId} toNode
 * @property {number} importHeight
 * @property {boolean} accepted
 * @property {string} [reason]
 */

/**
 * @typedef {Object} MigrationReceipt
 * @property {string} migrationId
 * @property {WorldlineExport} export
 * @property {WorldlineImport} [import]
 * @property {number} timestamp
 */

/**
 * @param {string} lineageId
 * @param {NodeId} fromNode
 * @param {NodeId} toNode
 * @param {Receipt[]} receipts
 * @param {number} exportHeight
 * @returns {WorldlineExport}
 */
export function prepareWorldlineExport(lineageId, fromNode, toNode, receipts, exportHeight) {
  const receiptHashes = receipts.map((r) => r.hash ?? hashReceipt(r));
  return {
    lineageId,
    fromNode,
    toNode,
    receipts,
    exportHeight,
    proof: {
      merkleRoot: merkleRoot(receiptHashes),
      receiptHashes,
    },
  };
}

/**
 * @param {WorldlineExport} exportPayload
 */
export function verifyWorldlineExport(exportPayload) {
  const recomputed = merkleRoot(exportPayload.proof.receiptHashes);
  return recomputed === exportPayload.proof.merkleRoot;
}

/**
 * @param {WorldlineExport} exportPayload
 * @param {NodeId} toNode
 * @param {number} importHeight
 * @returns {WorldlineImport}
 */
export function acceptWorldlineImport(exportPayload, toNode, importHeight) {
  const valid = verifyWorldlineExport(exportPayload);
  if (!valid) {
    return {
      lineageId: exportPayload.lineageId,
      fromNode: exportPayload.fromNode,
      toNode,
      importHeight,
      accepted: false,
      reason: "Merkle proof mismatch",
    };
  }
  return {
    lineageId: exportPayload.lineageId,
    fromNode: exportPayload.fromNode,
    toNode,
    importHeight,
    accepted: true,
  };
}

/**
 * @param {WorldlineExport} exportPayload
 * @param {WorldlineImport} [importPayload]
 * @returns {MigrationReceipt}
 */
export function recordMigration(exportPayload, importPayload) {
  return {
    migrationId: `migration:${exportPayload.lineageId}:${Date.now()}`,
    export: exportPayload,
    import: importPayload,
    timestamp: Date.now(),
  };
}
