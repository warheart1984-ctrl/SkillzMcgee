/**
 * Interpretive Face — Governance
 * This module is an interpretive projection over the Negotiant Core.
 * It has no constitutional authority.
 */

/**
 * @param {import("../../tension/types.js").Tension} cosmos
 */
export function view(cosmos) {
  const { becoming, resistance, memory, horizon, equilibrium } = cosmos;

  const tensions = { becoming, resistance, memory, horizon, equilibrium };
  const dominant = Object.entries(tensions).sort((a, b) => b[1] - a[1])[0][0];

  const postureMap = {
    becoming: "Propose",
    resistance: "Refine",
    memory: "Review",
    horizon: "Forecast",
    equilibrium: "Ratify",
  };

  return {
    posture: postureMap[/** @type {keyof typeof postureMap} */ (dominant)],
    pipeline: ["Propose", "Negotiate", "Shift", "Apply", "Record"],
    dominantTension: dominant,
  };
}
