/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const FAIL_CLOSED_GUARD = {
  runtime: {
    id: "SUB.FAIL_CLOSED_GUARD",
    inputs: ["invariantResults", "continuityState"],
    outputs: ["failClosedDecision"],
    dependencies: ["SUB.RECEIPT_ENFORCER"],
    executionSemantics: "Halts or degrades execution when invariant evaluation fails.",
    failureDetection: "Invariant failure without halt or logged degradation.",
    evidenceProduced: ["failClosedReceipt"],
  },
  governance: {
    id: "SUB.FAIL_CLOSED_GUARD",
    governanceObjectiveId: "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED",
    uniqueContribution: "Fail safe, not fail silent — invariant failures halt execution.",
    admissionCriteria: "Invariant failures that do not halt or log degradation.",
    successMetrics: "All invariant failures produce visible halt or degradation.",
    retirementCriteria: "Fail-closed semantics fully in federation tick pipeline.",
    traceabilityLinks: traceability(
      "REQ-GOV-FAILCLOSED-001",
      "ADR-019-FAIL-CLOSED",
      "CTS-GOV-001",
      "ledger/governance/fail_closed",
      "WOLF-1 aligned fail-safe substrate.",
    ),
    admissionStatus: "permanent",
  },
};
