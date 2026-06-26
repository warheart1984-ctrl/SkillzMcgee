/** JPA-1 judgment dimensions — Wave Math state vector w_t. */
export const JUDGMENT_DIMENSIONS = [
  "perception",
  "interpretation",
  "valuation",
  "deliberation",
  "commitment",
  "reflection",
];

/**
 * @typedef {Record<typeof JUDGMENT_DIMENSIONS[number], number>} WaveVector
 */

/**
 * @returns {WaveVector}
 */
export function emptyWaveVector() {
  return {
    perception: 0.5,
    interpretation: 0.5,
    valuation: 0.5,
    deliberation: 0.5,
    commitment: 0.5,
    reflection: 0.5,
  };
}

/**
 * @param {number} v
 */
function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Evidence e_t decoded from a governed receipt.
 * @param {import("../governance/types.js").GovernedReceipt} receipt
 */
export function evidenceFromReceipt(receipt) {
  const intent =
    receipt.intent && typeof receipt.intent === "object"
      ? receipt.intent
      : {};
  return {
    raw: intent,
    outcome: receipt.output,
    status: receipt.status,
    allowed: receipt.laws?.allowed === true,
    timestamp: receipt.timestamp,
    confidence:
      typeof intent.confidence === "number"
        ? clamp01(intent.confidence)
        : 0.5,
  };
}

/**
 * Map one receipt to a local judgment vector (R step: decode context).
 * @param {import("../governance/types.js").GovernedReceipt} receipt
 * @returns {WaveVector}
 */
export function stateVectorFromReceipt(receipt) {
  const allowed = receipt.laws?.allowed === true ? 1 : 0;
  const ok = receipt.status === "ok" ? 1 : 0;
  const violationLoad = Math.min(
    1,
    (receipt.laws?.violations?.length ?? 0) * 0.25
  );
  const intent =
    receipt.intent && typeof receipt.intent === "object"
      ? receipt.intent
      : {};
  const confidence =
    typeof intent.confidence === "number"
      ? clamp01(intent.confidence)
      : 0.5;

  return {
    perception: ok,
    interpretation: allowed,
    valuation: confidence,
    deliberation: clamp01(1 - violationLoad),
    commitment: clamp01(allowed * ok),
    reflection: receipt.slice === "nova" || receipt.slice === "analysis" ? 0.8 : 0.55,
  };
}

/**
 * Wave Math update F(w_t, e_t) — deterministic, no Date.now().
 * @param {WaveVector} w_t
 * @param {ReturnType<typeof evidenceFromReceipt>} e_t
 * @returns {WaveVector}
 */
export function waveStep(w_t, e_t) {
  const statusDelta = e_t.status === "ok" ? 0.1 : -0.15;
  const allowDelta = e_t.allowed ? 0.08 : -0.12;

  return {
    perception: clamp01(w_t.perception * 0.9 + (e_t.status === "ok" ? 0.1 : 0)),
    interpretation: clamp01(
      w_t.interpretation * 0.85 + e_t.confidence * 0.15 + allowDelta
    ),
    valuation: clamp01(w_t.valuation * 0.9 + statusDelta),
    deliberation: clamp01(w_t.deliberation * 0.95 + 0.05),
    commitment: clamp01(w_t.commitment * 0.9 + (e_t.allowed && e_t.status === "ok" ? 0.1 : 0)),
    reflection: clamp01(w_t.reflection * 0.92 + 0.08),
  };
}

/**
 * Fold ledger into final wave state by sequential F applications.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function foldWaveState(entries) {
  let w_t = emptyWaveVector();
  for (const receipt of entries) {
    w_t = waveStep(w_t, evidenceFromReceipt(receipt));
  }
  return w_t;
}

/**
 * Reconstruction operator R(τ) — estimate (ŵ_t, ŵ_{t+1}, F̂) from one receipt.
 * @param {import("../governance/types.js").GovernedReceipt} receipt
 */
export function reconstructFromReceipt(receipt) {
  const w_t = stateVectorFromReceipt(receipt);
  const e_t = evidenceFromReceipt(receipt);
  const w_t1 = waveStep(w_t, e_t);
  return { w_t, w_t1, operator: "F-hat-linear-v0" };
}
