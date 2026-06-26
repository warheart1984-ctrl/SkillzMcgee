/**
 * TENSION language — core modal operations.
 */

import { tension } from "./types.js";

/**
 * @param {import("./types.js").Tension} a
 * @param {import("./types.js").Tension} b
 * @returns {import("./types.js").Tension}
 */
export function negotiate(a, b) {
  return tension({
    becoming: (a.becoming + b.becoming) / 2,
    resistance: (a.resistance + b.resistance) / 2,
    memory: (a.memory + b.memory) / 2,
    horizon: (a.horizon + b.horizon) / 2,
    equilibrium: (a.equilibrium + b.equilibrium) / 2,
  });
}

/**
 * @param {import("./types.js").Tension} a
 * @param {number} [max=10]
 * @returns {import("./types.js").Tension}
 */
export function invert(a, max = 10) {
  return tension({
    becoming: max - a.becoming,
    resistance: max - a.resistance,
    memory: max - a.memory,
    horizon: max - a.horizon,
    equilibrium: max - a.equilibrium,
  });
}

/** @returns {import("./types.js").Tension} */
export function dissolve() {
  return tension({ becoming: 0, resistance: 0, memory: 0, horizon: 0, equilibrium: 0 });
}

/**
 * @param {import("./types.js").Tension} a
 * @param {number} factor
 * @returns {import("./types.js").Tension}
 */
export function scale(a, factor) {
  return tension({
    becoming: a.becoming * factor,
    resistance: a.resistance * factor,
    memory: a.memory * factor,
    horizon: a.horizon * factor,
    equilibrium: a.equilibrium * factor,
  });
}

/**
 * @param {number|string} seed
 * @returns {import("./types.js").Tension}
 */
export function generate(seed) {
  const n = typeof seed === "number" ? seed : hashSeed(seed);
  const base = (n % 9) + 1;
  return tension({
    becoming: base,
    resistance: ((base * 3) % 9) + 1,
    memory: ((base * 5) % 9) + 1,
    horizon: ((base * 7) % 9) + 1,
    equilibrium: ((base * 2) % 9) + 1,
  });
}

/**
 * @param {import("./types.js").Tension[]} history
 * @returns {import("./types.js").Tension}
 */
export function rebirth(history) {
  if (history.length === 0) return generate("genesis");
  const last = history[history.length - 1];
  const first = history[0];
  return negotiate(last, invert(first));
}

/**
 * @param {import("./types.js").Tension} a
 * @param {import("./types.js").Tension} b
 * @returns {import("./types.js").Tension}
 */
export function paradox(a, b) {
  return tension({
    becoming: (a.becoming + b.becoming) / 2,
    resistance: Math.abs(a.resistance - b.resistance),
    memory: Math.max(a.memory, b.memory),
    horizon: Math.min(a.horizon, b.horizon),
    equilibrium: (a.equilibrium + b.equilibrium) / 2,
  });
}

/**
 * @param {import("./types.js").Tension} a
 * @returns {import("./types.js").Tension}
 */
export function refuse(a) {
  return { ...a };
}

/**
 * @param {import("./types.js").Tension} cosmos
 * @param {import("./types.js").Tension} rule
 * @returns {import("./types.js").Tension}
 */
export function govern(cosmos, rule) {
  return negotiate(cosmos, rule);
}

/**
 * @param {import("./types.js").Tension} cosmos
 * @param {import("./types.js").Tension} rule
 * @returns {import("./types.js").Tension}
 */
export function author(cosmos, rule) {
  return negotiate(cosmos, scale(rule, 0.5));
}

/**
 * @param {import("./types.js").Tension} cosmos
 * @returns {import("./types.js").Tension}
 */
export function recurse(cosmos) {
  return negotiate(cosmos, scale(cosmos, 0.5));
}

/**
 * Self-negotiation — purest spiral: cosmos(t+1) = negotiate(cosmos(t)).
 * @param {import("./types.js").Tension} cosmos
 * @returns {import("./types.js").Tension}
 */
export function selfNegotiate(cosmos) {
  return negotiate(cosmos, invert(cosmos));
}

/**
 * One cosmological tick — governing equation.
 * @param {import("./types.js").Tension} cosmos
 * @param {import("./types.js").Tension[]} [history=[]]
 * @returns {import("./types.js").Tension}
 */
export function cosmologicalTick(cosmos, history = []) {
  return negotiate(
    invert(cosmos),
    negotiate(
      recurse(cosmos),
      negotiate(
        scale(cosmos, 0.33),
        negotiate(dissolve(), rebirth([...history, cosmos]))
      )
    )
  );
}

/**
 * @param {string} s
 * @returns {number}
 */
function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
