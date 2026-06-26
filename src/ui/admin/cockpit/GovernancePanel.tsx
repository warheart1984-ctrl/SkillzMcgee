import React from "react";

export function GovernancePanel({ posture }: { posture?: string }) {
  if (!posture) return null;
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <span style={{ fontSize: "10px", opacity: 0.65, textTransform: "uppercase" }}>
        Posture
      </span>
      <p style={{ margin: "0.25rem 0 0", fontSize: "14px", color: "#d4a853" }}>{posture}</p>
    </div>
  );
}

export default GovernancePanel;
