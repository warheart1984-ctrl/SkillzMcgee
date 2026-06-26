import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  WOLF1_SCAFFOLD_CONTRACTS,
  IDENTITY_GUARD,
  RECEIPT_ENFORCER,
} from "../src/substrations/scaffolds/index.js";
import { GOVERNANCE_OBJECTIVE_IDS } from "../src/governance/objectives.js";
import {
  ALL_SUBSTRATION_CONTRACTS,
  SUBSTRATIONS_BY_ID,
  SUBSTRATIONS_BY_OBJECTIVE,
} from "../src/substrations/registry.js";

describe("WOLF-1 substration scaffolds", () => {
  it("defines 12 foundational SUB.* contract files", () => {
    assert.equal(WOLF1_SCAFFOLD_CONTRACTS.length, 12);
    for (const c of WOLF1_SCAFFOLD_CONTRACTS) {
      assert.ok(c.runtime.id.startsWith("SUB."), c.runtime.id);
      assert.equal(c.runtime.id, c.governance.id);
      assert.ok(c.governance.traceabilityLinks.requirementId.startsWith("REQ-"));
    }
  });

  it("maps one scaffold per WOLF-1 objective at minimum", () => {
    for (const oid of GOVERNANCE_OBJECTIVE_IDS) {
      const subs = SUBSTRATIONS_BY_OBJECTIVE[oid] ?? [];
      assert.ok(subs.length >= 1, `no substration for ${oid}`);
    }
  });

  it("includes identity_guard and receipt_enforcer examples", () => {
    assert.equal(IDENTITY_GUARD.governance.governanceObjectiveId, "GOV.ID.ROLE_BOUND");
    assert.equal(RECEIPT_ENFORCER.governance.governanceObjectiveId, "GOV.RUN.RECEIPT_REQUIRED");
    assert.ok(SUBSTRATIONS_BY_ID["SUB.IDENTITY_GUARD"]);
    assert.ok(SUBSTRATIONS_BY_ID["SUB.RECEIPT_ENFORCER"]);
  });

  it("registry totals 42 contracts (12 scaffolds + 30 federation)", () => {
    assert.equal(ALL_SUBSTRATION_CONTRACTS.length, 42);
    assert.equal(Object.keys(SUBSTRATIONS_BY_ID).length, 42);
  });
});
