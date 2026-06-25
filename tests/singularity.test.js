import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { attachLineage, buildLineages, attachLineageChain } from "../src/singularity/lineage.js";
import { hashReceipt, merkleRoot } from "../src/singularity/merkle.js";
import { stepWave, integrateWave } from "../src/singularity/nonlinearWave.js";
import { solveFields } from "../src/singularity/darzFields.js";
import { foldSingularity } from "../src/singularity/absoluteSingularity.js";

describe("AS-2 lineage", () => {
  it("attaches parentId and depth", () => {
    const r1 = { id: "a" };
    const r2 = attachLineage({ id: "b" }, { id: "a", lineageId: "a", depth: 0 });
    assert.equal(r2.parentId, "a");
    assert.equal(r2.lineageId, "a");
    assert.equal(r2.depth, 1);
  });

  it("builds lineage map", () => {
    const chain = attachLineageChain([
      { id: "r0" },
      { id: "r1" },
      { id: "r2" },
    ]);
    const map = buildLineages(chain);
    assert.equal(map.size, 1);
    assert.equal(map.get("r0").length, 3);
  });
});

describe("AS-3 merkle", () => {
  it("hashes receipts deterministically", () => {
    const r = { slice: "x", actor: "a", input: 1, output: 2, timestamp: 1 };
    assert.equal(hashReceipt(r), hashReceipt(r));
  });

  it("computes merkle root", () => {
    const root = merkleRoot(["a", "b", "c"]);
    assert.ok(root);
    assert.equal(typeof root, "string");
  });
});

describe("AS-4 wave", () => {
  it("integrates wave over ledger", () => {
    const wave = integrateWave([
      { meta: { salience: 0.8, failure: 0.1 } },
      { meta: { salience: 0.3, failure: 0.5 } },
    ]);
    assert.ok("amplitude" in wave);
    assert.ok("momentum" in wave);
  });

  it("clamps amplitude", () => {
    let w = { amplitude: 0, momentum: 0 };
    for (let i = 0; i < 100; i++) {
      w = stepWave(w, { salience: 1, failure: 0 });
    }
    assert.ok(w.amplitude <= 1);
    assert.ok(w.amplitude >= -1);
  });
});

describe("AS-5 fields", () => {
  it("solves DAR-Z fields", () => {
    const fields = solveFields([
      { meta: { failure: 0.1, environment: 0.2, salience: 0.5 } },
    ]);
    assert.equal(fields.failure.length, 1);
    assert.equal(fields.environment[0].value, 0.2);
  });
});

describe("AS-Ω fold", () => {
  it("produces full singularity object", () => {
    const asOmega = foldSingularity([
      { id: "1", slice: "slice_math", actor: "agent", input: "1+1", output: 2, timestamp: 1, status: "ok" },
      { id: "2", slice: "slice_math", actor: "agent", input: "2+2", output: 4, timestamp: 2, status: "ok" },
    ]);
    assert.ok(asOmega.fingerprint);
    assert.ok(asOmega.merkle.globalRoot);
    assert.ok(asOmega.wave);
    assert.ok(asOmega.darz);
    assert.ok(asOmega.lineages);
    assert.equal(asOmega.meta.receiptCount, 2);
  });
});
