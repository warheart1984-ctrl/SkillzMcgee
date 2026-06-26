export interface DriftPoint {
  t: number;
  expected: number;
  actual: number;
}

export function computeDrift(p: DriftPoint): number {
  return p.actual - p.expected;
}

export function driftMagnitude(p: DriftPoint): number {
  return Math.abs(computeDrift(p));
}

export function driftBands(points: DriftPoint[]) {
  const drifts = points.map(computeDrift);
  const mean =
    drifts.reduce((acc, d) => acc + d, 0) / (drifts.length || 1);
  const variance =
    drifts.reduce((acc, d) => acc + (d - mean) ** 2, 0) /
    (drifts.length || 1);
  const std = Math.sqrt(variance);
  return { mean, std, upper: mean + 2 * std, lower: mean - 2 * std };
}

export function driftSummary(points: DriftPoint[]) {
  const drifts = points.map(computeDrift);
  return {
    max: Math.max(...drifts),
    min: Math.min(...drifts),
    maxAbs: Math.max(...drifts.map(Math.abs)),
    mean: drifts.reduce((a, b) => a + b, 0) / (drifts.length || 1),
  };
}

export function detectAnomalies(points: DriftPoint[]) {
  const { upper, lower } = driftBands(points);
  return points.filter((p) => {
    const d = computeDrift(p);
    return d > upper || d < lower;
  });
}
