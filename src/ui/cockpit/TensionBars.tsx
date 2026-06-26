import React from "react";
import { TENSION_LABELS, type TensionCosmos } from "./types";
import { TENSION_COLORS, columnStyle, h2Style } from "./styles";

export interface TensionBarsProps {
  tensions: TensionCosmos;
  dominantMode?: string;
  /** Bump on each core tick to re-trigger bar animation */
  tickKey?: number;
}

function scaleMax(tensions: TensionCosmos) {
  return Math.max(10, ...Object.values(tensions));
}

/**
 * Vertical bars for the five tensions — height proportional to value, color-coded.
 */
export function TensionBars({ tensions, dominantMode, tickKey = 0 }: TensionBarsProps) {
  const max = scaleMax(tensions);

  return (
    <article style={columnStyle}>
      <h2 style={h2Style}>Core State</h2>
      <div
        className="tension-bars"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "0.5rem",
          height: "140px",
          marginTop: "0.5rem",
        }}
      >
        {TENSION_LABELS.map(({ key, label }) => {
          const value = tensions[key];
          const pct = Math.min(100, (value / max) * 100);
          const color = TENSION_COLORS[label] ?? "#475569";
          const isDominant = label === dominantMode;

          return (
            <div
              key={key}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
              }}
            >
              <span style={{ fontSize: "10px", marginBottom: "0.25rem" }}>{value}</span>
              <div
                style={{
                  flex: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "4px 4px 0 0",
                }}
              >
                <div
                  key={`${key}-${tickKey}`}
                  className="tension-bar-fill"
                  style={{
                    width: "100%",
                    height: `${pct}%`,
                    background: isDominant
                      ? `linear-gradient(to top, ${color}, ${color}99)`
                      : `linear-gradient(to top, ${color}88, ${color}44)`,
                    borderRadius: "4px 4px 0 0",
                    boxShadow: isDominant ? `0 0 12px ${color}55` : undefined,
                    animation: "tension-rise 0.35s ease-out",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "9px",
                  marginTop: "0.35rem",
                  opacity: isDominant ? 1 : 0.65,
                  color: isDominant ? color : undefined,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes tension-rise {
          from { height: 0%; opacity: 0.5; }
          to { opacity: 1; }
        }
      `}</style>
    </article>
  );
}

export default TensionBars;
