/**
 * MGK-1 — Modal Governance Protocol (Negotiant constitutional engine).
 */

import { tension } from "../tension/types.js";
import { negotiate, invert, scale } from "../tension/operations.js";
import { isMode, MODES } from "../tension/types.js";

/**
 * @typedef {{ id: string, text: string, tensionImpact?: Partial<import("../tension/types.js").Tension> }} Proposal
 * @typedef {{ id: string, proposalId: string, mode: string, tensions: import("../tension/types.js").Tension, applied: boolean, at: number }} Decision
 * @typedef {{ mode: string, tensions: import("../tension/types.js").Tension, rules: { id: string, text: string }[], history: Decision[] }} Mgk1State
 */

const MODE_SHIFT_THRESHOLD = 7;

/**
 * @param {{ mode?: string, tensions?: import("../tension/types.js").Tension }} [init]
 * @returns {Mgk1State}
 */
export function createMgk1State(init = {}) {
  return {
    mode: init.mode ?? "NEGOTIATE",
    tensions: init.tensions ?? tension(),
    rules: [],
    history: [],
  };
}

/**
 * @param {import("../tension/types.js").Tension} base
 * @param {Partial<import("../tension/types.js").Tension>} impact
 * @returns {import("../tension/types.js").Tension}
 */
export function applyTensionImpact(base, impact) {
  return tension({
    becoming: base.becoming + (impact.becoming ?? 0),
    resistance: base.resistance + (impact.resistance ?? 0),
    memory: base.memory + (impact.memory ?? 0),
    horizon: base.horizon + (impact.horizon ?? 0),
    equilibrium: base.equilibrium + (impact.equilibrium ?? 0),
  });
}

/**
 * @param {import("../tension/types.js").Tension} t
 * @returns {string}
 */
export function suggestModeShift(t) {
  const max = Math.max(t.becoming, t.resistance, t.memory, t.horizon, t.equilibrium);
  if (max < MODE_SHIFT_THRESHOLD) return "NEGOTIATE";
  if (t.resistance >= max) return "REFUSE";
  if (t.becoming >= max) return "GENERATE";
  if (t.horizon >= max) return "SCALE";
  if (t.equilibrium < 3) return "PARADOX";
  if (t.memory >= max) return "GOVERN";
  return "NEGOTIATE";
}

/**
 * @param {Mgk1State} state
 * @param {Proposal} proposal
 * @returns {{ state: Mgk1State, decision: Decision }}
 */
export function processProposal(state, proposal) {
  const tensions = applyTensionImpact(
    state.tensions,
    proposal.tensionImpact ?? { equilibrium: 0.5 }
  );
  const suggested = suggestModeShift(tensions);
  let mode = state.mode;
  let applied = false;
  const rules = [...state.rules];

  switch (suggested) {
    case "REFUSE":
      applied = false;
      mode = "REFUSE";
      break;
    case "GENERATE":
      rules.push({ id: proposal.id, text: proposal.text });
      applied = true;
      mode = "GENERATE";
      break;
    case "PARADOX":
      rules.push({ id: `${proposal.id}-paradox`, text: `NOT: ${proposal.text}` });
      applied = true;
      mode = "PARADOX";
      break;
    case "GOVERN":
      applied = rules.length > 0;
      mode = "GOVERN";
      break;
    case "SCALE":
      mode = "SCALE";
      applied = true;
      break;
    default:
      if (state.mode === "NEGOTIATE" || suggested === "NEGOTIATE") {
        rules.push({ id: proposal.id, text: proposal.text });
        applied = true;
        mode = "NEGOTIATE";
      }
  }

  const decision = {
    id: `dec-${state.history.length + 1}`,
    proposalId: proposal.id,
    mode,
    tensions: { ...tensions },
    applied,
    at: Date.now(),
  };

  return {
    state: {
      mode,
      tensions: negotiate(tensions, scale(invert(tensions), 0.1)),
      rules,
      history: [...state.history, decision],
    },
    decision,
  };
}

/**
 * @param {Mgk1State} state
 * @returns {string[]}
 */
export function renderMgk1StatePanel(state) {
  const t = state.tensions;
  return [
    "MGK‑1 GOVERNANCE PROTOCOL",
    "",
    `Mode:     ${state.mode}`,
    `Rules:    ${state.rules.length}`,
    `History:  ${state.history.length} decisions`,
    "",
    "Tension Metrics:",
    `  Becoming:    ${t.becoming.toFixed(1)}`,
    `  Resistance:  ${t.resistance.toFixed(1)}`,
    `  Memory:      ${t.memory.toFixed(1)}`,
    `  Horizon:     ${t.horizon.toFixed(1)}`,
    `  Equilibrium: ${t.equilibrium.toFixed(1)}`,
    "",
    "Modes: " + MODES.join(" | "),
  ];
}

export { MODES, isMode };
