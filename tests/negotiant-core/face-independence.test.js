import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { coreTick } from "../../src/cosmology/negotiant_core.js";
import { FACE_NAMES, projectFace } from "../../src/faces/index.js";
import { cloneCosmos } from "../../src/cosmology/core_contract.js";
import { cosmos } from "../helpers/cosmos.js";

describe("Negotiant Core — determinism & idempotence v1.0.0", () => {
  it("double application from same seed is deterministic", () => {
    const S = cosmos({ becoming: 5, resistance: 5, memory: 5, horizon: 5, equilibrium: 5 });
    const once = coreTick(cloneCosmos(S));
    const twice = coreTick(cloneCosmos(once));
    const onceB = coreTick(cloneCosmos(S));
    const twiceB = coreTick(cloneCosmos(onceB));
    assert.deepEqual(twice, twiceB);
  });

  it("100 sequential ticks from bounded start remain finite", () => {
    let S = cosmos({ becoming: 7, resistance: 4, memory: 9, horizon: 6, equilibrium: 5 });
    for (let i = 0; i < 100; i++) {
      S = coreTick(S);
      for (const v of Object.values(S)) {
        assert.equal(Number.isFinite(v), true);
      }
    }
  });
});

describe("Negotiant Core — face independence v1.0.0", () => {
  for (const name of FACE_NAMES) {
    it(`face '${name}' does not mutate cosmos`, () => {
      const S = cosmos({ becoming: 3, resistance: 6, memory: 2, horizon: 8, equilibrium: 5 });
      const before = cloneCosmos(S);
      projectFace(name, S);
      assert.deepEqual(S, before);
    });
  }

  it("all faces return objects without touching input", () => {
    const S = cosmos({ becoming: 7, resistance: 4, memory: 9, horizon: 6, equilibrium: 5 });
    for (const name of FACE_NAMES) {
      const out = projectFace(name, S);
      assert.equal(typeof out, "object");
      assert.notEqual(out, null);
    }
  });
});
