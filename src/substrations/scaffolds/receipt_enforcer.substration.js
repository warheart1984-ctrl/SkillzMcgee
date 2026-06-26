/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const RECEIPT_ENFORCER = {
  runtime: {
    id: "SUB.RECEIPT_ENFORCER",
    inputs: ["runContext", "receiptCandidate"],
    outputs: ["validatedReceipt"],
    dependencies: [],
    executionSemantics:
      "Ensures every run emits a valid receipt and appends it to continuity ledger.",
    failureDetection: "Missing receipt, invalid schema, or append failure.",
    evidenceProduced: ["receiptAppendRecord"],
  },
  governance: {
    id: "SUB.RECEIPT_ENFORCER",
    governanceObjectiveId: "GOV.RUN.RECEIPT_REQUIRED",
    uniqueContribution: "Guarantees receipt emission and persistence for all runs.",
    admissionCriteria: "Evidence of runs without receipts or broken replay.",
    successMetrics: "100% receipt coverage and successful replay.",
    retirementCriteria: "Receipt enforcement fully handled by core runtime.",
    traceabilityLinks: traceability(
      "REQ-RUN-RECEIPT-001",
      "ADR-011-RECEIPT-ENFORCER",
      "CTS-RUN-001",
      "ledger/receipts",
      "Shared across all governed runtimes.",
    ),
    admissionStatus: "permanent",
  },
};
