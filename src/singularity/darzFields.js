import { buildDarzTensors } from "./darzTensors.js";
import { groupByLineage } from "./lineage.js";

/**
 * AS-5 — DAR-Z field equations over time × lineage × event-space.
 * @param {import("../governance/types.js").GovernedReceipt[]} ledger
 * @param {import("./nonlinearWave.js").NonlinearWaveState} wave
 * @param {Map<string, import("../governance/types.js").GovernedReceipt[]>} [lineages]
 */
export function solveFieldEquations(ledger, wave, lineages) {
  const groups = lineages ?? groupByLineage(ledger);
  const tensors = buildDarzTensors(ledger);
  const tSteps = ledger.length;

  const F_failure = sampleFailureField(ledger, tSteps);
  const F_environment = sampleEnvironmentField(ledger, tSteps);
  const F_salience = sampleSalienceField(ledger, tSteps, wave);

  const lineageFields = [...groups.entries()].map(([lineageId, chain]) => ({
    lineageId,
    failure: meanField(F_failure.slice(-chain.length)),
    environment: meanField(F_environment.slice(-chain.length)),
    salience: meanField(F_salience.slice(-chain.length)),
  }));

  return {
    F_failure,
    F_environment,
    F_salience,
    lineageFields,
    interference: computeInterference(F_failure, F_environment, F_salience),
    tensors,
    collapse: fieldCollapseScore(F_failure, F_salience),
  };
}

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} ledger
 * @param {number} steps
 */
function sampleFailureField(ledger, steps) {
  const field = [];
  let cumulative = 0;
  for (let t = 0; t < steps; t++) {
    const r = ledger[t];
    const fail = r.status === "error" || r.laws?.allowed === false ? 1 : 0;
    cumulative = cumulative * 0.85 + fail * 0.15;
    field.push({ t, x: t / Math.max(1, steps - 1), value: cumulative });
  }
  return field;
}

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} ledger
 * @param {number} steps
 */
function sampleEnvironmentField(ledger, steps) {
  const field = [];
  for (let t = 0; t < steps; t++) {
    const r = ledger[t];
    const depth = (r.depth ?? 0) / Math.max(1, steps);
    const rejection = r.laws?.allowed === false ? 1 : 0;
    field.push({
      t,
      x: depth,
      value: clamp01(0.5 + rejection * 0.3 - depth * 0.1),
    });
  }
  return field;
}

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} ledger
 * @param {number} steps
 * @param {import("./nonlinearWave.js").NonlinearWaveState} wave
 */
function sampleSalienceField(ledger, steps, wave) {
  const field = [];
  const salienceBase =
    Object.values(wave.w).reduce((a, b) => a + b, 0) /
    Object.values(wave.w).length;

  for (let t = 0; t < steps; t++) {
    const r = ledger[t];
    const ok = r.status === "ok" ? 1 : 0;
    field.push({
      t,
      x: salienceBase,
      value: clamp01(salienceBase * 0.7 + ok * 0.3),
    });
  }
  return field;
}

/**
 * @param {Array<{ value: number }>} a
 * @param {Array<{ value: number }>} b
 * @param {Array<{ value: number }>} c
 */
function computeInterference(a, b, c) {
  const n = Math.min(a.length, b.length, c.length);
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += a[i].value * b[i].value * c[i].value;
  }
  return sum / n;
}

/**
 * @param {Array<{ value: number }>} failure
 * @param {Array<{ value: number }>} salience
 */
function fieldCollapseScore(failure, salience) {
  const f = failure.at(-1)?.value ?? 0;
  const s = salience.at(-1)?.value ?? 0;
  return clamp01(f * (1 - s));
}

/**
 * @param {Array<{ value: number }>} samples
 */
function meanField(samples) {
  if (samples.length === 0) return 0;
  return samples.reduce((s, p) => s + p.value, 0) / samples.length;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}
