/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const SAFE_MODE_GUARD = {
  runtime: {
    id: "SUB.SAFE_MODE_GUARD",
    inputs: ["safeModeProfile", "proposedActions"],
    outputs: ["safeModeEnforcementResult"],
    dependencies: ["SUB.FAIL_CLOSED_GUARD"],
    executionSemantics: "Restricts actions when safe-mode profile is active.",
    failureDetection: "Disallowed action attempted under safe-mode profile.",
    evidenceProduced: ["safeModeReceipt"],
  },
  governance: {
    id: "SUB.SAFE_MODE_GUARD",
    governanceObjectiveId: "GOV.GOV.SAFE_MODE_PROFILE",
    uniqueContribution: "Enforces safe-mode action restrictions across the organism.",
    admissionCriteria: "Safe-mode active with unrestricted action attempts.",
    successMetrics: "Safe-mode violations blocked and logged.",
    retirementCriteria: "Safe-mode fully enforced by governance tick layer.",
    traceabilityLinks: traceability(
      "REQ-GOV-SAFEMODE-001",
      "ADR-020-SAFE-MODE",
      "CTS-GOV-002",
      "ledger/governance/safe_mode",
      "Shared safe-mode profile across federation.",
    ),
    admissionStatus: "permanent",
  },
};
