/**
 * @param {string} req
 * @param {string} adr
 * @param {string} cts
 * @param {string} ledgerPath
 * @param {string} [replicationNote]
 * @returns {import('../contract_types.js').TraceabilityLinks}
 */
export function traceability(req, adr, cts, ledgerPath, replicationNote) {
  return {
    requirementId: req,
    adrId: adr,
    ctsId: cts,
    evidenceLedgerPath: ledgerPath,
    replicationNote,
  };
}
