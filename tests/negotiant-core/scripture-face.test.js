import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { view as scriptureView } from "../../src/faces/scripture/view.js";
import { cosmos } from "../helpers/cosmos.js";

describe("Scripture Face — validated mapping", () => {
  it("dominant tension appears first in ordering", () => {
    const S = cosmos({ becoming: 2, resistance: 9, memory: 3, horizon: 5, equilibrium: 1 });
    const scr = scriptureView(S);
    assert.equal(scr.ordering[0], "Resistance");
  });

  it("verse mentions correct dominant tension name", () => {
    const S = cosmos({ becoming: 7, resistance: 2, memory: 1, horizon: 3, equilibrium: 2 });
    const scr = scriptureView(S);
    assert.match(scr.verse, /Becoming/);
  });

  it("ordering is sorted high to low", () => {
    const S = cosmos({ becoming: 1, resistance: 5, memory: 3, horizon: 8, equilibrium: 2 });
    const scr = scriptureView(S);
    assert.deepEqual(scr.ordering, ["Horizon", "Resistance", "Memory", "Equilibrium", "Becoming"]);
  });
});
