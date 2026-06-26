/**
 * frs_exchange — worldline import (F3, E3)
 */

import { verifyWorldlinePayload } from "./worldlineExport.js";

/**
 * @typedef {Object} MigrationReceipt
 * @property {string} migrationId
 * @property {any} export
 * @property {any} [import]
 * @property {number} timestamp
 */

/**
 * @param {import('./worldlineExport.js').WorldlinePayload} payload
 * @param {string} toNodeId
 * @returns {{ importResult: any, receipt: MigrationReceipt }}
 */
export function importWorldline(payload, toNodeId) {
  const valid = verifyWorldlinePayload(payload);

  const importResult = {
    lineageId: payload.lineageId,
    toNode: toNodeId,
    importHeight: payload.exportHeight,
    accepted: valid,
    reason: valid ? undefined : "Merkle proof mismatch",
  };

  const receipt = {
    migrationId: `migration:${payload.lineageId}:${Date.now()}`,
    export: payload,
    import: importResult,
    timestamp: Date.now(),
  };

  return { importResult, receipt };
}

/**
 * @param {MigrationReceipt} receipt
 */
export function createWorldlineImportReceipt(receipt) {
  return {
    type: "WorldlineImportReceipt",
    ...receipt,
  };
}

export function createWorldlineExportReceipt(payload, fromNodeId) {
  return {
    type: "WorldlineExportReceipt",
    fromNode: fromNodeId,
    lineageId: payload.lineageId,
    exportHeight: payload.exportHeight,
    merkleRoot: payload.proof.merkleRoot,
    timestamp: Date.now(),
  };
}
