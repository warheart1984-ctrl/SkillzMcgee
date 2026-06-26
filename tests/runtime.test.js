import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createCrk1Runtime } from "../src/crk1/runtime.js";
import { collapseSubsystem, createAsOmegaServices } from "../src/singularity/collapse.js";
import { bootFederatedRuntime, runFederatedNodeLoop } from "../src/runtime/node_loop.js";
import { emptyContinuityState, updateNodeRoot } from "../src/federation/frs_continuity/continuity.js";
import { createCosmicLedger } from "../src/cosmic/cosmic_ledger.js";

describe("CRK-1 runtime", () => {
  it("recomputes global root", async () => {
    let continuity = emptyContinuityState();
    continuity = updateNodeRoot(continuity, {
      nodeId: "n1",
      globalMerkleRoot: "r1",
      lineageRoots: {},
      height: 1,
      timestamp: Date.now(),
    });
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const crk1 = createCrk1Runtime({
      baseLedger,
      cosmicLedger: cosmic,
      getContinuity: () => continuity,
      setContinuity: (s) => { continuity = s; },
    });

    const root = await crk1.recomputeGlobalRoot();
    assert.ok(root);
    assert.equal(continuity.globalRoot, root);
  });

  it("evaluates genesis candidate when unstable", async () => {
    let continuity = emptyContinuityState();
    const baseLedger = { entries: [], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const crk1 = createCrk1Runtime({
      baseLedger,
      cosmicLedger: cosmic,
      getContinuity: () => continuity,
      setContinuity: (s) => { continuity = s; },
    });

    const result = await crk1.evaluateGenesisCandidate({
      drift: 0.9,
      instabilityTrend: "rising",
    });
    assert.equal(result.candidate, true);
    assert.ok(result.event?.genesisId);
  });
});

describe("AS-Ω collapse", () => {
  it("collapses subsystem and re-folds", () => {
    const ledger = [
      { id: "a", slice: "keep", status: "ok" },
      { id: "b", slice: "drop", status: "ok" },
    ];
    const result = collapseSubsystem(ledger, "drop");
    assert.equal(result.removedCount, 1);
    assert.equal(result.remainingCount, 1);
    assert.ok(result.fingerprint);
  });

  it("createAsOmegaServices logs collapse to cosmic ledger", async () => {
    const baseLedger = { entries: [{ id: "x", slice: "sub", status: "ok" }], cosmicStream: [] };
    const cosmic = createCosmicLedger(baseLedger);
    const asOmega = createAsOmegaServices(baseLedger.entries, cosmic);
    await asOmega.collapseSubsystem("sub");
    assert.ok(cosmic.readStream().some((e) => e.type === "COLLAPSE_TRIGGERED"));
  });
});

describe("Federated node loop", () => {
  it("runs fold + tick cycle", async () => {
    const node = bootFederatedRuntime({
      ledger: [{ id: "r1", slice: "test", status: "ok", timestamp: 1 }],
    });
    const results = await runFederatedNodeLoop(node, 1);
    assert.equal(results.length, 1);
    assert.ok(results[0].fold.asOmega.fingerprint);
    assert.ok(Array.isArray(results[0].timeline));
    assert.equal(results[0].tickResult.ok, true);
  });
});
