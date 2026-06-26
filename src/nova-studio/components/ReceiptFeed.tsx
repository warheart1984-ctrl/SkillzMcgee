import React, { useState } from "react";
import { useSubstrateEvents } from "../hooks/useSubstrateEvents";
import { ReceiptActions } from "./ReceiptActions";

export const ReceiptFeed: React.FC = () => {
  const { receipts } = useSubstrateEvents();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replayResult, setReplayResult] = useState<Record<string, unknown> | null>(null);

  async function replaySlice(receiptId: string) {
    const res = await fetch("/api/slice/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiptId }),
    });
    const json = await res.json();
    setReplayResult(json);
    setSelectedId(receiptId);
  }

  async function replayContinuity(checkpoint: string) {
    const res = await fetch("/api/continuity/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkpoint }),
    });
    const json = await res.json();
    console.log("Continuity replay:", json);
    alert("Continuity replay complete — see console for details.");
  }

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Governance Receipts</div>
      <div className="ns-receipts-list">
        {receipts.length === 0 && (
          <div className="ns-receipt-row ns-receipt-empty">No receipts yet</div>
        )}
        {receipts.map((r) => (
          <div
            key={r.id}
            className={`ns-receipt-row ${selectedId === r.id ? "ns-receipt-selected" : ""}`}
            onClick={() => setSelectedId(r.id)}
            onKeyDown={(e) => e.key === "Enter" && setSelectedId(r.id)}
            role="button"
            tabIndex={0}
          >
            <div className="ns-receipt-meta">
              <span className="ns-receipt-time">{r.timestamp}</span>
              <span className="ns-receipt-slice">{r.capabilityId}</span>
              <code className="ns-receipt-id">{r.id}</code>
              {r.invariantViolations && r.invariantViolations.length > 0 && (
                <span className="ns-receipt-violations">
                  {r.invariantViolations.join(", ")}
                </span>
              )}
            </div>
            <div className={`ns-receipt-status ns-status-${r.status}`}>{r.status}</div>
            {selectedId === r.id && (
              <ReceiptActions
                receiptId={r.id}
                continuityCheckpoint={r.continuityCheckpoint}
                onReplaySlice={() => void replaySlice(r.id)}
                onReplayContinuity={() => void replayContinuity(r.continuityCheckpoint ?? r.timestamp)}
              />
            )}
          </div>
        ))}
      </div>
      {replayResult && (
        <pre className="ns-envelope-detail">{JSON.stringify(replayResult, null, 2)}</pre>
      )}
    </div>
  );
};
