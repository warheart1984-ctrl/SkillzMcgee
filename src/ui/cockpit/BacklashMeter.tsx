import React from "react";
import { backlashBand } from "./types";
import { columnStyle, h2Style } from "./styles";

const BAND_COLOR = {
  stable: "#10b981",
  unstable: "#f59e0b",
  critical: "#ef4444",
} as const;

const BAND_LABEL = {
  stable: "Stable",
  unstable: "Volatile",
  critical: "Paradox risk",
} as const;

export interface BacklashMeterProps {
  value: number;
}

/**
 * Backlash meter — green 0–2, yellow 3–4, red 5+.
 */
export function BacklashMeter({ value }: BacklashMeterProps) {
  const band = backlashBand(value);
  const color = BAND_COLOR[band];

  return (
    <article style={{ ...columnStyle, marginTop: "0.75rem" }}>
      <h2 style={h2Style}>Backlash</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <meter
          min={0}
          max={10}
          value={value}
          style={{ flex: 1, accentColor: color }}
        />
        <strong style={{ color, minWidth: "1.5rem" }}>{value}</strong>
      </div>
      <span style={{ fontSize: "10px", color, opacity: 0.9 }}>{BAND_LABEL[band]}</span>
    </article>
  );
}

export default BacklashMeter;
