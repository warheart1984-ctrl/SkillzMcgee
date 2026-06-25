/**
 * AS-4 — Nonlinear wave solver
 */

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

export function stepWave(prevWave, event) {
  const { amplitude, momentum } = prevWave;

  const delta = event.salience - event.failure;
  const newMomentum = momentum + delta;
  const newAmplitude = amplitude + newMomentum * 0.1;

  return {
    amplitude: clamp(newAmplitude, -1, 1),
    momentum: clamp(newMomentum, -2, 2),
  };
}

export function integrateWave(ledger) {
  let wave = { amplitude: 0, momentum: 0 };
  for (const r of ledger) {
    const event = {
      salience: r.meta?.salience ?? 0,
      failure: r.meta?.failure ?? 0,
    };
    wave = stepWave(wave, event);
  }
  return wave;
}
