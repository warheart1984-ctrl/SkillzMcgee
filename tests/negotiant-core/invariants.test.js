import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { coreTick } from "../../src/cosmology/negotiant_core.js";
import {
  isValidCosmos,
  cloneCosmos,
  assertTransitionInvariants,
  STABILITY_BOUND,
  TENSION_KEYS,
} from "../../src/cosmology/core_contract.js";
import { cloneCosmos as clone, cosmos } from "../helpers/cosmos.js";

describe("Negotiant Core — Invariant Suite v1.0.0", () => {
  it("determinism: same input → same output", () => {
    const S = cosmos({ becoming: 1, resistance: 2, memory: 3, horizon: 4, equilibrium: 5 });
    const A = coreTick(clone(S));
    const B = coreTick(clone(S));
    assert.deepEqual(A, B);
  });

  it("finite values: no NaN or Infinity", () => {
    const S = cosmos({ becoming: 0, resistance: 0, memory: 0, horizon: 0, equilibrium: 0 });
    const S2 = coreTick(S);
    for (const v of Object.values(S2)) {
      assert.equal(Number.isFinite(v), true);
    }
  });

  it("closed under transition: valid in → valid out", () => {
    const S = cosmos({ becoming: 3, resistance: 3, memory: 3, horizon: 3, equilibrium: 3 });
    const S2 = coreTick(S);
    assert.equal(isValidCosmos(S2), true);
  });

  it("shape preservation: always 5 tensions", () => {
    const S = cosmos({ becoming: 1, resistance: 1, memory: 1, horizon: 1, equilibrium: 1 });
    const S2 = coreTick(S);
    assert.deepEqual(Object.keys(S2).sort(), [...TENSION_KEYS].sort());
  });

  it("no silent drift: repeated tick from same state is identical", () => {
    const S = cosmos({ becoming: 2, resistance: 2, memory: 2, horizon: 2, equilibrium: 2 });
    const A = coreTick(clone(S));
    const B = coreTick(clone(S));
    assert.deepEqual(A, B);
  });

  it("face independence: coreTick does not mutate input cosmos", () => {
    const S = cosmos({ becoming: 1, resistance: 1, memory: 1, horizon: 1, equilibrium: 1 });
    const before = clone(S);
    const S2 = coreTick(S);
    assert.deepEqual(S, before);
    assert.equal(isValidCosmos(S2), true);
  });

  it("assertTransitionInvariants passes for typical transition", () => {
    const S = cosmos({ becoming: 7, resistance: 4, memory: 9, horizon: 6, equilibrium: 5 });
    const S2 = coreTick(S);
    const result = assertTransitionInvariants(S, S2);
    assert.equal(result.ok, true);
  });

  it("stability: bounded input stays within bound after tick", () => {
    const S = cosmos({ becoming: 10, resistance: 10, memory: 10, horizon: 10, equilibrium: 10 });
    const S2 = coreTick(S);
    for (const k of TENSION_KEYS) {
      assert.ok(Math.abs(S2[k]) <= STABILITY_BOUND);
    }
  });
});
