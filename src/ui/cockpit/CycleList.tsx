import React from "react";
import { TENSION_LABELS, type TensionCosmos } from "./types";
import { columnStyle, h2Style } from "./styles";

export interface CycleListProps {
  cycle: TensionCosmos;
}

/**
 * Sorted tension cycle (high → low).
 */
export function CycleList({ cycle }: CycleListProps) {
  const sorted = TENSION_LABELS.map(({ key, label }) => ({
    label,
    value: cycle[key],
  })).sort((a, b) => b.value - a.value);

  return (
    <article style={columnStyle}>
      <h2 style={h2Style}>Cycle</h2>
      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {sorted.map(({ label, value }) => (
          <li
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0.25rem 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span>{label}</span>
            <span>{value}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default CycleList;
