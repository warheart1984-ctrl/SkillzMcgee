import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createCosmicLedger } from "../src/cosmic/cosmic_ledger.js";
import { createCrk1Runtime } from "../src/crk1/runtime.js";
import { createBehaviorRules } from "../src/behavior/grammar.js";
import { executeContinuityAction } from "../src/substrations/actions.js";
import {
  buildTickContext,
  intelligenceTick,
  willTick,
  governanceTick,
  captureTickState,
  restoreTickState,
} from "../src/federation/layer_ticks.js";
import { federationTick } from "../src/federation/federation_tick.js";
import { createRuntime } from "../src/runtime/federated_runtime.js";
import { emptyContinuityState, updateNodeRoot } from "../src/federation/frs_continuity/continuity.js";

function conflictContinuity() {
  let continuity = emptyContinuityState();
  continuity = updateNodeRoot(continuity, {
    nodeId: "a",
    globalMerkleRoot: "r1",
    lineageRoots: {},
    height: 1,
    timestamp: Date.now(),
  });
  continuity = updateNodeRoot(continuity, {
    nodeId: "b",
    globalMerkleRoot: "r2",
    lineageRoots: {},
    height: 5,
    timestamp: Date.now(),
  });
  return continuity;
}

function makeRuntime() {
  const baseLedger = { entries: [], cosmicStream: [] };
  const cosmic = createCosmicLedger(baseLedger);
  let continuity = conflictContinuity();
  const crk1 = createCrk1Runtime({
    baseLedger,
    cosmicLedger: cosmic,
    getContinuity: () => continuity,
    setContinuity: (s) => {
      continuity = s;
    },
  });
  return {
    baseLedger,
    cosmic,
    getContinuity: () => continuity,
    runtime: {
      baseLedger,
      ledger: cosmic,
      continuity,
      getContinuity: () => continuity,
      setContinuity: (s) => {
        continuity = s;
      },
      getFederationConfig: () => ({}),
      agents: {},
      crk1,
      behaviorRules: createBehaviorRules(),
    },
  };
}

function throwingActEngine(planResult) {
  return {
    async plan() {
      return planResult ?? { needs: [], tasks: [{ action: "noop" }] };
    },
    async act() {
      throw new Error("substration act failed");
    },
  };
}

function streamTypes(cosmic) {
  return cosmic.readStream().map((e) => e.type);
}

describe("Layer tick fail-safe (WOLF-1)", () => {
  it("executeTask does not roll back prior task ledger entries when a later task throws", async () => {
    const { runtime, cosmic } = makeRuntime();
    const ctx = await buildTickContext(runtime);
    const tasks = [
      { id: "t1", action: "increase_stability_pressure", params: {} },
      { id: "t2", action: "increase_stability_pressure", params: {} },
    ];

    try {
      for (let i = 0; i < tasks.length; i++) {
        await executeContinuityAction(ctx, tasks[i]);
        if (i === 0) throw new Error("task 2 failed");
      }
    } catch {
      // behaviorTick propagates — no rollback
    }

    const executed = cosmic.readStream().filter((e) => e.type === "CONTINUITY_TASK_EXECUTED");
    assert.equal(executed.length, 1);
    assert.equal(executed[0].payload.task.id, "t1");
  });

  it("willTick logs WILL_TICK_ABORTED when act throws after behavior (standalone)", async () => {
    const { runtime, cosmic } = makeRuntime();
    const ctx = await buildTickContext(runtime);
    const plan = await intelligenceTick(ctx, throwingActEngine());

    await assert.rejects(() => willTick(ctx, runtime, plan, throwingActEngine(plan)));

    const types = streamTypes(cosmic);
    assert.ok(types.includes("WILL_TICK_ABORTED"));
    assert.ok(!types.includes("WILL_TICK"));
    assert.ok(types.includes("BEHAVIOR_GOAL_PROPOSED"));
  });

  it("governanceTick refuses recomputeGlobalRoot when Will did not complete", async () => {
    const { runtime, cosmic } = makeRuntime();
    const ctx = await buildTickContext(runtime);
    let recomputeCalls = 0;
    runtime.crk1.recomputeGlobalRoot = async () => {
      recomputeCalls += 1;
      return "should-not-run";
    };

    const governance = await governanceTick(ctx, runtime, {
      will: { status: "aborted", completedPhases: ["behavior"], failedPhase: "substration" },
    });

    assert.equal(governance.skipped, true);
    assert.equal(governance.globalRoot, null);
    assert.equal(recomputeCalls, 0);
    assert.ok(streamTypes(cosmic).includes("GOVERNANCE_TICK_SKIPPED"));
    assert.ok(!streamTypes(cosmic).includes("GOVERNANCE_TICK"));
  });

  it("federationTick abort restores pre-Will ledger and skips governance", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const runtime = createRuntime(baseLedger, {}, { continuity: conflictContinuity() });

    const { engine: modEngine } = await import("../src/federation/layer_ticks.js");
    const stubEngine = {
      plan: (ctx) => modEngine.plan(ctx),
      act: async () => {
        throw new Error("federation-level act failure");
      },
    };

    const result = await federationTick(runtime, { substrationEngine: stubEngine });

    assert.equal(result.ok, false);
    assert.equal(result.will.status, "aborted");
    assert.equal(result.governance, null);
    assert.equal(result.failedPhase, "substration");

    const types = streamTypes(runtime.ledger);
    assert.ok(types.includes("INTELLIGENCE_TICK"));
    assert.ok(types.includes("FEDERATION_TICK_ABORTED"));
    assert.ok(!types.includes("BEHAVIOR_GOAL_PROPOSED"));
    assert.ok(!types.includes("WILL_TICK_ABORTED"));
    assert.ok(!types.includes("GOVERNANCE_TICK"));
    assert.ok(!types.includes("GOVERNANCE_TICK_SKIPPED"));

    const baseLedger2 = { entries: [], cosmicStream: [] };
    const runtime2 = createRuntime(baseLedger2, {}, { continuity: conflictContinuity() });
    const ctx2 = await buildTickContext(runtime2);
    await intelligenceTick(ctx2, stubEngine);
    const intelOnlyTypes = captureTickState(runtime2).cosmicStream.map((e) => e.type);
    const restoredTypes = captureTickState(runtime).cosmicStream
      .filter((e) => e.type !== "FEDERATION_TICK_ABORTED")
      .map((e) => e.type);
    assert.deepEqual(restoredTypes, intelOnlyTypes);
  });

  it("federationTick runs governance only after Will completes", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const runtime = createRuntime(baseLedger, {}, { continuity: conflictContinuity() });
    const result = await federationTick(runtime);

    assert.equal(result.ok, true);
    assert.ok(result.governance);
    assert.equal(result.governance.skipped, false);
    assert.ok(streamTypes(runtime.ledger).includes("GOVERNANCE_TICK"));
  });
});
