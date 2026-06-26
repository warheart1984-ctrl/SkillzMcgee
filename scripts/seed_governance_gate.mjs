#!/usr/bin/env node
/**
 * Seed minimal receipts for governance gate (objective + substration coverage).
 * Writes tests/fixtures/governance_gate_receipts.jsonl
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_SUBSTRATION_CONTRACTS } from "../src/substrations/registry.js";
import { GOVERNANCE_OBJECTIVE_IDS } from "../src/governance/objectives.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "tests", "fixtures", "governance_gate_receipts.jsonl");

const ts = new Date().toISOString();
const lines = [];

for (const oid of GOVERNANCE_OBJECTIVE_IDS) {
  const contract = ALL_SUBSTRATION_CONTRACTS.find(
    (c) => c.governance.governanceObjectiveId === oid,
  );
  const sid = contract?.runtime.id ?? "SUB.GATE_SEED";
  const ctsId = contract?.governance.traceabilityLinks?.ctsId ?? `CTS.GATE.${oid}`;
  lines.push(
    JSON.stringify({
      id: `gate-${oid}`,
      timestamp: ts,
      substrationId: sid,
      governanceObjectiveId: oid,
      policyOutcome: "approve",
      governanceDecision: "Governance gate seed receipt",
      stateTransitionSummary: "Seeded for traceability gate",
      evidencePaths: [contract?.governance.traceabilityLinks?.evidenceLedgerPath ?? `gate/${oid}`],
      ctsId,
    }),
  );
}

for (const contract of ALL_SUBSTRATION_CONTRACTS) {
  const { runtime, governance } = contract;
  lines.push(
    JSON.stringify({
      id: `gate-${runtime.id}`,
      timestamp: ts,
      substrationId: runtime.id,
      governanceObjectiveId: governance.governanceObjectiveId,
      policyOutcome: "approve",
      governanceDecision: "Fitness gate seed receipt",
      stateTransitionSummary: "Seeded for fitness gate",
      evidencePaths: [governance.traceabilityLinks.evidenceLedgerPath],
      ctsId: governance.traceabilityLinks.ctsId,
    }),
  );
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${lines.length} gate receipts to ${OUT}`);
