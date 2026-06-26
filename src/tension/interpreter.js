/**
 * TENSION language — mode-driven interpreter.
 */

import { MODES, tension, isMode } from "./types.js";
import {
  negotiate,
  invert,
  dissolve,
  scale,
  generate,
  rebirth,
  paradox,
  refuse,
  govern,
  author,
  recurse,
  cosmologicalTick,
} from "./operations.js";

/**
 * @typedef {{ mode: string, cosmos: import("./types.js").Tension, rules: import("./types.js").Tension[], history: object[] }} InterpreterState
 */

/**
 * @param {{ mode?: string, cosmos?: import("./types.js").Tension }} [init]
 * @returns {InterpreterState}
 */
export function createInterpreterState(init = {}) {
  return {
    mode: init.mode ?? "NEGOTIATE",
    cosmos: init.cosmos ?? tension(),
    rules: [],
    history: [],
  };
}

/**
 * @param {InterpreterState} state
 * @param {{ op: string, args?: unknown[] }} step
 * @returns {InterpreterState}
 */
export function executeStep(state, step) {
  const args = step.args ?? [];
  let cosmos = state.cosmos;
  const history = [...state.history];

  switch (step.op) {
    case "negotiate": {
      const b = /** @type {import("./types.js").Tension} */ (args[0]);
      cosmos = negotiate(cosmos, b);
      break;
    }
    case "invert":
      cosmos = invert(cosmos);
      break;
    case "dissolve":
      cosmos = dissolve();
      break;
    case "scale": {
      const factor = /** @type {number} */ (args[0] ?? 1);
      cosmos = scale(cosmos, factor);
      break;
    }
    case "generate": {
      const seed = /** @type {string|number} */ (args[0] ?? "seed");
      cosmos = generate(seed);
      break;
    }
    case "rebirth":
      cosmos = rebirth(history.map((h) => /** @type {import("./types.js").Tension} */ (h.cosmos ?? h)));
      break;
    case "paradox": {
      const b = /** @type {import("./types.js").Tension} */ (args[0]);
      cosmos = paradox(cosmos, b);
      break;
    }
    case "refuse":
      cosmos = refuse(cosmos);
      break;
    case "recurse":
      cosmos = recurse(cosmos);
      break;
    case "tick":
      cosmos = cosmologicalTick(cosmos, history.map((h) => h.cosmos).filter(Boolean));
      break;
    case "author": {
      const rule = /** @type {import("./types.js").Tension} */ (args[0]);
      cosmos = author(cosmos, rule);
      state.rules.push(rule);
      break;
    }
    case "govern": {
      const rule = state.rules[state.rules.length - 1] ?? tension();
      cosmos = govern(cosmos, rule);
      break;
    }
    case "set_mode": {
      const mode = String(args[0] ?? "NEGOTIATE").toUpperCase();
      if (!isMode(mode)) throw new Error(`Unknown mode: ${mode}`);
      state.mode = mode;
      break;
    }
    case "set_tension":
      cosmos = tension(/** @type {Partial<import("./types.js").Tension>} */ (args[0]));
      break;
    default:
      throw new Error(`Unknown op: ${step.op}`);
  }

  history.push({ op: step.op, args, cosmos: { ...cosmos }, mode: state.mode, at: Date.now() });
  state.cosmos = cosmos;
  state.history = history;
  return state;
}

/**
 * Run program as sequence of steps; apply mode semantics after each op when mode set.
 * @param {InterpreterState} state
 * @param {{ op: string, args?: unknown[] }[]} program
 * @returns {InterpreterState}
 */
export function runProgram(state, program) {
  let s = { ...state, rules: [...state.rules], history: [...state.history] };
  for (const step of program) {
    s = executeStep(s, step);
    s = applyModeSemantics(s);
  }
  return s;
}

/**
 * @param {InterpreterState} state
 * @returns {InterpreterState}
 */
export function applyModeSemantics(state) {
  const s = { ...state, history: [...state.history] };
  switch (state.mode) {
    case "REFUSE":
      break;
    case "DISSOLVE":
      s.cosmos = dissolve();
      break;
    case "INVERT":
      s.cosmos = invert(s.cosmos);
      break;
    case "SCALE":
      s.cosmos = scale(s.cosmos, 1.1);
      break;
    case "REBIRTH":
      s.cosmos = rebirth(s.history.map((h) => h.cosmos).filter(Boolean));
      break;
    case "PARADOX":
      s.cosmos = paradox(s.cosmos, invert(s.cosmos));
      break;
    case "GENERATE":
      s.cosmos = generate(s.history.length);
      break;
    case "GOVERN": {
      const rule = s.rules[s.rules.length - 1];
      if (rule) s.cosmos = govern(s.cosmos, rule);
      break;
    }
    default:
      break;
  }
  return s;
}

/**
 * Parse minimal TENSION source into steps.
 * Supports: tension name { becoming: N ... }; name = negotiate(a,b); invert(x); etc.
 * @param {string} source
 * @returns {{ bindings: Record<string, import("./types.js").Tension>, program: { op: string, args?: unknown[] }[] }}
 */
export function parseTensionSource(source) {
  /** @type {Record<string, import("./types.js").Tension>} */
  const bindings = {};
  /** @type {{ op: string, args?: unknown[] }[]} */
  const program = [];

  const lines = source
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"));

  for (const line of lines) {
    const tensionMatch = line.match(/^tension\s+(\w+)\s*\{([^}]+)\}/);
    if (tensionMatch) {
      const name = tensionMatch[1];
      const body = tensionMatch[2];
      /** @type {Partial<import("./types.js").Tension>} */
      const partial = {};
      for (const part of body.split(",")) {
        const m = part.trim().match(/(\w+)\s*:\s*([\d.]+)/);
        if (m) partial[/** @type {keyof import("./types.js").Tension} */ (m[1])] = Number(m[2]);
      }
      bindings[name] = tension(partial);
      continue;
    }

    const assignMatch = line.match(/^(\w+)\s*=\s*(\w+)\((.*)\)/);
    if (assignMatch) {
      const target = assignMatch[1];
      const fn = assignMatch[2];
      const rawArgs = assignMatch[3].split(",").map((a) => a.trim()).filter(Boolean);
      const resolved = rawArgs.map((a) => {
        if (bindings[a]) return bindings[a];
        const num = Number(a);
        if (!Number.isNaN(num)) return num;
        return a;
      });
      program.push({ op: fn, args: resolved });
      if (bindings[target] === undefined && fn === "generate") {
        bindings[target] = generate(resolved[0] ?? target);
      }
      continue;
    }

    const callMatch = line.match(/^(\w+)\((.*)\)/);
    if (callMatch) {
      const fn = callMatch[1];
      const rawArgs = callMatch[2].split(",").map((a) => a.trim()).filter(Boolean);
      const resolved = rawArgs.map((a) => bindings[a] ?? (Number(a) || a));
      program.push({ op: fn, args: resolved });
    }
  }

  return { bindings, program };
}
