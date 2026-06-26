import test from "node:test";
import assert from "node:assert/strict";

import {
  foldAbsoluteSingularity,
  foldAbsoluteSingularityOmega,
} from "../src/singularity/absoluteSingularity.js";
import { verifyReconstructable } from "../src/singularity/foldUtils.js";
import {
  waveStep,
  evidenceFromReceipt,
  foldWaveState,
  emptyWaveVector,
} from "../src/singularity/waveMath.js";
import { buildDarzTensors } from "../src/singularity/darzTensors.js";
import { ledgerFingerprint } from "../src/singularity/fingerprint.js";
import {
  groupByLineage,
  detectBranches,
  enrichAllLineage,
} from "../src/singularity/lineage.js";
import {
  hashReceiptPayload,
  enrichReceiptChain,
  prepareReceiptForAppend,
} from "../src/singularity/receiptHash.js";
import { buildMerkleRoots, verifyHashChain } from "../src/singularity/merkle.js";
import {
  integrateNonlinearWave,
  detectAttractors,
} from "../src/singularity/nonlinearWave.js";
import { solveFieldEquations } from "../src/singularity/darzFields.js";
import { genesisOperator } from "../src/singularity/genesis.js";

function receipt(id, overrides = {}) {
  return {
    id,
    timestamp: `2026-06-22T12:00:0${id.slice(-1)}.000Z`,
    actor: "skillz",
    slice: "nova",
    intent: { type: "analysis", confidence: 0.4 },
    output: "ok",
    status: "ok",
    laws: { allowed: true },
    ...overrides,
  };
}

test("AS-Ω fold produces lineage, merkle, wave, genesis", () => {
  const entries = enrichReceiptChain([
    receipt("r1"),
    receipt("r2", { output: "second" }),
  ]);
  const as = foldAbsoluteSingularityOmega(entries);

  assert.equal(as.version, "AS-Ω");
  assert.equal(as.receiptCount, 2);
  assert.match(as.fingerprint, /^AS-[0-9a-f]{8}$/);
  assert.equal(as.k4.reconstructable, true);
  assert.equal(as.k4.hashChainValid, true);
  assert.ok(as.merkle.globalRoot);
  assert.equal(as.genesisOperator.id, "H-Ω");
  assert.equal(as.lineage.worldlines.length, 1);
  assert.ok(as.wave.nonlinear.terminal.w);
});

test("AS-2 lineage chains parentId → lineageId + depth", () => {
  const chain = enrichReceiptChain([receipt("a"), receipt("b"), receipt("c")]);
  assert.equal(chain[0].depth, 0);
  assert.equal(chain[0].lineageId, "a");
  assert.equal(chain[1].parentId, "a");
  assert.equal(chain[1].depth, 1);
  assert.equal(chain[2].lineageId, "a");
  assert.equal(chain[2].depth, 2);
});

test("AS-2 detects branches when two children share parent", () => {
  const all = enrichReceiptChain([
    receipt("root"),
    receipt("fork1", { parentId: "root" }),
    receipt("fork2", { parentId: "root" }),
  ]);
  const branches = detectBranches(all);
  assert.equal(branches.length, 1);
  assert.equal(branches[0].parentId, "root");
  assert.equal(branches[0].children.length, 2);
});

test("AS-3 receipt hash and merkle roots", () => {
  const chain = enrichReceiptChain([receipt("h1"), receipt("h2")]);
  assert.match(chain[0].receiptHash, /^[0-9a-f]{64}$/);
  assert.equal(chain[0].parentHash, null);
  assert.equal(chain[1].parentHash, chain[0].receiptHash);
  const merkle = buildMerkleRoots(chain);
  assert.ok(merkle.globalRoot);
  assert.ok(merkle.lineageRoots[chain[0].lineageId]);
  assert.equal(verifyHashChain(chain), true);
});

test("verifyReconstructable detects K4 violation", () => {
  const entries = enrichReceiptChain([receipt("r1")]);
  const sliceState = {
    nova: { lastOutput: "tampered", lastStatus: "ok", lastRunId: "r1" },
  };
  assert.equal(verifyReconstructable(sliceState, entries), false);
});

test("AS-4 nonlinear wave integration", () => {
  const entries = enrichReceiptChain([receipt("r1"), receipt("r2")]);
  const { terminal, trajectory } = integrateNonlinearWave(entries);
  assert.ok(terminal.w);
  assert.ok(terminal.velocity);
  assert.ok(terminal.acceleration);
  assert.equal(trajectory.length, 2);
  assert.ok(detectAttractors(trajectory).length >= 1);
});

test("AS-5 DAR-Z field equations", () => {
  const entries = enrichReceiptChain([
    receipt("ok1"),
    receipt("bad1", {
      status: "error",
      laws: { allowed: false, violations: ["X"] },
    }),
  ]);
  const wave = integrateNonlinearWave(entries).terminal;
  const fields = solveFieldEquations(entries, wave);
  assert.ok(fields.F_failure.length === 2);
  assert.ok(fields.F_environment.length === 2);
  assert.ok(fields.F_salience.length === 2);
  assert.ok(typeof fields.interference === "number");
});

test("genesis operator is deterministic", () => {
  const a = genesisOperator({ merkle: { globalRoot: "abc" }, attractors: [] });
  const b = genesisOperator({ merkle: { globalRoot: "abc" }, attractors: [] });
  assert.equal(a.fingerprint, b.fingerprint);
});

test("foldAbsoluteSingularity is alias for AS-Ω", () => {
  const entries = enrichReceiptChain([receipt("x")]);
  assert.equal(
    foldAbsoluteSingularity(entries).version,
    foldAbsoluteSingularityOmega(entries).version
  );
});

test("waveStep is deterministic", () => {
  const w0 = emptyWaveVector();
  const e = evidenceFromReceipt(receipt("r1"));
  assert.deepEqual(waveStep(w0, e), waveStep(w0, e));
});

test("ledger fingerprint is stable", () => {
  const entries = enrichReceiptChain([receipt("a"), receipt("b")]);
  assert.equal(ledgerFingerprint(entries), ledgerFingerprint(entries));
});

test("groupByLineage partitions chains", () => {
  const chain = enrichReceiptChain([receipt("a"), receipt("b")]);
  const groups = groupByLineage(chain);
  assert.equal(groups.size, 1);
  assert.equal(groups.get("a").length, 2);
});
