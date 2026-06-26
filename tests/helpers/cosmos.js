import {
  isValidCosmos,
  cloneCosmos,
  TENSION_KEYS,
  STABILITY_BOUND,
} from "../../src/cosmology/core_contract.js";

export { isValidCosmos, cloneCosmos, TENSION_KEYS, STABILITY_BOUND };

/**
 * @param {Partial<import("../../src/tension/types.js").Tension>} partial
 * @returns {import("../../src/tension/types.js").Tension}
 */
export function cosmos(partial = {}) {
  return {
    becoming: partial.becoming ?? 1,
    resistance: partial.resistance ?? 1,
    memory: partial.memory ?? 1,
    horizon: partial.horizon ?? 1,
    equilibrium: partial.equilibrium ?? 1,
  };
}
