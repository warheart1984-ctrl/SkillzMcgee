import { getReceipts } from "./receipts.js";
import { foldAbsoluteSingularity } from "../singularity/absoluteSingularity.js";

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} [receipts]
 */
export function runAll(receipts = getReceipts()) {
  const results = [];

  // Rule 1: ledger entries have required governed fields
  const malformed = receipts.filter(
    (r) =>
      !r.id ||
      !r.timestamp ||
      !r.laws ||
      typeof r.laws.allowed !== "boolean"
  );
  results.push({
    id: "CTS-NOVA-001",
    description: "Receipts have id, timestamp, and laws.allowed",
    passed: malformed.length === 0,
  });

  // Rule 2: no receipt with allowed=false and missing violations
  const badReceipts = receipts.filter(
    r => !r.laws.allowed && (!r.laws.violations || r.laws.violations.length === 0)
  );
  results.push({
    id: "CTS-NOVA-002",
    description: "Rejected intents must record violations",
    passed: badReceipts.length === 0
  });

  // Rule 3: Absolute Singularity K4 reconstructability
  const singularity = foldAbsoluteSingularity(receipts);
  results.push({
    id: "CTS-AS-001",
    description: "Absolute Singularity: slice state reconstructable from ledger (K4)",
    passed: singularity.k4.reconstructable,
  });

  results.push({
    id: "CTS-AS-003",
    description: "Receipt hash chain valid (SHA-256 + parentHash)",
    passed: singularity.k4.hashChainValid,
  });

  results.push({
    id: "CTS-AS-Ω",
    description: "AS-Ω fold produces merkle globalRoot and genesis operator",
    passed:
      Boolean(singularity.merkle?.globalRoot) &&
      singularity.genesisOperator?.id === "H-Ω",
  });

  return results;
}

/** @alias runAll */
export const runCTS = runAll;
