import type { CSSProperties } from "react";

export const panelStyle: CSSProperties = {
  fontFamily: '"JetBrains Mono", "Cascadia Code", Consolas, monospace',
  fontSize: "12px",
  color: "#e2e8f0",
  background: "#0a0e1a",
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
  padding: "1rem 1.25rem 2rem",
  minHeight: "100vh",
};

export const headerStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "1rem",
};

export const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "14px",
  letterSpacing: "0.12em",
};

export const subStyle: CSSProperties = {
  opacity: 0.55,
  fontSize: "10px",
};

export const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "0.75rem",
  maxWidth: "1100px",
  margin: "0 auto",
};

export const columnStyle: CSSProperties = {
  background: "#12182b",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  padding: "0.75rem",
};

export const h2Style: CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "10px",
  letterSpacing: "0.14em",
  opacity: 0.7,
  textTransform: "uppercase",
};

export const btnStyle: CSSProperties = {
  fontFamily: "inherit",
  fontSize: "11px",
  padding: "0.35rem 0.6rem",
  borderRadius: "4px",
  border: "1px solid rgba(34,211,238,0.4)",
  background: "rgba(34,211,238,0.12)",
  color: "#e2e8f0",
  cursor: "pointer",
};

export const btnGhostStyle: CSSProperties = {
  ...btnStyle,
  borderColor: "rgba(255,255,255,0.15)",
  background: "transparent",
};

/** Mode / tension color accents for bars and badges */
export const TENSION_COLORS: Record<string, string> = {
  Becoming: "#22d3ee",
  Resistance: "#ef4444",
  Memory: "#a78bfa",
  Horizon: "#f59e0b",
  Equilibrium: "#10b981",
};
