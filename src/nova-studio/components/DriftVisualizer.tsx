import React from "react";

interface DriftPoint {
  expected: number;
  actual: number;
}

function computeDrift(p: DriftPoint): number {
  return p.actual - p.expected;
}

export const DriftVisualizer: React.FC = () => {
  const points: DriftPoint[] = [
    { expected: 42, actual: 42 },
    { expected: 42, actual: 40 },
    { expected: 42, actual: 50 },
  ];
  const drifts = points.map(computeDrift);
  const maxAbs = Math.max(...drifts.map((d) => Math.abs(d)));

  return (
    <div className="novaStudio-drift">
      <h3>Drift Visualizer</h3>
      <ul>
        {points.map((p, i) => (
          <li key={i}>
            expected {p.expected}, actual {p.actual}, drift {drifts[i]}
          </li>
        ))}
      </ul>
      <p>max |drift| = {maxAbs}</p>
    </div>
  );
};
