import React from "react";
import { TENSION_COLORS } from "../../cockpit/styles";

const TIER_BORDER: Record<string, string> = {
  Prime: "#10b981",
  "Anti-Prime": "#22d3ee",
  Paradox: "#f59e0b",
  Return: "#ef4444",
  "Hyper-Prime": "#a855f7",
};

export interface ZoneTileProps {
  name: string;
  mode?: string;
  tier?: string;
  backlash?: number;
  selected?: boolean;
  onSelect?: () => void;
}

export function ZoneTile({
  name,
  mode,
  tier,
  backlash = 0,
  selected,
  onSelect,
}: ZoneTileProps) {
  const tierColor = TIER_BORDER[tier ?? "Prime"] ?? "#475569";
  const modeColor = TENSION_COLORS[mode ?? ""] ?? "#94a3b8";
  const glow =
    backlash >= 5 ? "0 0 12px #ef4444" : backlash >= 3 ? "0 0 8px #f59e0b" : "none";

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        padding: "0.75rem",
        borderRadius: "6px",
        border: `2px solid ${tierColor}`,
        boxShadow: glow,
        background: selected ? "rgba(34,211,238,0.12)" : "#12182b",
        color: "#e2e8f0",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        fontFamily: "inherit",
      }}
    >
      <strong>{name}</strong>
      <div style={{ fontSize: "10px", marginTop: "0.35rem", color: modeColor }}>
        {mode ?? "—"}
      </div>
      <div style={{ fontSize: "10px", opacity: 0.7 }}>{tier ?? "—"} · backlash {backlash}</div>
    </button>
  );
}

export default ZoneTile;
