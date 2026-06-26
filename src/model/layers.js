/**
 * Organism layer model — first-class architecture layers including LAW / GOVERNANCE.
 */

/** @typedef {'intelligence' | 'structure' | 'narrative' | 'awareness' | 'governance'} LayerId */

/**
 * @typedef {Object} Layer
 * @property {LayerId} id
 * @property {string} name
 * @property {string} description
 * @property {string} role
 */

/** @type {Layer[]} */
export const LAYERS = [
  {
    id: "intelligence",
    name: "Intelligence",
    description: "Cognition, analysis, adaptation",
    role: "Mind",
  },
  {
    id: "structure",
    name: "Structure",
    description: "Architecture, substrate, federation",
    role: "Body",
  },
  {
    id: "narrative",
    name: "Narrative",
    description: "Continuity, history, cosmic ledger",
    role: "Memory",
  },
  {
    id: "awareness",
    name: "Awareness",
    description: "Observability, empathy, feedback",
    role: "Heart",
  },
  {
    id: "governance",
    name: "LAW / GOVERNANCE — The Binding Substrate",
    description: "Constitutional spine binding all layers via CRK-1 and invariants",
    role: "Spine",
  },
];

/**
 * @param {LayerId} id
 * @returns {Layer | undefined}
 */
export function getLayer(id) {
  return LAYERS.find((l) => l.id === id);
}
