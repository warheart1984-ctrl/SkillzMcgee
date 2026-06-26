/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const ACTUATION_GUARD = {
  runtime: {
    id: "SUB.ACTUATION_GUARD",
    inputs: ["proposedAction", "actuatorRegistry"],
    outputs: ["actuationBlockResult"],
    dependencies: [],
    executionSemantics: "Blocks cognitive runs from issuing direct actuator commands.",
    failureDetection: "Actuator command detected in cognitive output or task envelope.",
    evidenceProduced: ["actuationBlockReceipt"],
  },
  governance: {
    id: "SUB.ACTUATION_GUARD",
    governanceObjectiveId: "GOV.HW.NO_DIRECT_ACTUATION",
    uniqueContribution: "Separates cognition from hardware actuation.",
    admissionCriteria: "Any direct actuation attempt from cognitive layer.",
    successMetrics: "No actuator commands issued by cognitive substrations.",
    retirementCriteria: "Hardware actuation fully isolated in dedicated control plane.",
    traceabilityLinks: traceability(
      "REQ-HW-ACT-001",
      "ADR-012-ACTUATION-GUARD",
      "CTS-HW-001",
      "ledger/safety/actuation",
      "Enforced at all federation nodes.",
    ),
    admissionStatus: "permanent",
  },
};
