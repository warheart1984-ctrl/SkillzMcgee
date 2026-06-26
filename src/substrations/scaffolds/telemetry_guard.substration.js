/** @type {import('../contract_types.js').SubstrationContract} */
import { traceability } from "./_helpers.js";

export const TELEMETRY_GUARD = {
  runtime: {
    id: "SUB.TELEMETRY_GUARD",
    inputs: ["telemetryStream", "mutationAttempt"],
    outputs: ["telemetryIntegrityResult"],
    dependencies: [],
    executionSemantics: "Ensures telemetry is read-only during cognitive runs.",
    failureDetection: "Write or mutation attempt against telemetry store.",
    evidenceProduced: ["telemetryIntegrityReceipt"],
  },
  governance: {
    id: "SUB.TELEMETRY_GUARD",
    governanceObjectiveId: "GOV.DATA.TELEMETRY_READ_ONLY",
    uniqueContribution: "Protects observational data from cognitive mutation.",
    admissionCriteria: "Telemetry mutation detected or attempted.",
    successMetrics: "Telemetry remains append-only at observation boundary.",
    retirementCriteria: "Telemetry immutability enforced at storage layer.",
    traceabilityLinks: traceability(
      "REQ-DATA-TEL-001",
      "ADR-013-TELEMETRY-GUARD",
      "CTS-DATA-001",
      "ledger/data/telemetry",
      "Shared telemetry model across nodes.",
    ),
    admissionStatus: "permanent",
  },
};
