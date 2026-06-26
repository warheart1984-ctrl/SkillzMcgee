export function computeFoldSummary(metrics, ledger) {
  if (ledger.length === 0) return [];
  const foldId = metrics.fingerprint ? `fold-${metrics.fingerprint.slice(0, 12)}` : "fold-pending";
  return [
    {
      fold_id: foldId,
      requirements: uniqueLedgerIds(ledger, "requirementId"),
      implementations: uniqueLedgerIds(ledger, "implementationId"),
      receipts: ledger.map((receipt) => receipt.id),
      provenance_roots: metrics.merkleRoot ? [metrics.merkleRoot] : [],
    },
  ];
}

export function computeFold(wave) {
  return {
    foldId: wave.fold_id,
    requirements: wave.requirements ?? [],
    implementations: wave.implementations ?? [],
    receipts: wave.receipts ?? [],
    provenanceRoots: wave.provenance_roots ?? [],
  };
}

function uniqueLedgerIds(ledger, key) {
  return [...new Set(ledger.map((receipt) => receipt[key]).filter(Boolean).map(String))];
}
