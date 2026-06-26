import React from "react";
import { useGovernanceReceipts } from "../hooks/useGovernanceReceipts";

export const ReceiptFeed: React.FC = () => {
  const receipts = useGovernanceReceipts();
  return (
    <div className="novaStudio-receipts">
      <h3>Governance Receipts</h3>
      <ul>
        {receipts.length === 0 && <li>No receipts yet</li>}
        {receipts.map((r) => (
          <li key={r.id}>
            <span>{r.timestamp}</span> — <strong>{r.slice}</strong> —{" "}
            <em>{r.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};
