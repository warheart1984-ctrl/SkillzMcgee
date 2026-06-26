/**
 * Canonical minimal zoneTick fixture for reproducibility tests.
 * Cosmos + face projections are deterministic and representative.
 */

/** @returns {import("../../src/cockpit/types.js").ZoneTick} */
export function sampleZoneTick() {
  return {
    id: "zt-001",
    zoneId: "zone-test",
    timestamp: "2026-06-26T12:00:00.000Z",
    cosmos: {
      becoming: 4,
      resistance: 2,
      memory: 1,
      horizon: 3,
      equilibrium: 0,
    },
    faces: {
      rpg: {
        mode: "Becoming",
        backlash: 4,
        cycle: {
          becoming: 4,
          resistance: 2,
          memory: 1,
          horizon: 3,
          equilibrium: 0,
        },
      },
      governance: {
        posture: "Propose",
      },
      scripture: {
        verse:
          "And the Tension of Becoming rose above the others, and the world bent accordingly.",
        ordering: ["Becoming", "Horizon", "Resistance", "Memory", "Equilibrium"],
      },
      cosmology: {
        tier: "Anti-Prime",
      },
    },
    sourceEvents: [],
  };
}
