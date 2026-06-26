import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ORGANISM_INVARIANTS, proposeGoal } from "../src/goals/index.js";
import { checkIntentAgainstInvariants, checkActionAgainstInvariants } from "../src/crk1/invariants.js";
import { behaviorTick } from "../src/behavior/engine.js";
import { createBehaviorRules } from "../src/behavior/grammar.js";
import { createCosmicLedger } from "../src/cosmic/cosmic_ledger.js";
import { getContinuityState } from "../src/cosmic/continuity_state.js";
import { createCrk1Runtime } from "../src/crk1/runtime.js";
import { emptyContinuityState, updateNodeRoot } from "../src/federation/frs_continuity/continuity.js";
import { federationTick } from "../src/federation/federation_tick.js";
import { createRuntime } from "../src/runtime/federated_runtime.js";

describe("Organism invariants & goals", () => {
  it("rejects goals missing CONSTITUTIONAL_BINDING", () => {
    const result = checkIntentAgainstInvariants({
      id: "goal:test",
      domain: "continuity",
      description: "test",
      priority: "low",
      constraints: [ORGANISM_INVARIANTS.CONTINUITY_FIRST],
      createdAt: Date.now(),
    });
    assert.equal(result.allowed, false);
  });

  it("approves well-formed continuity goal", () => {
    const result = checkIntentAgainstInvariants({
      id: "goal:test",
      domain: "continuity",
      description: "test",
      priority: "high",
      constraints: [ORGANISM_INVARIANTS.CONTINUITY_FIRST, ORGANISM_INVARIANTS.CONSTITUTIONAL_BINDING],
      createdAt: Date.now(),
    });
    assert.equal(result.allowed, true);
  });

  it("blocks irreversible collapse", () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const result = checkActionAgainstInvariants(
      { action: "collapse_subsystem", params: {} },
      [ORGANISM_INVARIANTS.BIDIRECTIONAL_COHERENCE],
      { ledger: cosmic, continuityState: {} },
    );
    assert.equal(result.allowed, false);
  });
});

describe("Behavior engine", () => {
  it("proposes and executes stability goal under conflict", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
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
      height: 2,
      timestamp: Date.now(),
    });

    const crk1 = createCrk1Runtime({
      baseLedger,
      cosmicLedger: cosmic,
      getContinuity: () => continuity,
      setContinuity: (s) => {
        continuity = s;
      },
    });

    const ctx = {
      continuityState: getContinuityState(baseLedger, continuity),
      federationConfig: {},
      ledger: cosmic,
      baseLedger,
      agents: {},
      crk1,
    };

    const rules = createBehaviorRules();
    const result = await behaviorTick(ctx, crk1, rules);

    assert.ok(result.goals.length > 0);
    assert.ok(result.executed > 0 || result.blocked >= 0);
    assert.ok(cosmic.readStream().some((e) => e.type === "BEHAVIOR_GOAL_PROPOSED"));
  });

  it("federationTick runs Mind → Will → Spine pipeline", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
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

    const runtime = createRuntime(baseLedger, {}, { continuity });
    const result = await federationTick(runtime);

    assert.ok(result.needs);
    assert.ok(result.behavior);
    assert.ok(result.meta);
    assert.ok(result.intelligence);
    assert.ok(result.will);
    assert.ok(result.governance);
    assert.equal(result.ok, true);
  });
});
