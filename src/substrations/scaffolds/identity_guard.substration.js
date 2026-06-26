/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const IDENTITY_GUARD = {
  runtime: {
    id: "SUB.IDENTITY_GUARD",
    inputs: ["requestIdentity", "roleBindings"],
    outputs: ["identityValidationResult"],
    dependencies: [],
    executionSemantics:
      "Validates that every request carries a valid identity and role binding.",
    failureDetection: "Missing identity, invalid role, or mismatch with capability scope.",
    evidenceProduced: ["identityValidationReceipt"],
  },
  governance: {
    id: "SUB.IDENTITY_GUARD",
    governanceObjectiveId: "GOV.ID.ROLE_BOUND",
    uniqueContribution: "Enforces identity and role binding before any cognitive run.",
    admissionCriteria: "Repeated identity/role confusion or unsafe coupling detected.",
    successMetrics: "Reduction in identity-related faults and rejected runs.",
    retirementCriteria: "Identity validation fully covered by upstream CRK-1 layer.",
    traceabilityLinks: traceability(
      "REQ-ID-BOUND-001",
      "ADR-010-IDENTITY-GUARD",
      "CTS-ID-001",
      "ledger/identity/guard",
      "Can be replicated across nodes with shared identity model.",
    ),
    admissionStatus: "permanent",
  },
};
