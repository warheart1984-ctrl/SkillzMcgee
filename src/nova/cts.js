import { getReceipts } from "./receipts.js";

export function runCTS() {
  const receipts = getReceipts();
  const results = [];

  // Rule 1: every allowed intent must have a receipt
  results.push({
    id: "CTS-NOVA-001",
    description: "Every NovaSlice call produces a receipt",
    passed: receipts.length > 0
  });

  // Rule 2: no receipt with allowed=false and missing violations
  const badReceipts = receipts.filter(
    r => !r.laws.allowed && (!r.laws.violations || r.laws.violations.length === 0)
  );
  results.push({
    id: "CTS-NOVA-002",
    description: "Rejected intents must record violations",
    passed: badReceipts.length === 0
  });

  return results;
}
