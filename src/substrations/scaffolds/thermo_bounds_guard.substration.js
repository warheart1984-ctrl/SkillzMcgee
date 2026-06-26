/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const THERMO_BOUNDS_GUARD = {
  runtime: {
    id: "SUB.THERMO_BOUNDS_GUARD",
    inputs: ["thermalSpine", "thermoLimits"],
    outputs: ["thermoBoundsResult"],
    dependencies: [],
    executionSemantics: "Ensures thermal spine remains within configured bounds during runs.",
    failureDetection: "Thermal spine out of bounds or unmonitored.",
    evidenceProduced: ["thermoBoundsReceipt"],
  },
  governance: {
    id: "SUB.THERMO_BOUNDS_GUARD",
    governanceObjectiveId: "GOV.PWR.THERMO_BOUNDS",
    uniqueContribution: "Thermal governance for cognitive and federation workloads.",
    admissionCriteria: "Thermal excursions during cognitive or federation ticks.",
    successMetrics: "Thermal spine within bounds for all governed runs.",
    retirementCriteria: "Thermal limits enforced by hardware thermal management.",
    traceabilityLinks: traceability(
      "REQ-PWR-THERMO-001",
      "ADR-018-THERMO-BOUNDS",
      "CTS-PWR-003",
      "ledger/power/thermo",
      "Node-local thermal telemetry.",
    ),
    admissionStatus: "provisional",
  },
};
