/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const NUCLEAR_FAILSAFE_GUARD = {
  runtime: {
    id: "SUB.NUCLEAR_FAILSAFE_GUARD",
    inputs: ["governanceFloor", "powerReserve"],
    outputs: ["failsafeAdmissionResult"],
    dependencies: [],
    executionSemantics: "Guarantees governance floor power reserve is always maintained.",
    failureDetection: "Governance floor power reserve breached.",
    evidenceProduced: ["nuclearFailsafeReceipt"],
  },
  governance: {
    id: "SUB.NUCLEAR_FAILSAFE_GUARD",
    governanceObjectiveId: "GOV.PWR.NUCLEAR_FAILSAFE_MIN",
    uniqueContribution: "Protects minimum governance operability under power stress.",
    admissionCriteria: "Governance floor at risk during power degradation.",
    successMetrics: "Governance floor maintained across all power events.",
    retirementCriteria: "Failsafe minimum guaranteed by hardware interlock.",
    traceabilityLinks: traceability(
      "REQ-PWR-NUC-001",
      "ADR-017-NUCLEAR-FAILSAFE",
      "CTS-PWR-002",
      "ledger/power/nuclear",
      "Critical node-local enforcement.",
    ),
    admissionStatus: "permanent",
  },
};
