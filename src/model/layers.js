/**
 * Organism layer model — Mind → Will → Body → Memory → Heart, bound by Spine (Law).
 */

/** @typedef {'intelligence' | 'will' | 'structure' | 'narrative' | 'awareness' | 'governance'} LayerId */

/**
 * @typedef {Object} Layer
 * @property {LayerId} id
 * @property {string} name
 * @property {string} description
 */

/** @type {Layer[]} */
export const LAYERS = [
  {
    id: "intelligence",
    name: "Mind",
    description: "Cognition, analysis, adaptation",
  },
  {
    id: "will",
    name: "Will / Agency",
    description: "Decision, action, volition under law",
  },
  {
    id: "structure",
    name: "Body",
    description: "Architecture, substrate, federation",
  },
  {
    id: "narrative",
    name: "Memory",
    description: "Continuity, history, cosmic ledger",
  },
  {
    id: "awareness",
    name: "Heart",
    description: "Observability, empathy, feedback",
  },
  {
    id: "governance",
    name: "Spine / Law",
    description: "Constitutional binding substrate (CRK-1)",
  },
];

/**
 * @param {LayerId} id
 * @returns {Layer | undefined}
 */
export function getLayer(id) {
  return LAYERS.find((l) => l.id === id);
}

/**
 * Map organism layers to runtime modules.
 * @type {Record<LayerId, string[]>}
 */
export const LAYER_MODULES = {
  intelligence: ["src/substrations/", "src/goals/"],
  will: ["src/behavior/", "src/substrations/actions.js"],
  structure: ["src/federation/", "src/runtime/"],
  narrative: ["src/cosmic/"],
  awareness: ["src/cosmic/cosmic_timeline.js", "ui/governance_ui.py"],
  governance: ["src/crk1/", "src/behavior/meta_engine.js", "config/constitution.yaml"],
};
