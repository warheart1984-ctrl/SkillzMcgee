import React from "react";
import type { DriftPoint } from "../lib/driftMath";
import {
  computeDrift,
  driftBands,
  detectAnomalies,
} from "../lib/driftMath";

export const DriftVisualizer: React.FC<{ points: DriftPoint[] }> = ({
  points,
}) => {
  if (points.length === 0) {
    return (
      <div className="ns-panel ns-drift">
        <div className="ns-panel-title">Drift Visualizer</div>
        <p className="ns-drift-empty">No drift points loaded</p>
      </div>
    );
  }

  const bands = driftBands(points);
  const anomalies = detectAnomalies(points);
  const bandHeight = Math.max(bands.upper - bands.lower, 1);

  return (
    <div className="ns-panel ns-drift">
      <div className="ns-panel-title">Drift Visualizer</div>
      <svg width="100%" height="80" viewBox="0 0 100 40" className="ns-drift-chart">
        <rect
          x="0"
          y={20 - bands.upper}
          width="100"
          height={bandHeight}
          fill="rgba(56,189,248,0.08)"
        />
        {points.map((p, i) => {
          const x = (i / Math.max(points.length - 1, 1)) * 100;
          const y = 20 - computeDrift(p);
          const next = points[i + 1];
          if (!next) return null;
          const nx = ((i + 1) / Math.max(points.length - 1, 1)) * 100;
          const ny = 20 - computeDrift(next);
          return (
            <line
              key={p.t}
              x1={x}
              y1={y}
              x2={nx}
              y2={ny}
              stroke="#38bdf8"
              strokeWidth={0.8}
            />
          );
        })}
      </svg>
      <ul className="ns-drift-anomalies">
        {anomalies.length === 0 && <li>No anomalies detected</li>}
        {anomalies.map((a) => (
          <li key={a.t}>
            t={a.t} expected={a.expected} actual={a.actual} drift=
            {computeDrift(a)}
          </li>
        ))}
      </ul>
    </div>
  );
};
