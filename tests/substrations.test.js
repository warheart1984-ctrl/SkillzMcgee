import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SubstrationEngine } from "../src/substrations/engine.js";
import { substrations } from "../src/substrations/registry.js";
import { createCosmicLedger } from "../src/cosmic/cosmic_ledger.js";
import { getContinuityState } from "../src/cosmic/continuity_state.js";
import { cosmicTimelineView } from "../src/cosmic/cosmic_timeline.js";
import { createRuntime } from "../src/runtime/federated_runtime.js";
import { federationTick } from "../src/federation/federation_tick.js";
import { emptyContinuityState, updateNodeRoot } from "../src/federation/frs_continuity/continuity.js";

describe("SubstrationEngine", () => {
  it("registers all 30 substrations", () => {
    assert.equal(substrations.length, 30);
    const clusters = new Set(substrations.map((s) => s.cluster));
    assert.equal(clusters.size, 5);
  });

  it("derives needs when global root invalid", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const continuity = emptyContinuityState();
    continuity.globalRoot = "invalid";

    const ctx = {
      continuityState: getContinuityState(baseLedger, continuity),
      federationConfig: {},
      ledger: cosmic,
      baseLedger,
      agents: { spawn: async () => {} },
    };

    const engine = new SubstrationEngine(substrations);
    const result = await engine.tick(ctx);

    assert.ok(result.needs.some((n) => n.type === "recompute_global_root"));
    assert.ok(cosmic.readStream().length > 0);
  });

  it("federationTick runs via runtime", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    let continuity = emptyContinuityState();
    continuity = updateNodeRoot(continuity, {
      nodeId: "node-a",
      globalMerkleRoot: "root-a",
      lineageRoots: {},
      height: 10,
      timestamp: Date.now(),
    });
    continuity = updateNodeRoot(continuity, {
      nodeId: "node-b",
      globalMerkleRoot: "root-b",
      lineageRoots: {},
      height: 20,
      timestamp: Date.now(),
    });

    const runtime = createRuntime(baseLedger, { spawn: async () => {} }, { continuity });
    const result = await federationTick(runtime);

    assert.ok(result.needs.length > 0);
    assert.ok(result.needs.some((n) => n.type === "run_reconciliation"));
  });

  it("cosmic timeline renders ledger events", async () => {
    const baseLedger = { entries: [], cosmicStream: [] };
    const runtime = createRuntime(baseLedger, {}, { continuity: emptyContinuityState() });
    await federationTick(runtime);

    const story = cosmicTimelineView(baseLedger);
    assert.ok(Array.isArray(story));
    assert.ok(story.length > 0);
  });
});
