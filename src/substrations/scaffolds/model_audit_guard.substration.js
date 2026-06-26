/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const MODEL_AUDIT_GUARD = {
  runtime: {
    id: "SUB.MODEL_AUDIT_GUARD",
    inputs: ["modelChangeProposal", "signatureChain"],
    outputs: ["modelAuditResult"],
    dependencies: ["SUB.RECEIPT_ENFORCER"],
    executionSemantics: "Validates model/runtime changes are signed, logged, and replayable.",
    failureDetection: "Unsigned model change or missing audit trail.",
    evidenceProduced: ["modelAuditReceipt"],
  },
  governance: {
    id: "SUB.MODEL_AUDIT_GUARD",
    governanceObjectiveId: "GOV.MODEL.CHANGE_AUDITED",
    uniqueContribution: "Audits all model and runtime configuration changes.",
    admissionCriteria: "Undocumented or unsigned model change detected.",
    successMetrics: "100% model changes with signed audit receipts.",
    retirementCriteria: "Model changes fully gated by external release pipeline.",
    traceabilityLinks: traceability(
      "REQ-MODEL-AUDIT-001",
      "ADR-015-MODEL-AUDIT",
      "CTS-MODEL-001",
      "ledger/model/audit",
      "Audit chain replicated across federation.",
    ),
    admissionStatus: "permanent",
  },
};
