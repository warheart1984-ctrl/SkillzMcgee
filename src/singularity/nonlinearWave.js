import {
  JUDGMENT_DIMENSIONS,
  emptyWaveVector,
  evidenceFromReceipt,
} from "./waveMath.js";

/**
 * @typedef {Object} NonlinearWaveState
 * @property {import("./waveMath.js").WaveVector} w
 * @property {import("./waveMath.js").WaveVector} velocity
 * @property {import("./waveMath.js").WaveVector} acceleration
 */

/**
 * @returns {NonlinearWaveState}
 */
export function emptyNonlinearState() {
  return {
    w: emptyWaveVector(),
    velocity: zeroVector(),
    acceleration: zeroVector(),
  };
}

/** @returns {import("./waveMath.js").WaveVector} */
function zeroVector() {
  return Object.fromEntries(JUDGMENT_DIMENSIONS.map((d) => [d, 0]));
}

/**
 * @param {number} v
 */
function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Event tensor force from evidence e_t.
 * @param {ReturnType<typeof evidenceFromReceipt>} e_t
 */
function eventForce(e_t) {
  const sign = e_t.status === "ok" && e_t.allowed ? 1 : -1;
  const amp = e_t.confidence * sign;
  return {
    perception: 0.12 * amp,
    interpretation: 0.1 * amp,
    valuation: 0.15 * amp,
    deliberation: 0.08 * amp,
    commitment: 0.11 * amp,
    reflection: 0.09 * amp,
  };
}

/**
 * AS-4 — Nonlinear wave step: w_{t+1} = f(w_t, e_t, ∂w/∂t, ∂²w/∂t²)
 * @param {NonlinearWaveState} state
 * @param {ReturnType<typeof evidenceFromReceipt>} e_t
 * @param {number} [dt]
 */
export function nonlinearWaveStep(state, e_t, dt = 1) {
  const force = eventForce(e_t);
  const stiffness = 0.65;
  const damping = 0.18;
  const resonance = 0.05;

  /** @type {import("./waveMath.js").WaveVector} */
  const w = { ...state.w };
  /** @type {import("./waveMath.js").WaveVector} */
  const velocity = { ...state.velocity };
  /** @type {import("./waveMath.js").WaveVector} */
  const acceleration = { ...state.acceleration };

  for (const dim of JUDGMENT_DIMENSIONS) {
    const accel =
      force[dim] -
      stiffness * state.w[dim] -
      damping * state.velocity[dim] +
      resonance * Math.sin(state.w[dim] * Math.PI * 2);
    acceleration[dim] = accel;
    velocity[dim] = state.velocity[dim] + accel * dt;
    w[dim] = clamp01(state.w[dim] + velocity[dim] * dt);
  }

  return { w, velocity, acceleration };
}

/**
 * Integrate nonlinear wave over receipt sequence.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function integrateNonlinearWave(entries) {
  let state = emptyNonlinearState();
  /** @type {NonlinearWaveState[]} */
  const trajectory = [];

  for (const receipt of entries) {
    state = nonlinearWaveStep(state, evidenceFromReceipt(receipt));
    trajectory.push({
      w: { ...state.w },
      velocity: { ...state.velocity },
      acceleration: { ...state.acceleration },
    });
  }

  return { terminal: state, trajectory };
}

/**
 * Detect attractors — low-velocity stable points in trajectory.
 * @param {NonlinearWaveState[]} trajectory
 */
export function detectAttractors(trajectory) {
  if (trajectory.length === 0) return [];
  const threshold = 0.02;
  /** @type {Array<{ index: number, w: import("./waveMath.js").WaveVector }>} */
  const attractors = [];

  for (let i = 1; i < trajectory.length; i++) {
    const v = trajectory[i].velocity;
    const speed =
      JUDGMENT_DIMENSIONS.reduce((s, d) => s + Math.abs(v[d]), 0) /
      JUDGMENT_DIMENSIONS.length;
    if (speed < threshold) {
      attractors.push({ index: i, w: { ...trajectory[i].w } });
    }
  }

  if (attractors.length === 0 && trajectory.length > 0) {
    attractors.push({
      index: trajectory.length - 1,
      w: { ...trajectory.at(-1).w },
    });
  }
  return attractors;
}

/**
 * Phase transition flag — acceleration spike across dimensions.
 * @param {NonlinearWaveState} state
 */
export function detectPhaseTransition(state) {
  const avgAccel =
    JUDGMENT_DIMENSIONS.reduce((s, d) => s + Math.abs(state.acceleration[d]), 0) /
    JUDGMENT_DIMENSIONS.length;
  return avgAccel > 0.25;
}
