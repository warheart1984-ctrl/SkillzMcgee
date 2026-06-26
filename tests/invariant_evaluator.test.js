import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateInvariant,
  buildRunContext,
  WOLF1_INVARIANT_CODES,
} from "../src/crk1/invariant_evaluator.js";
import { GOV } from "../src/governance/objectives.js";
import { IDENTITY_GUARD, RECEIPT_ENFORCER } from "../src/substrations/scaffolds/index.js";

describe("WOLF-1 invariant evaluator", () => {
  it("rejects missing identity for GOV.ID.ROLE_BOUND", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.ID_ROLE_BOUND,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, {}),
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, WOLF1_INVARIANT_CODES.ID_ROLE_BOUND);
  });

  it("approves valid identity and role", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.ID_ROLE_BOUND,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, { identity: "node-1", role: "operator" }),
    });
    assert.equal(result.ok, true);
    assert.equal(result.code, WOLF1_INVARIANT_CODES.ID_ROLE_BOUND);
  });

  it("checks capability scope via role.allowedScopes", () => {
    const inScope = evaluateInvariant({
      objectiveId: GOV.ID_CAPABILITY_SCOPE,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext(
        {},
        {
          role: { allowedScopes: ["analyze", "plan"] },
          actionScope: "analyze",
        },
      ),
    });
    assert.equal(inScope.ok, true);

    const outOfScope = evaluateInvariant({
      objectiveId: GOV.ID_CAPABILITY_SCOPE,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext(
        {},
        {
          role: { allowedScopes: ["analyze"] },
          actionScope: "actuate",
        },
      ),
    });
    assert.equal(outOfScope.ok, false);
    assert.equal(outOfScope.code, WOLF1_INVARIANT_CODES.ID_CAPABILITY_SCOPE);
  });

  it("rejects missing receipt for GOV.RUN.RECEIPT_REQUIRED", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.RUN_RECEIPT_REQUIRED,
      contract: RECEIPT_ENFORCER,
      runContext: buildRunContext({}, {}),
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, WOLF1_INVARIANT_CODES.RUN_RECEIPT_REQUIRED);
  });

  it("approves when receipt present", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.RUN_RECEIPT_REQUIRED,
      contract: RECEIPT_ENFORCER,
      runContext: buildRunContext({}, { receipt: { id: "r1" } }),
    });
    assert.equal(result.ok, true);
  });

  it("rejects proposal-only violation", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.PLAN_PROPOSAL_ONLY,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, { containsCommands: true }),
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, WOLF1_INVARIANT_CODES.PLAN_PROPOSAL_ONLY);
  });

  it("rejects direct actuation", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.HW_NO_DIRECT_ACTUATION,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, { task: { action: "direct_actuate" } }),
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, WOLF1_INVARIANT_CODES.HW_NO_DIRECT_ACTUATION);
  });

  it("fails closed when invariant engine failed", () => {
    const result = evaluateInvariant({
      objectiveId: GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, { invariantEngineFailed: true }),
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, WOLF1_INVARIANT_CODES.GOV_FAIL_CLOSED);
  });

  it("requires safe-mode profile enforcement", () => {
    const fail = evaluateInvariant({
      objectiveId: GOV.GOV_SAFE_MODE_PROFILE,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, { safeModeProfileApplied: false }),
    });
    assert.equal(fail.ok, false);
    assert.equal(fail.code, WOLF1_INVARIANT_CODES.GOV_SAFE_MODE_PROFILE);

    const pass = evaluateInvariant({
      objectiveId: GOV.GOV_SAFE_MODE_PROFILE,
      contract: IDENTITY_GUARD,
      runContext: buildRunContext({}, { safeModeProfileApplied: true }),
    });
    assert.equal(pass.ok, true);
  });
});
