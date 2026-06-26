import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";

import {
  generateNodeFingerprint,
  hashConfig,
  captureEnvironment,
  defaultNodeConfig,
  verifyNodeIdentity,
} from "../src/federation/frs_identity/index.js";
import {
  createEnvelopeFromIdentity,
  signWithNodeKey,
  verifyEnvelope,
  clearBus,
  sendEnvelope,
  receiveEnvelope,
  createCosmosSnapshot,
} from "../src/federation/frs_exchange/index.js";
import {
  emptyContinuityState,
  updateNodeRoot,
  computeGlobalRoot,
  verifyGlobalContinuity,
} from "../src/federation/frs_continuity/index.js";
import {
  prepareWorldlineExport,
  verifyWorldlineExport,
  acceptWorldlineImport,
  recordMigration,
} from "../src/federation/frs_migration/index.js";
import { detectConflicts, proposeReconciliation } from "../src/federation/frs_reconcile/index.js";
import {
  proposeGenesis,
  signGenesis,
  commitGenesis,
  verifyGenesis,
  createGenesisTopology,
} from "../src/federation/frs_genesis/index.js";
import {
  bootFederatedNode,
  foldFederatedSingularity,
  publishCosmosSnapshot,
  ingestFederatedEnvelope,
} from "../src/federation/frs.js";
import { foldSingularity } from "../src/federation/frs.js";

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "frs-test-"));

describe("frs_identity", () => {
  it("F1: fingerprint is deterministic", () => {
    const config = defaultNodeConfig();
    const env = captureEnvironment();
    const a = generateNodeFingerprint(config, env);
    const b = generateNodeFingerprint(config, env);
    assert.equal(a.hash, b.hash);
  });

  it("I2: config change changes fingerprint", () => {
    const env = captureEnvironment();
    const a = generateNodeFingerprint(defaultNodeConfig(), env);
    const b = generateNodeFingerprint({ ...defaultNodeConfig(), crkVersion: "CRK-2.0" }, env);
    assert.notEqual(a.hash, b.hash);
  });
});

describe("frs_exchange", () => {
  beforeEach(() => clearBus());

  it("E1: envelope sign and verify", () => {
    const identity = {
      nodeId: "node-a",
      fingerprint: { hash: "fp-a" },
      environment: captureEnvironment(),
      config: defaultNodeConfig(),
    };
    const envelope = createEnvelopeFromIdentity(identity, "fingerprint", { hash: "fp-a" });
    const signed = signWithNodeKey(envelope, identity.nodeId);
    assert.ok(verifyEnvelope(signed));
  });

  it("snapshot payload verifies merkle", () => {
    const ledger = [{ id: "1", slice: "x", actor: "a", input: 1, output: 2, timestamp: 1, status: "ok" }];
    const asOmega = foldSingularity(ledger);
    const identity = {
      nodeId: "node-a",
      fingerprint: { hash: "fp" },
      environment: captureEnvironment(),
      config: defaultNodeConfig(),
    };
    const snap = createCosmosSnapshot(asOmega, identity, 1);
    assert.equal(snap.globalMerkleRoot, asOmega.merkle.globalRoot);
  });
});

describe("frs_continuity", () => {
  it("F4/C1: global root is deterministic", () => {
    let state = emptyContinuityState();
    state = updateNodeRoot(state, {
      nodeId: "a",
      globalMerkleRoot: "root-a",
      lineageRoots: {},
      height: 1,
      timestamp: 1,
    });
    state = updateNodeRoot(state, {
      nodeId: "b",
      globalMerkleRoot: "root-b",
      lineageRoots: {},
      height: 2,
      timestamp: 2,
    });
    assert.ok(verifyGlobalContinuity(state));
    const again = computeGlobalRoot({ ...state, globalRoot: "" });
    assert.equal(again, state.globalRoot);
  });
});

describe("frs_migration", () => {
  it("M1/M3: export and migration receipt", () => {
    const receipts = [{ id: "r1", slice: "x", actor: "a", input: 1, output: 2, timestamp: 1 }];
    const exp = prepareWorldlineExport("line-1", "node-a", "node-b", receipts, 1);
    assert.ok(verifyWorldlineExport(exp));
    const imp = acceptWorldlineImport(exp, "node-b", 1);
    assert.equal(imp.accepted, true);
    const migration = recordMigration(exp, imp);
    assert.ok(migration.migrationId);
  });
});

describe("frs_reconcile", () => {
  it("R1: detects merkle mismatch", () => {
    let state = emptyContinuityState();
    state = updateNodeRoot(state, { nodeId: "a", globalMerkleRoot: "r1", lineageRoots: {}, height: 1, timestamp: 1 });
    state = updateNodeRoot(state, { nodeId: "b", globalMerkleRoot: "r2", lineageRoots: {}, height: 1, timestamp: 1 });
    const conflicts = detectConflicts(state);
    assert.ok(conflicts.some((c) => c.type === "merkle_mismatch"));
    const plan = proposeReconciliation(conflicts[0]);
    assert.equal(plan.strategy, "quarantine");
  });
});

describe("frs_genesis", () => {
  it("G1/G3: genesis quorum and verify", () => {
    const nodes = ["node-a", "node-b"];
    const pre = { "node-a": "fp-a", "node-b": "fp-b" };
    const event = proposeGenesis(nodes, "node-a", 1, pre);
    const sigs = nodes.map((n) => signGenesis(event.genesisId, n));
    const topology = createGenesisTopology(event.genesisId, nodes, 2);
    const committed = commitGenesis(event, sigs, topology, { "node-a": "new-a", "node-b": "new-b" });
    assert.ok(committed.committed);
    assert.ok(verifyGenesis(committed, sigs, topology));
  });
});

describe("frs orchestrator", () => {
  beforeEach(() => clearBus());

  it("full federated fold includes node metadata", () => {
    const { identity, continuity } = bootFederatedNode({ identityPath: path.join(TMP, "id1.json") });
    const ledger = [
      { id: "1", slice: "slice_math", actor: "a", input: "1+1", output: 2, timestamp: 1, status: "ok" },
    ];
    const result = foldFederatedSingularity(ledger, identity, continuity);
    assert.equal(result.asOmega.meta.nodeId, identity.nodeId);
    assert.ok(result.globalContinuityValid);
  });

  it("publish and ingest snapshot", async () => {
    const a = bootFederatedNode({ identityPath: path.join(TMP, "id-a.json") });
    const b = bootFederatedNode({ identityPath: path.join(TMP, "id-b.json") });
    const ledger = [{ id: "1", slice: "x", actor: "a", input: 1, output: 2, timestamp: 1, status: "ok" }];
    const folded = foldFederatedSingularity(ledger, a.identity, a.continuity);
    const { envelope } = await publishCosmosSnapshot(
      folded.asOmega,
      a.identity,
      1,
      b.identity.nodeId,
    );
    const signed = signWithNodeKey(envelope, a.identity.nodeId);
    const ingested = ingestFederatedEnvelope(signed, b.identity.nodeId, b.continuity);
    assert.equal(ingested.event.accepted, true);
    assert.equal(ingested.continuity.nodeRoots.length, 1);
  });
});
