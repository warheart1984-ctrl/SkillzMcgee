import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { view as govView } from "../../src/faces/governance/view.js";
import { cosmos } from "../helpers/cosmos.js";

const ROOT = join(import.meta.dirname, "../..");
const VALIDATION = join(ROOT, "governance/standards/theta/validations/governance-face.md");

const POSTURE_MAP = {
  becoming: "Propose",
  resistance: "Refine",
  memory: "Review",
  horizon: "Forecast",
  equilibrium: "Ratify",
};

const PIPELINE = ["Propose", "Negotiate", "Shift", "Apply", "Record"];

describe("Governance Face — validation artifact", () => {
  it("governance-face.md exists and is validated provisional", () => {
    assert.equal(existsSync(VALIDATION), true);
    const text = readFileSync(VALIDATION, "utf8");
    assert.match(text, /Validated View \(Provisional\)/i);
    assert.match(text, /PASS/);
  });
});

describe("Governance Face — Mapping", () => {
  it("dominant tension → correct posture", () => {
    const c = cosmos({
      becoming: 5,
      resistance: 2,
      memory: 1,
      horizon: 0,
      equilibrium: 0,
    });
    const gov = govView(c);
    assert.equal(gov.posture, "Propose");
    assert.equal(gov.dominantTension, "becoming");
  });

  it("pipeline is fixed", () => {
    const c = cosmos({ becoming: 1, resistance: 1, memory: 1, horizon: 1, equilibrium: 1 });
    const gov = govView(c);
    assert.deepEqual(gov.pipeline, PIPELINE);
  });

  for (const [tensionKey, posture] of Object.entries(POSTURE_MAP)) {
    it(`${tensionKey} → ${posture}`, () => {
      const base = { becoming: 1, resistance: 1, memory: 1, horizon: 1, equilibrium: 1 };
      base[tensionKey] = 10;
      const gov = govView(cosmos(base));
      assert.equal(gov.posture, posture);
      assert.equal(gov.dominantTension, tensionKey);
    });
  }

  it("does not mutate cosmos", () => {
    const S = cosmos({ becoming: 5, resistance: 5, memory: 5, horizon: 5, equilibrium: 5 });
    const before = { ...S };
    govView(S);
    assert.deepEqual(S, before);
  });
});
