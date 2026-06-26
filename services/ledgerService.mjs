import { appendReceipt as appendStudioReceipt, getLedger } from "../nova-studio/server/runtime/studioRuntime.mjs";
import { loadCapabilities } from "./capabilitiesService.mjs";
import { stableHash } from "../substrate/executionEnvelope.mjs";

export async function appendReceipt(envelope) {
  return appendStudioReceipt({
    ...envelope,
    id: envelope.id,
    actor: envelope.operator,
    capability: envelope.capabilityId,
    slice: envelope.capabilityId,
    intent: {
      capabilityId: envelope.capabilityId,
      inputHash: envelope.inputHash,
    },
    output: {
      outputHash: envelope.outputHash,
      value: envelope.value,
    },
    phase: "complete",
    status: envelope.status,
    laws: {
      allowed: envelope.status === "ok",
      violations: envelope.invariantViolations ?? [],
    },
  });
}

export async function loadLedgerReceipts() {
  const capabilities = await loadCapabilities();
  return getLedger().map((receipt) => mapReceiptToEnvelope(receipt, capabilities));
}

export async function readLedgerText() {
  const receipts = await loadLedgerReceipts();
  return receipts.map((receipt) => JSON.stringify(receipt)).join("\n");
}

export function mapReceiptToEnvelope(receipt, capabilities = []) {
  if (receipt.operator && receipt.capabilityId && receipt.inputHash) {
    return {
      id: receipt.id,
      operator: receipt.operator,
      capabilityId: receipt.capabilityId,
      capabilitySignatureHash: receipt.capabilitySignatureHash,
      continuityCheckpoint: receipt.continuityCheckpoint,
      parentReceiptId: receipt.parentReceiptId,
      inputHash: receipt.inputHash,
      outputHash: receipt.outputHash,
      timestamp: receipt.timestamp,
      status: receipt.status,
      invariantViolations: receipt.invariantViolations ?? [],
    };
  }

  const capabilityId = receipt.capability ?? receipt.slice ?? "nova";
  const capability = capabilities.find((cap) => cap.id === capabilityId) ?? capabilities[0];
  return {
    id: receipt.id,
    operator: receipt.actor ?? "nova-studio",
    capabilityId,
    capabilitySignatureHash: stableHash({
      id: capability?.id ?? capabilityId,
      inputSchema: capability?.inputSchema ?? {},
      outputSchema: capability?.outputSchema ?? {},
    }),
    continuityCheckpoint: receipt.continuityCheckpoint ?? receipt.timestamp,
    parentReceiptId: receipt.parentReceiptId ?? receipt.parentId ?? undefined,
    inputHash: receipt.inputHash ?? stableHash(receipt.intent ?? {}),
    outputHash: receipt.outputHash ?? stableHash(receipt.output ?? {}),
    timestamp: receipt.timestamp,
    status: receipt.status === "ok" && receipt.laws?.allowed !== false ? "ok" : "error",
    invariantViolations: receipt.invariantViolations ?? receipt.laws?.violations ?? [],
  };
}
