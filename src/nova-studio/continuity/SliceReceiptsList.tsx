import React from "react";
import { useContinuity } from "./ContinuityContext";

export const SliceReceiptsList: React.FC = () => {
  const { receipts } = useContinuity();

  return (
    <div className="ns-panel ns-receipts-list">
      <h3>Recent Receipts</h3>
      {!receipts.length && <div className="ns-meta">No receipts found</div>}
      <ul className="ns-receipt-rows">
        {receipts.map((r) => (
          <li key={r.id}>
            <strong>{r.id}</strong>
            <span className="ns-meta">
              {r.sliceId ?? r.capability ?? "—"} · {r.timestamp ?? "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
