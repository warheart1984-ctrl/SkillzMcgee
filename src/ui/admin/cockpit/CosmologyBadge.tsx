import React from "react";

const TIER_COLORS: Record<string, string> = {
  Prime: "#10b981",
  "Anti-Prime": "#22d3ee",
  Paradox: "#f59e0b",
  Return: "#ef4444",
  "Hyper-Prime": "#a855f7",
};

export function CosmologyBadge({ tier }: { tier?: string }) {
  if (!tier) return null;
  const color = TIER_COLORS[tier] ?? "#94a3b8";
  return (
    <div
      style={{
        display: "inline-block",
        padding: "0.35rem 0.75rem",
        borderRadius: "4px",
        border: `1px solid ${color}`,
        color,
        fontSize: "11px",
        fontWeight: 600,
      }}
    >
      {tier}
    </div>
  );
}

export default CosmologyBadge;
