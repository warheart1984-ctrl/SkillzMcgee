import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  World,
  Zone,
  createDefaultWorld,
} from "../../src/darz/simulation/multizone.js";
import { propagateTension } from "../../src/darz/simulation/propagation.js";
import { applyPlayerAction } from "../../src/darz/simulation/player.js";
import { factionStep } from "../../src/darz/factions/loop.js";
import { paradoxStorm } from "../../src/darz/simulation/paradoxStorm.js";
import { logZoneTick } from "../../src/darz/history/scriptureLog.js";

describe("DAR-Z multi-zone simulation", () => {
  it("tickAll returns faces per zone", () => {
    const world = createDefaultWorld();
    const result = world.tickAll();
    assert.equal(result.length, 3);
    for (const entry of result) {
      assert.ok(entry.faces.rpg);
      assert.ok(entry.faces.gov);
      assert.ok(entry.faces.scr);
      assert.ok(entry.faces.cos);
    }
  });

  it("propagateTension blends equilibrium with neighbors", () => {
    const world = createDefaultWorld();
    const before = world.getZone("Warfront").cosmos.equilibrium;
    propagateTension(world);
    const after = world.getZone("Warfront").cosmos.equilibrium;
    assert.notEqual(before, after);
  });

  it("applyPlayerAction bumps tension and coreTicks", () => {
    const world = createDefaultWorld();
    const zone = applyPlayerAction(world, "Dreamlands", "horizon");
    assert.ok(zone.cosmos.horizon >= 5);
  });

  it("factionStep maps posture to action", () => {
    const world = createDefaultWorld();
    const zone = world.getZone("Warfront");
    const faction = { id: "faction-1" };
    const step = factionStep(faction, zone);
    assert.equal(step.action, "fortify");
    assert.equal(step.posture, "Refine");
  });

  it("paradoxStorm returns event metadata", () => {
    const zone = new Zone("Test", {
      becoming: 6,
      resistance: 6,
      memory: 6,
      horizon: 6,
      equilibrium: 6,
    });
    const event = paradoxStorm(zone, () => 0.99);
    assert.ok(event.event);
    assert.equal(event.zone, "Test");
  });

  it("logZoneTick writes scripture entry", () => {
    const zone = new Zone("Ruins", {
      becoming: 0,
      resistance: 2,
      memory: 5,
      horizon: 1,
      equilibrium: 2,
    });
    const entries = [];
    logZoneTick(zone, { write: (e) => entries.push(e) });
    assert.equal(entries.length, 1);
    assert.match(entries[0].verse, /Memory/);
  });
});
