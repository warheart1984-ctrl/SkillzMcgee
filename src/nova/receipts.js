// Governance receipts for NovaSlice

let receipts = [];

export function createReceipt({ intent, output, lawsResult }) {
  const receipt = {
    id: `REC-NOVA-${Date.now()}`,
    timestamp: new Date().toISOString(),
    intent: {
      type: intent.type,
      confidence: intent.confidence
    },
    prompt: intent.prompt,
    output,
    laws: {
      allowed: lawsResult.allowed,
      violations: lawsResult.violations
    }
  };

  receipts.push(receipt);
  return receipt;
}

export function getReceipts() {
  return receipts;
}

export function clearReceipts() {
  receipts = [];
}
