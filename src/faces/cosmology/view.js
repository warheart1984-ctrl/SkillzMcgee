/**
 * Interpretive Face — Cosmology
 * This module is an interpretive projection over the Negotiant Core.
 * It has no constitutional authority.
 */

/**
 * @param {import("../../tension/types.js").Tension} cosmos
 */
export function view(cosmos) {
  const { becoming, resistance, memory, horizon, equilibrium } = cosmos;

  const sum = becoming + resistance + memory + horizon + equilibrium;
  const avg = sum / 5;

  let tier;
  if (avg < 2) tier = "Prime";
  else if (avg < 4) tier = "Anti-Prime";
  else if (avg < 6) tier = "Paradox";
  else if (avg < 8) tier = "Return";
  else tier = "Hyper-Prime";

  return {
    tier,
    metrics: { sum, avg },
    tensions: { becoming, resistance, memory, horizon, equilibrium },
  };
}
