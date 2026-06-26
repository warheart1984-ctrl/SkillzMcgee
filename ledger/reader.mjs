export function readReceipts(ledger = []) {
  return ledger.map((receipt) => ({ ...receipt }));
}

export function readProvenanceRoots(metrics) {
  return metrics?.merkleRoot ? [metrics.merkleRoot] : [];
}
