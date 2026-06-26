/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const SOLAR_POWER_GUARD = {
  runtime: {
    id: "SUB.SOLAR_POWER_GUARD",
    inputs: ["powerState", "solarThreshold"],
    outputs: ["powerAdmissionResult"],
    dependencies: [],
    executionSemantics: "Blocks cognitive runs when solar/storage minimums are not met.",
    failureDetection: "Cognitive run attempted below solar/storage threshold.",
    evidenceProduced: ["solarPowerReceipt"],
  },
  governance: {
    id: "SUB.SOLAR_POWER_GUARD",
    governanceObjectiveId: "GOV.PWR.SOLAR_PRIMARY",
    uniqueContribution: "Enforces solar-primary power policy for cognitive workloads.",
    admissionCriteria: "Cognitive runs during insufficient solar/storage conditions.",
    successMetrics: "No cognitive runs below configured solar threshold.",
    retirementCriteria: "Power gating handled by hardware power management layer.",
    traceabilityLinks: traceability(
      "REQ-PWR-SOLAR-001",
      "ADR-016-SOLAR-GUARD",
      "CTS-PWR-001",
      "ledger/power/solar",
      "Node-local power telemetry.",
    ),
    admissionStatus: "provisional",
  },
};
