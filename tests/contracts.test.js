import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { substrations } from "../src/substrations/registry.js";
import {
  contractFor,
  buildContractRegistry,
  evaluateGraduation,
  evaluateAdmission,
  evaluateRetirement,
  isOrchestralOnly,
  GRADUATION_PRESSURE_THRESHOLD,
} from "../src/substrations/contracts.js";
import { GOV, isValidGovernanceObjective } from "../src/governance/objectives.js";
import {
  CONSTITUTIONAL_STAGES,
  logConstitutionalStage,
  evaluatePolicy,
} from "../src/substrations/constitutional_flow.js";
import { runSubstration, runSubstrationPlan } from "../src/substrations/lifecycle.js";
import { SubstrationEngine } from "../src/substrations/engine.js";
import { createCosmicLedger } from "../src/cosmic/cosmic_ledger.js";
import { getContinuityState } from "../src/cosmic/continuity_state.js";
import { emptyContinuityState } from "../src/federation/frs_continuity/continuity.js";

describe("Two-contract model", () => {
  it("defines runtime + governance contracts for all 30 substrations", () => {
    assert.equal(substrations.length, 30);
    const registry = buildContractRegistry(substrations);
    assert.equal(registry.size, 30);

    for (const s of substrations) {
      const c = contractFor(s);

      assert.ok(c.runtime, `${s.id} missing runtime contract`);
      assert.ok(c.governance, `${s.id} missing governance contract`);

      assert.equal(c.runtime.id, s.id);
      assert.equal(c.governance.id, s.id);

      assert.ok(c.runtime.inputs.length > 0, `${s.id} runtime.inputs`);
      assert.ok(c.runtime.outputs.length > 0, `${s.id} runtime.outputs`);
      assert.ok(c.runtime.executionSemantics, `${s.id} executionSemantics`);
      assert.ok(c.runtime.failureDetection, `${s.id} failureDetection`);
      assert.ok(c.runtime.evidenceProduced.length > 0, `${s.id} evidenceProduced`);

      assert.ok(isValidGovernanceObjective(c.governance.governanceObjectiveId), s.id);
      assert.ok(c.governance.uniqueContribution, `${s.id} uniqueContribution`);
      assert.ok(c.governance.admissionCriteria, `${s.id} admissionCriteria`);
      assert.ok(c.governance.successMetrics, `${s.id} successMetrics`);
      assert.ok(c.governance.retirementCriteria, `${s.id} retirementCriteria`);

      const links = c.governance.traceabilityLinks;
      assert.ok(links.requirementId.startsWith("REQ.SUB."));
      assert.ok(links.adrId.startsWith("ADR.SUB."));
      assert.ok(links.ctsId.startsWith("CTS.FRS1."));
      assert.ok(links.evidenceLedgerPath.includes(s.id));

      assert.ok(isOrchestralOnly(c), `${s.id} must not define inline law`);
    }
  });

  it("engine attaches two-contract faces to descriptors", () => {
    const engine = new SubstrationEngine(substrations);
    const listed = engine.list();
    assert.equal(listed.length, 30);
    assert.ok(listed.every((s) => s.governanceObjectiveId));
    assert.ok(listed.every((s) => s.admissionStatus));

    const c = engine.getContract("continuity_needs_engine");
    assert.ok(c?.runtime?.executionSemantics);
    assert.ok(c?.governance?.uniqueContribution);
    assert.equal(c?.governance?.governanceObjectiveId, GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED);
  });

  it("admission defers provisional substrations without objective pressure", () => {
    const provisional = contractFor(substrations.find((s) => s.id === "stability_attractor_fields"));
    assert.equal(provisional.governance.admissionStatus, "provisional");

    const deferred = evaluateAdmission(provisional, { needEmissionCount: 0, objectiveAtRisk: false });
    assert.equal(deferred.admitted, false);

    const admitted = evaluateAdmission(provisional, { objectiveAtRisk: true });
    assert.equal(admitted.admitted, true);
  });

  it("retirement when stable epochs with no needs (provisional only)", () => {
    const provisional = contractFor(substrations.find((s) => s.id === "stability_attractor_fields"));
    const retire = evaluateRetirement(provisional, { epochsStable: 5, needEmissionCount: 0 });
    assert.equal(retire.retire, true);

    const permanent = contractFor(substrations.find((s) => s.id === "continuity_needs_engine"));
    const keep = evaluateRetirement(permanent, { epochsStable: 10, needEmissionCount: 0 });
    assert.equal(keep.retire, false);
  });

  it("graduate only under architectural pressure (Bradley principle)", () => {
    const provisional = contractFor(substrations.find((s) => s.id === "stability_attractor_fields"));
    assert.equal(provisional.governance.admissionStatus, "provisional");

    const low = evaluateGraduation(provisional, { needEmissionCount: 1, epochsStable: 1 });
    assert.equal(low.graduate, false);

    const high = evaluateGraduation(
      {
        ...provisional,
        governance: {
          ...provisional.governance,
          architecturalPressureScore: GRADUATION_PRESSURE_THRESHOLD,
        },
      },
      { needEmissionCount: 5, epochsStable: 5, vetoRate: 0 },
    );
    assert.equal(high.graduate, true);
  });
});

describe("Constitutional flow", () => {
  it("defines full pipeline stages in order", () => {
    assert.deepEqual(CONSTITUTIONAL_STAGES, [
      "observation",
      "need",
      "task",
      "execution",
      "evidence",
      "policy_evaluation",
      "policy_outcome",
      "governance_decision",
      "state_transition",
    ]);
  });

  it("logs constitutional stages during plan", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const continuity = emptyContinuityState();
    continuity.globalRoot = "invalid";

    const ctx = {
      continuityState: getContinuityState(baseLedger, continuity),
      federationConfig: {},
      ledger: cosmic,
      baseLedger,
      agents: {},
    };

    const engine = new SubstrationEngine(substrations);
    await engine.plan(ctx);

    const stages = cosmic.readStream()
      .filter((e) => e.type === "CONSTITUTIONAL_FLOW")
      .map((e) => e.payload.stage);

    assert.ok(stages.includes("observation"));
    assert.ok(stages.includes("need"));
  });

  it("runSubstrationPlan returns governance-informed needs", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const continuity = emptyContinuityState();
    continuity.globalRoot = "invalid";

    const ctx = {
      continuityState: getContinuityState(baseLedger, continuity),
      federationConfig: {},
      ledger: cosmic,
      baseLedger,
      agents: {},
    };

    const descriptor = substrations.find((s) => s.id === "continuity_needs_engine");
    const contract = contractFor(descriptor);
    const result = await runSubstrationPlan(ctx, descriptor, contract);

    assert.equal(result.admitted, true);
    assert.ok(result.needs.length > 0);
    assert.ok(
      result.needs.every((n) => n.governanceObjectiveId === GOV.GOV_FAILED_INVARIANTS_FAIL_CLOSED),
    );
  });

  it("evaluatePolicy delegates to crk1 without inline law", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);

    const ctx = {
      ledger: cosmic,
      crk1: {
        checkActionAgainstInvariants: async () => ({ allowed: false, reason: "test_veto" }),
        checkAction: async () => true,
      },
    };

    const contract = contractFor(substrations[0]);
    const result = await evaluatePolicy(ctx, { action: "recompute_global_root", params: {} }, contract);
    assert.equal(result.allowed, false);
    assert.equal(result.hook, "crk1.checkActionAgainstInvariants");
  });

  it("logConstitutionalStage writes to cosmic stream", () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    logConstitutionalStage(cosmic, "policy_outcome", { allowed: true });
    assert.ok(cosmic.readStream().some((e) => e.payload.stage === "policy_outcome"));
  });
});
