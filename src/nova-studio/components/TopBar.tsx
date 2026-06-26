import React from "react";

export interface TopBarProps {
  operatorId: string;
  online?: boolean;
  capabilityCount?: number;
  receiptCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  operatorId,
  online = false,
  capabilityCount = 0,
  receiptCount = 0,
}) => (
  <header className="ns-top-strip">
    <span className="ns-brand">Nova Studio</span>
    <span className="ns-operator">{operatorId}</span>
    <span className={`ns-runtime-pill ${online ? "ns-online" : "ns-offline"}`}>
      {online ? "Runtime OK" : "Runtime offline"}
    </span>
    <span className="ns-meta">
      {capabilityCount} caps · {receiptCount} receipts
    </span>
  </header>
);
