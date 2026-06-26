/**
 * Interpretive Face — Language
 * This module is an interpretive projection over the Negotiant Core.
 * It has no constitutional authority.
 */

/**
 * @param {import("../../tension/types.js").Tension} cosmos
 */
export function view(cosmos) {
  return {
    reducer: "coreTick",
    equation: "cosmos(t+1) = coreTick(cosmos(t))",
    equivalent: "cosmos(t+1) = selfNegotiate(cosmos(t))",
    input: { ...cosmos },
    phases: ["negotiate", "invert", "scale", "dissolve", "rebirth", "paradox"],
  };
}
