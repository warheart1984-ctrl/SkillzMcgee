/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const CAPABILITY_GUARD = {
  runtime: {
    id: "SUB.CAPABILITY_GUARD",
    inputs: ["declaredCapabilities", "requestedAction"],
    outputs: ["capabilityScopeResult"],
    dependencies: ["SUB.IDENTITY_GUARD"],
    executionSemantics: "Verifies actions match declared capability scope for the authenticated role.",
    failureDetection: "Action outside capability scope or undeclared capability invocation.",
    evidenceProduced: ["capabilityScopeReceipt"],
  },
  governance: {
    id: "SUB.CAPABILITY_GUARD",
    governanceObjectiveId: "GOV.ID.CAPABILITY_SCOPE",
    uniqueContribution: "Prevents capability drift and out-of-scope execution.",
    admissionCriteria: "Repeated scope violations or ambiguous capability bindings.",
    successMetrics: "Zero undetected scope violations across governed runs.",
    retirementCriteria: "Capability enforcement fully subsumed by CRK-1 policy layer.",
    traceabilityLinks: traceability(
      "REQ-ID-SCOPE-001",
      "ADR-010-CAPABILITY-GUARD",
      "CTS-ID-002",
      "ledger/identity/capability",
      "Replicated with shared capability registry.",
    ),
    admissionStatus: "permanent",
  },
};
