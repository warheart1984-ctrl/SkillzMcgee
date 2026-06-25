/**
 * AS-2 — parentId lineage chains
 */

export function attachLineage(receipt, lastReceipt) {
  const parentId = lastReceipt ? lastReceipt.id : null;
  const lineageId = lastReceipt ? lastReceipt.lineageId : receipt.id;
  const depth = lastReceipt ? lastReceipt.depth + 1 : 0;

  return {
    ...receipt,
    parentId,
    lineageId,
    depth,
  };
}

export function attachLineageChain(ledger) {
  let last = null;
  return ledger.map((receipt) => {
    const withId = { ...receipt, id: receipt.id ?? receipt.receipt_id };
    const linked = attachLineage(withId, last);
    last = linked;
    return linked;
  });
}

export function buildLineages(ledger) {
  const byLineage = new Map();
  for (const r of ledger) {
    const list = byLineage.get(r.lineageId) || [];
    list.push(r);
    byLineage.set(r.lineageId, list);
  }
  return byLineage;
}
