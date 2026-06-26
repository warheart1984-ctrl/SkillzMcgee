/**
 * Zone-to-zone tension propagation (equilibrium bleed).
 * @param {import("./multizone.js").World} world
 */
export function propagateTension(world) {
  const nextZones = world.zones.map((zone) => {
    const copy = Object.create(Object.getPrototypeOf(zone));
    copy.name = zone.name;
    copy.cosmos = { ...zone.cosmos };
    return copy;
  });

  for (let i = 0; i < world.zones.length; i++) {
    const z = world.zones[i];
    const neighbors = world.getNeighbors(z.name);
    const avgNeighborEquilibrium =
      neighbors.reduce((sum, n) => sum + n.cosmos.equilibrium, 0) /
      Math.max(neighbors.length, 1);

    nextZones[i].cosmos.equilibrium =
      (z.cosmos.equilibrium + avgNeighborEquilibrium) / 2;
  }

  world.zones = nextZones;
  return world.zones;
}
