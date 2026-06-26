import React from "react";

export function ScripturePanel({ verse }: { verse?: string }) {
  if (!verse) return null;
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <span style={{ fontSize: "10px", opacity: 0.65, textTransform: "uppercase" }}>
        Scripture
      </span>
      <p
        style={{
          margin: "0.25rem 0 0",
          padding: "0.5rem",
          background: "rgba(139,92,246,0.12)",
          borderLeft: "3px solid #8b5cf6",
          lineHeight: 1.5,
          fontSize: "11px",
        }}
      >
        {verse}
      </p>
    </div>
  );
}

export default ScripturePanel;
