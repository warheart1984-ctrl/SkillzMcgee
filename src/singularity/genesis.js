import { sha256Hex } from "./sha256.js";
import { canonicalJson } from "./receiptHash.js";

/**
 * AS-Ω — Genesis-of-Genesis operator H_Ω.
 * Generates the operator that generates world-operators from fold state.
 * @param {object} partial
 */
export function genesisOperator(partial) {
  const seed = canonicalJson({
    merkle: partial.merkle?.globalRoot ?? null,
    wave: partial.wave?.terminal?.w ?? partial.wave?.w_t ?? null,
    lineages: partial.lineages ? Object.keys(partial.lineages).length : 0,
    attractors: partial.attractors?.length ?? 0,
  });

  return {
    id: "H-Ω",
    generates: "world-operator",
    fingerprint: sha256Hex(seed),
    depth: "genesis-of-genesis",
    seedPreview: seed.slice(0, 64),
  };
}
