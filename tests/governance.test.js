import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  GOVERNANCE_OBJECTIVES,
  GOVERNANCE_OBJECTIVE_IDS,
  GOV,
  WOLF1_INVARIANT_TO_OBJECTIVE,
  INVARIANT_TO_OBJECTIVE,
  isValidGovernanceObjective,
  getGovernanceObjective,
} from "../src/governance/objectives.js";
import {
  SUBSTRATIONS_BY_ID,
  SUBSTRATIONS_BY_OBJECTIVE,
  getSubstrationsForObjective,
  substrations,
} from "../src/substrations/registry.js";
import { evaluateSubstrationGovernance } from "../src/crk1/governance_evaluator.js";
import {
  makeSubstrationReceipt,
  collectEvidencePaths,
} from "../src/governance/receipts.js";
import {
  appendSubstrationReceipt,
  readSubstrationReceipts,
} from "../src/governance/continuity_ledger.js";
import { contractFor } from "../src/substrations/contracts.js";
import { createCosmicLedger } from "../src/cosmic/cosmic_ledger.js";
import { ORGANISM_INVARIANTS } from "../src/goals/invariants.js";

describe("WOLF-1 governance objectives table", () => {
  it("defines 12 canonical objectives mirroring WOLF-1 invariants", () => {
    assert.equal(GOVERNANCE_OBJECTIVE_IDS.length, 12);
    assert.equal(Object.keys(WOLF1_INVARIANT_TO_OBJECTIVE).length, 12);

    for (const id of GOVERNANCE_OBJECTIVE_IDS) {
      const obj = GOVERNANCE_OBJECTIVES[id];
      assert.ok(obj.name.length > 0, id);
      assert.ok(obj.description.length > 0, id);
      assert.ok(obj.axis, id);
      assert.equal(getGovernanceObjective(id)?.id ?? id, id);
    }
  });

  it("maps federation organism invariants to WOLF-1 objectives", () => {
    for (const inv of Object.values(ORGANISM_INVARIANTS)) {
      assert.ok(INVARIANT_TO_OBJECTIVE[inv], `missing mapping for ${inv}`);
      assert.ok(isValidGovernanceObjective(INVARIANT_TO_OBJECTIVE[inv]));
    }
  });
});

describe("Substration registry by objective", () => {
  it("indexes all 42 contracts by id and objective (12 scaffolds + 30 federation)", () => {
    assert.equal(Object.keys(SUBSTRATIONS_BY_ID).length, 42);
    const indexed = Object.values(SUBSTRATIONS_BY_OBJECTIVE).flat();
    assert.equal(indexed.length, 42);

    for (const s of substrations) {
      const c = SUBSTRATIONS_BY_ID[s.id];
      assert.equal(c.runtime.id, s.id);
      assert.ok(isValidGovernanceObjective(c.governance.governanceObjectiveId));
    }
  });

  it("getSubstrationsForObjective returns continuity cluster members", () => {
    const continuity = getSubstrationsForObjective(GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED);
    assert.ok(continuity.length >= 1);
    assert.ok(continuity.some((c) => c.runtime.id === "continuity_needs_engine"));
  });
});

describe("CRK-1 governance evaluator", () => {
  it("rejects objective mismatch", async () => {
    const contract = contractFor(substrations[0]);
    const result = await evaluateSubstrationGovernance({
      objectiveId: GOV.PLAN_PROPOSAL_ONLY,
      contract,
      evidencePaths: ["cosmicStream/test"],
    });
    assert.equal(result.approved, false);
    assert.equal(result.policyOutcome, "reject");
  });

  it("defers when no evidence paths", async () => {
    const contract = contractFor(substrations[0]);
    const result = await evaluateSubstrationGovernance({
      objectiveId: contract.governance.governanceObjectiveId,
      contract,
      evidencePaths: [],
    });
    assert.equal(result.approved, false);
    assert.equal(result.policyOutcome, "defer");
  });

  it("approves with evidence under matching objective", async () => {
    const contract = contractFor(substrations.find((s) => s.id === "continuity_needs_engine"));
    const paths = collectEvidencePaths(null, contract);
    const result = await evaluateSubstrationGovernance(
      {
        objectiveId: contract.governance.governanceObjectiveId,
        contract,
        evidencePaths: paths,
      },
      {},
    );
    assert.equal(result.approved, true);
    assert.equal(result.policyOutcome, "approve");
  });
});

describe("Substration receipts", () => {
  it("makeSubstrationReceipt captures governance traceability fields", () => {
    const contract = contractFor(substrations[0]);
    const receipt = makeSubstrationReceipt({
      contract,
      observation: { ok: true },
      need: { id: "n1" },
      task: { id: "t1", action: "test" },
      evidence: { paths: ["cosmicStream/CONTINUITY_NEED"], summary: "ok" },
      policyOutcome: "approve",
      governanceDecision: "Objective satisfied",
      stateTransitionSummary: "Applied",
    });

    assert.ok(receipt.id.startsWith(contract.runtime.id));
    assert.equal(receipt.governanceObjectiveId, contract.governance.governanceObjectiveId);
    assert.ok(receipt.evidencePaths.length > 0);
  });

  it("appendSubstrationReceipt writes to cosmic stream", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const contract = contractFor(substrations[0]);
    const receipt = makeSubstrationReceipt({
      contract,
      observation: null,
      need: null,
      task: null,
      evidence: { paths: collectEvidencePaths(null, contract) },
      policyOutcome: "approve",
      governanceDecision: "test",
      stateTransitionSummary: "logged",
    });

    await appendSubstrationReceipt(cosmic, receipt);
    const stored = readSubstrationReceipts(cosmic);
    assert.equal(stored.length, 1);
    assert.equal(stored[0].substrationId, receipt.substrationId);
  });
});
