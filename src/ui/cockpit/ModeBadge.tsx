import React from "react";
import { TENSION_COLORS, columnStyle, h2Style } from "./styles";

export interface ModeBadgeProps {
  mode: string;
  archetype?: string;
  /** Changes trigger pulse animation */
  tickKey?: number;
}

/**
 * Pill-shaped mode badge — color = dominant tension, pulse on mode change.
 */
export function ModeBadge({ mode, archetype, tickKey = 0 }: ModeBadgeProps) {
  const color = TENSION_COLORS[mode] ?? "#22d3ee";

  return (
    <article style={columnStyle}>
      <h2 style={h2Style}>Mode</h2>
      <div
        key={`mode-${tickKey}-${mode}`}
        className="mode-badge"
        style={{
          display: "inline-block",
          padding: "0.5rem 1.25rem",
          borderRadius: "999px",
          border: `1px solid ${color}88`,
          background: `${color}22`,
          color,
          fontWeight: 700,
          fontSize: "16px",
          textAlign: "center",
          width: "100%",
          animation: "mode-pulse 0.6s ease-out",
        }}
      >
        {mode}
      </div>
      {archetype ? (
        <p style={{ textAlign: "center", margin: "0.5rem 0 0", color: "#d4a853" }}>
          {archetype}
        </p>
      ) : null}
      <style>{`
        @keyframes mode-pulse {
          0% { transform: scale(0.92); opacity: 0.6; }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </article>
  );
}

export default ModeBadge;
