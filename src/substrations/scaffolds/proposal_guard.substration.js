/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const PROPOSAL_GUARD = {
  runtime: {
    id: "SUB.PROPOSAL_GUARD",
    inputs: ["llmOutput", "commandPatterns"],
    outputs: ["proposalValidationResult"],
    dependencies: [],
    executionSemantics: "Ensures LLM outputs are proposals only, never direct commands.",
    failureDetection: "Command-like output or imperative execution semantics in LLM response.",
    evidenceProduced: ["proposalValidationReceipt"],
  },
  governance: {
    id: "SUB.PROPOSAL_GUARD",
    governanceObjectiveId: "GOV.PLAN.PROPOSAL_ONLY",
    uniqueContribution: "Maintains proposal-only authority for all planning outputs.",
    admissionCriteria: "LLM outputs interpreted or executed as commands.",
    successMetrics: "All LLM outputs routed through governance before execution.",
    retirementCriteria: "Proposal-only enforcement fully in CRK-1 intent layer.",
    traceabilityLinks: traceability(
      "REQ-PLAN-PROP-001",
      "ADR-014-PROPOSAL-GUARD",
      "CTS-PLAN-001",
      "ledger/authority/proposals",
      "Applies to all LLM-backed substrations.",
    ),
    admissionStatus: "permanent",
  },
};
