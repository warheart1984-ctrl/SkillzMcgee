import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { view as cosmologyView } from "../../src/faces/cosmology/view.js";
import { cosmos } from "../helpers/cosmos.js";

describe("Cosmology Face — tier thresholds", () => {
  const cases = [
    [{ becoming: 0, resistance: 0, memory: 0, horizon: 0, equilibrium: 0 }, "Prime"],
    [{ becoming: 2, resistance: 2, memory: 2, horizon: 2, equilibrium: 2 }, "Anti-Prime"],
    [{ becoming: 4, resistance: 4, memory: 4, horizon: 4, equilibrium: 4 }, "Paradox"],
    [{ becoming: 6, resistance: 6, memory: 6, horizon: 6, equilibrium: 6 }, "Return"],
    [{ becoming: 9, resistance: 9, memory: 9, horizon: 9, equilibrium: 9 }, "Hyper-Prime"],
  ];

  for (const [profile, expectedTier] of cases) {
    it(`avg maps to ${expectedTier}`, () => {
      const cos = cosmologyView(cosmos(profile));
      assert.equal(cos.tier, expectedTier);
    });
  }
});
