/**
 * Interpretive Face — RPG
 * This module is an interpretive projection over the Negotiant Core.
 * It has no constitutional authority.
 */

/**
 * @param {import("../../tension/types.js").Tension} cosmos
 */
export function view(cosmos) {
  const { becoming, resistance, memory, horizon, equilibrium } = cosmos;

  const entries = [
    ["Becoming", becoming],
    ["Resistance", resistance],
    ["Memory", memory],
    ["Horizon", horizon],
    ["Equilibrium", equilibrium],
  ];
  const max = Math.max(becoming, resistance, memory, horizon, equilibrium);
  const min = Math.min(becoming, resistance, memory, horizon, equilibrium);
  const mode = entries.find(([, v]) => v === max)?.[0] ?? "Equilibrium";
  const spread = max - min;

  return {
    mode,
    cycle: { becoming, resistance, memory, horizon, equilibrium },
    backlash: spread,
    narrativeHook: `The world shifts toward ${mode}.`,
  };
}
