import { coreTick } from "../../cosmology/negotiant_core.js";
import { projectFace } from "../../faces/index.js";
import { cloneCosmos } from "../../cosmology/core_contract.js";

/**
 * @typedef {import("../../tension/types.js").Tension} Cosmos
 */

export class Zone {
  /**
   * @param {string} name
   * @param {Cosmos} cosmos
   */
  constructor(name, cosmos) {
    this.name = name;
    this.cosmos = cloneCosmos(cosmos);
  }

  /** @returns {object} */
  tick() {
    this.cosmos = coreTick(this.cosmos);
    return {
      rpg: projectFace("rpg", this.cosmos),
      gov: projectFace("governance", this.cosmos),
      scr: projectFace("scripture", this.cosmos),
      cos: projectFace("cosmology", this.cosmos),
    };
  }
}

export class World {
  /**
   * @param {Zone[]} zones
   * @param {Record<string, string[]>} [adjacency]
   */
  constructor(zones, adjacency = {}) {
    this.zones = zones;
    this.adjacency = adjacency;
  }

  /**
   * @param {string} name
   * @returns {Zone | undefined}
   */
  getZone(name) {
    return this.zones.find((z) => z.name === name);
  }

  /**
   * @param {string} name
   * @returns {Zone[]}
   */
  getNeighbors(name) {
    const names = this.adjacency[name] ?? [];
    return names.map((n) => this.getZone(n)).filter(Boolean);
  }

  /** @returns {Array<{ name: string, faces: object }>} */
  tickAll() {
    return this.zones.map((zone) => ({
      name: zone.name,
      faces: zone.tick(),
    }));
  }
}

/**
 * Default three-zone DAR-Z prototype world.
 * @returns {World}
 */
export function createDefaultWorld() {
  return new World(
    [
      new Zone("Warfront", {
        becoming: 4,
        resistance: 5,
        memory: 2,
        horizon: 1,
        equilibrium: 0,
      }),
      new Zone("Dreamlands", {
        becoming: 1,
        resistance: 0,
        memory: 3,
        horizon: 5,
        equilibrium: 1,
      }),
      new Zone("Ruins", {
        becoming: 0,
        resistance: 2,
        memory: 5,
        horizon: 1,
        equilibrium: 2,
      }),
    ],
    {
      Warfront: ["Ruins"],
      Ruins: ["Warfront", "Dreamlands"],
      Dreamlands: ["Ruins"],
    },
  );
}
