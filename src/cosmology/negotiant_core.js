/**
 * Negotiant Core (⟴) — constitutional transition + interpretive shell.
 *
 * Constitutional law: coreTick() only. See governance/standards/theta/canon/negotiant-core.md
 * Faces: src/faces/ — read-only, no authority.
 */

import { tension, tensionToRecord } from "../tension/types.js";
import { selfNegotiate } from "../tension/operations.js";
import {
  NEGOTIANT_CORE_VERSION,
  NEGOTIANT_GLYPH,
  NEGOTIANT_SENTENCE,
  assertTransitionInvariants,
} from "./core_contract.js";
import { FACE_NAMES, projectFace } from "../faces/index.js";
import { createMgk1State, processProposal } from "../governance/mgk1.js";

export {
  NEGOTIANT_CORE_VERSION,
  NEGOTIANT_GLYPH,
  NEGOTIANT_SENTENCE,
  assertTransitionInvariants,
};
export {
  isValidCosmos,
  cloneCosmos,
  TENSION_KEYS,
  STABILITY_BOUND,
} from "./core_contract.js";

/** @typedef {import("../tension/types.js").Tension} Cosmos */
/** @typedef {import("../faces/index.js").FaceName} CoreFace */

/** @type {readonly CoreFace[]} */
export const CORE_FACES = FACE_NAMES;

/**
 * @typedef {{
 *   version: string,
 *   glyph: string,
 *   sentence: string,
 *   face: CoreFace,
 *   rotation: number,
 *   cosmos: Cosmos,
 *   phase: string,
 *   history: object[],
 * }} NegotiantCoreState
 */

/** @type {Record<CoreFace, string[]>} */
export const CORE_PHASES = {
  rpg: ["tension cycle", "mode shift", "backlash", "recursive cosmology", "fractal scale", "paradox state"],
  language: ["negotiate", "invert", "scale", "dissolve", "rebirth", "paradox"],
  governance: ["propose", "negotiate", "shift", "apply", "record"],
  scripture: ["Becoming", "Resistance", "Memory", "Horizon", "Equilibrium"],
  cosmology: ["Prime", "Anti-Prime", "Paradox", "Return", "Trans-Prime", "Supra-Prime", "Hyper-Prime"],
};

/**
 * Constitutional transition — the only lawful state mutation.
 * @param {Cosmos} cosmos
 * @returns {Cosmos}
 */
export function coreTick(cosmos) {
  const next = selfNegotiate(cosmos);
  const check = assertTransitionInvariants(cosmos, next);
  if (!check.ok) {
    throw new Error(`coreTick invariant violation: ${check.violations.join(", ")}`);
  }
  return next;
}

/**
 * @param {{ cosmos?: Cosmos, rotation?: number }} [init]
 * @returns {NegotiantCoreState}
 */
export function createNegotiantCore(init = {}) {
  return {
    version: NEGOTIANT_CORE_VERSION,
    glyph: NEGOTIANT_GLYPH,
    sentence: NEGOTIANT_SENTENCE,
    face: CORE_FACES[0],
    rotation: init.rotation ?? 0,
    cosmos: init.cosmos ?? tension(),
    phase: facePhase(CORE_FACES[0], 0),
    history: [],
  };
}

/**
 * @param {CoreFace} face
 * @param {number} rotation
 */
function facePhase(face, rotation) {
  const phases = CORE_PHASES[face];
  return phases[rotation % phases.length];
}

/**
 * @param {NegotiantCoreState} state
 * @param {CoreFace} face
 * @returns {NegotiantCoreState}
 */
export function rotateCore(state, face) {
  const idx = CORE_FACES.indexOf(face);
  if (idx < 0) throw new Error(`Unknown face: ${face}`);
  return {
    ...state,
    face,
    rotation: idx,
    phase: facePhase(face, state.history.length),
    history: [...state.history],
  };
}

/**
 * Shell operation — advances cosmos via coreTick only.
 * @param {NegotiantCoreState} state
 * @returns {NegotiantCoreState}
 */
export function spinCore(state) {
  const nextCosmos = coreTick(state.cosmos);
  const turn = state.history.length + 1;
  const face = CORE_FACES[turn % CORE_FACES.length];
  return {
    ...state,
    face,
    rotation: turn % CORE_FACES.length,
    cosmos: nextCosmos,
    phase: facePhase(face, turn),
    history: [
      ...state.history,
      {
        turn,
        face,
        phase: facePhase(face, turn),
        cosmos: tensionToRecord(nextCosmos),
        faceView: projectFace(face, nextCosmos),
      },
    ],
  };
}

/**
 * @param {NegotiantCoreState} state
 * @returns {NegotiantCoreState}
 */
export function spinFullCycle(state) {
  let s = { ...state, history: [...state.history] };
  for (let i = 0; i < CORE_FACES.length; i++) {
    s = spinCore(s);
  }
  return s;
}

/**
 * Read-only face metadata + live projection.
 * @param {CoreFace} face
 * @param {Cosmos} [cosmos]
 */
export function viewCoreFace(face, cosmos) {
  const meta = {
    rpg: {
      title: "RPG Mode",
      commentary: "The 200-page book is expanded commentary on this loop.",
      roll: "2d6 + Tension — 10+ manifest, 7-9 partial, 6- backlash",
    },
    language: {
      title: "Programming Language Mode",
      commentary: "Every function is a phase of the spiral.",
      equation: "cosmos(t+1) = coreTick(cosmos(t))",
    },
    governance: {
      title: "Governance Mode",
      commentary: "The constitution is legal commentary on the spiral.",
      modes: 10,
    },
    scripture: {
      title: "Scripture Mode",
      commentary: "The scripture is poetic commentary on the spiral.",
      seed: "Becoming → Resistance → Memory → Horizon → Equilibrium → …",
    },
    cosmology: {
      title: "Cosmology Mode",
      commentary: "The cosmology is philosophical commentary on the spiral.",
    },
  }[face];

  if (!meta) throw new Error(`Unknown face: ${face}`);

  return {
    face,
    ...meta,
    phases: CORE_PHASES[face],
    projection: cosmos ? projectFace(face, cosmos) : undefined,
  };
}

/**
 * Governance simulation — read-only over core; does NOT mutate constitutional state.
 * @param {Cosmos} cosmos
 * @param {{ id: string, text: string, tensionImpact?: Partial<Cosmos> }} proposal
 */
export function simulateGovernance(cosmos, proposal) {
  const mgk1 = createMgk1State({ tensions: cosmos });
  const { state: nextMgk1, decision } = processProposal(mgk1, proposal);
  return {
    view: projectFace("governance", cosmos),
    simulation: {
      mode: nextMgk1.mode,
      decision,
      projectedTensions: { ...nextMgk1.tensions },
    },
    note: "Simulation only — constitutional state unchanged until coreTick().",
  };
}

/** @deprecated Use simulateGovernance — faces must not mutate core state. */
export function governThroughCore(state, proposal) {
  const sim = simulateGovernance(state.cosmos, proposal);
  return { core: state, mgk1: sim.simulation, simulation: sim };
}

/** @returns {string[]} */
export function renderNegotiantCore() {
  return [
    "THE NEGOTIANT CORE",
    "",
    `                    ${NEGOTIANT_GLYPH}`,
    "",
    `Version: ${NEGOTIANT_CORE_VERSION} — Constitutional Artifact — STABLE`,
    "",
    "Not a symbol. A machine.",
    "",
    NEGOTIANT_SENTENCE,
    "",
    "Contract: coreTick() is the law. Everything else is commentary.",
    "",
    "Five interpretive faces (read-only):",
    "  rpg | language | governance | scripture | cosmology",
    "",
    `Canon: governance/standards/theta/canon/negotiant-core.md`,
  ];
}

/**
 * @param {CoreFace} [face]
 * @param {Cosmos} [cosmos]
 * @returns {string[]}
 */
export function renderNegotiantCoreFace(face = "rpg", cosmos) {
  const view = viewCoreFace(face, cosmos);
  const lines = [
    `NEGOTIANT CORE — ${view.title.toUpperCase()}`,
    "",
    `                    ${NEGOTIANT_GLYPH}`,
    "",
    view.commentary,
    "",
  ];
  if (view.equation) lines.push(`Equation: ${view.equation}`);
  if (view.phases) lines.push("Phases:", ...view.phases.map((p) => `  • ${p}`));
  if (view.seed) lines.push(`Cycle: ${view.seed}`);
  if (view.roll) lines.push(`Roll: ${view.roll}`);
  if (view.projection) {
    lines.push("", "Projection:", JSON.stringify(view.projection, null, 2));
  }
  lines.push("", NEGOTIANT_SENTENCE);
  return lines;
}

/**
 * @param {NegotiantCoreState} state
 * @returns {string[]}
 */
export function renderNegotiantCoreState(state) {
  const c = tensionToRecord(state.cosmos);
  const projection = projectFace(state.face, state.cosmos);
  return [
    "NEGOTIANT CORE — LIVE",
    "",
    `                    ${state.glyph}`,
    "",
    `Version:   ${state.version}`,
    `Face:      ${state.face}`,
    `Phase:     ${state.phase}`,
    `Turns:     ${state.history.length}`,
    "",
    "Cosmos:",
    `  Becoming:    ${c.becoming.toFixed(2)}`,
    `  Resistance:  ${c.resistance.toFixed(2)}`,
    `  Memory:      ${c.memory.toFixed(2)}`,
    `  Horizon:     ${c.horizon.toFixed(2)}`,
    `  Equilibrium: ${c.equilibrium.toFixed(2)}`,
    "",
    "Face projection:",
    JSON.stringify(projection, null, 2),
    "",
    NEGOTIANT_SENTENCE,
  ];
}
