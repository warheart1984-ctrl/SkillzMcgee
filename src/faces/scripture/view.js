/**
 * Interpretive Face — Scripture
 * This module is an interpretive projection over the Negotiant Core.
 * It has no constitutional authority.
 */

/**
 * @param {import("../../tension/types.js").Tension} cosmos
 */
export function view(cosmos) {
  const { becoming, resistance, memory, horizon, equilibrium } = cosmos;

  const sequence = [
    ["Becoming", becoming],
    ["Resistance", resistance],
    ["Memory", memory],
    ["Horizon", horizon],
    ["Equilibrium", equilibrium],
  ].sort((a, b) => b[1] - a[1]);

  const [firstName] = sequence[0];

  return {
    verse: `And the Tension of ${firstName} rose above the others, and the world bent accordingly.`,
    ordering: sequence.map(([name]) => name),
  };
}
