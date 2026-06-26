import React from "react";
import { btnGhostStyle, btnStyle, columnStyle, h2Style } from "./styles";

export interface ControlsProps {
  onSpin: (ticks: number) => void;
  onReset: () => void;
  faces?: string[];
  activeFace?: string;
  onProjectFace?: (face: string) => void;
}

/**
 * Cockpit controls — spin, reset, optional face projection dropdown.
 */
export function Controls({
  onSpin,
  onReset,
  faces = [],
  activeFace = "rpg",
  onProjectFace,
}: ControlsProps) {
  return (
    <article style={{ ...columnStyle, marginTop: "0.75rem" }}>
      <h2 style={h2Style}>Controls</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" style={btnStyle} onClick={() => onSpin(1)}>
          Spin +1
        </button>
        <button type="button" style={btnStyle} onClick={() => onSpin(5)}>
          Spin +5
        </button>
        <button type="button" style={btnGhostStyle} onClick={onReset}>
          Reset
        </button>
      </div>
      {faces.length > 0 && onProjectFace ? (
        <label style={{ display: "block", marginTop: "0.5rem", fontSize: "10px" }}>
          <span style={{ opacity: 0.7 }}>Project Face</span>
          <select
            value={activeFace}
            onChange={(e) => onProjectFace(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: "0.25rem",
              fontFamily: "inherit",
              fontSize: "11px",
              background: "#0a0e1a",
              color: "#e2e8f0",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "4px",
              padding: "0.35rem",
            }}
          >
            {faces.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </article>
  );
}

export default Controls;
