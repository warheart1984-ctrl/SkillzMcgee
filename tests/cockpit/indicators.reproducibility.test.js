import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { computeIndicators } from "../../src/cockpit/indicators.js";
import { tierToScore, TIER_SCORES } from "../../src/cockpit/tierScore.js";
import { replayFromLedger, assertReplayConsistency } from "../../src/ledger/replay.js";
import { createZoneTick } from "../../src/ledger/zoneTick.js";
import { sampleZoneTick } from "../fixtures/zoneTick.fixture.js";
import { cosmos } from "../helpers/cosmos.js";

describe("tierToScore — canonical mapping", () => {
  it("matches cosmology face tier weights", () => {
    assert.equal(tierToScore("Prime"), 0);
    assert.equal(tierToScore("Anti-Prime"), 1);
    assert.equal(tierToScore("Paradox"), 2);
    assert.equal(tierToScore("Return"), 1);
    assert.equal(tierToScore("Hyper-Prime"), 3);
    assert.equal(tierToScore(undefined), 0);
    assert.equal(tierToScore("Unknown"), 0);
  });

  it("TIER_SCORES export matches switch", () => {
    for (const [tier, score] of Object.entries(TIER_SCORES)) {
      assert.equal(tierToScore(tier), score);
    }
  });
});

describe("Cockpit indicators are reproducible from evidence", () => {
  it("canonical fixture: mode/backlash/tier/posture/verse/risk match replay", () => {
    const zoneTick = sampleZoneTick();
    const indicators = computeIndicators(zoneTick);
    const replayed = replayFromLedger(zoneTick);

    assert.equal(indicators.mode, "becoming");
    assert.equal(indicators.backlash, 4);
    assert.equal(indicators.tier, "Anti-Prime");
    assert.equal(indicators.posture, "Propose");
    assert.equal(
      indicators.verse,
      "And the Tension of Becoming rose above the others, and the world bent accordingly.",
    );
    assert.equal(indicators.risk, 1);

    assert.equal(indicators.mode, replayed.mode);
    assert.equal(indicators.backlash, replayed.backlash);
    assert.equal(indicators.tier, replayed.tier);
    assert.equal(indicators.posture, replayed.posture);
    assert.equal(indicators.verse, replayed.verse);
    assert.equal(indicators.risk, replayed.risk);
  });

  it("assertReplayConsistency passes for canonical fixture", () => {
    const check = assertReplayConsistency(sampleZoneTick());
    assert.equal(check.ok, true, check.mismatches.join("; "));
  });

  it("risk indicator uses documented algorithm", () => {
    const zoneTick = sampleZoneTick();
    const indicators = computeIndicators(zoneTick);

    const tierScore = tierToScore(zoneTick.faces?.cosmology?.tier);
    const expectedRisk = tierScore + (zoneTick.faces?.rpg?.backlash >= 5 ? 1 : 0);

    assert.equal(indicators.risk, expectedRisk);
    assert.equal(indicators.risk, 1);
  });

  it("mode = argmax tension key", () => {
    assert.equal(computeIndicators(sampleZoneTick()).mode, "becoming");
  });

  it("backlash = max − min", () => {
    const c = cosmos({ becoming: 1, resistance: 9, memory: 2, horizon: 4, equilibrium: 3 });
    const zoneTick = createZoneTick("test", c);
    assert.equal(computeIndicators(zoneTick).backlash, 9 - 1);
  });
});
