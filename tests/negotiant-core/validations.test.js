import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { projectFace } from "../../src/faces/index.js";
import { cosmos } from "../helpers/cosmos.js";

const ROOT = join(import.meta.dirname, "../..");
const VALIDATIONS = join(ROOT, "governance/standards/theta/validations");

describe("Theta face validations — artifacts", () => {
  for (const name of [
    "language-face.md",
    "rpg-face.md",
    "governance-face.md",
    "scripture-face.md",
    "cosmology-face.md",
  ]) {
    it(`${name} exists and declares provisional validated status`, () => {
      const path = join(VALIDATIONS, name);
      assert.equal(existsSync(path), true);
      const text = readFileSync(path, "utf8");
      assert.match(text, /Validated View \(Provisional\)|Validated View \(provisional\)/i);
      assert.match(text, /PASS/);
    });
  }
});

describe("RPG face — validated mapping semantics", () => {
  it("mode = dominant tension, backlash = max − min, cycle = raw vector", () => {
    const S = cosmos({ becoming: 3, resistance: 9, memory: 2, horizon: 8, equilibrium: 5 });
    const view = projectFace("rpg", S);

    assert.equal(view.mode, "Resistance");
    assert.equal(view.backlash, 9 - 2);
    assert.deepEqual(view.cycle, {
      becoming: 3,
      resistance: 9,
      memory: 2,
      horizon: 8,
      equilibrium: 5,
    });
    assert.match(view.narrativeHook, /Resistance/);
  });
});
