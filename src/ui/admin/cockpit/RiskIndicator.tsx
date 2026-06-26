import React from "react";

export function RiskIndicator({ value }: { value: number }) {
  let color = "#10b981";
  if (value >= 3) color = "#ef4444";
  else if (value >= 2) color = "#f59e0b";

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <span style={{ fontSize: "10px", opacity: 0.65, textTransform: "uppercase" }}>
        Risk
      </span>
      <p style={{ margin: "0.25rem 0 0", fontSize: "18px", fontWeight: 700, color }}>
        {value}
      </p>
    </div>
  );
}

export default RiskIndicator;
