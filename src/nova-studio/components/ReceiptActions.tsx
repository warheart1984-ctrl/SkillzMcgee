import React from "react";
import { Link } from "react-router-dom";

interface ReceiptActionsProps {
  receiptId: string;
  continuityCheckpoint?: string;
  onReplaySlice?: () => void;
  onReplayContinuity?: () => void;
  compact?: boolean;
}

export const ReceiptActions: React.FC<ReceiptActionsProps> = ({
  receiptId,
  continuityCheckpoint,
  onReplaySlice,
  onReplayContinuity,
  compact,
}) => (
  <div className={`ns-receipt-actions ${compact ? "ns-receipt-actions-compact" : ""}`}>
    <Link className="ns-button-link" to={`/nova/studio/investigate?receipt=${encodeURIComponent(receiptId)}`}>
      Investigate
    </Link>
    <Link className="ns-button-link" to={`/nova/studio/audit?receipt=${encodeURIComponent(receiptId)}`}>
      Auditor
    </Link>
    {onReplaySlice && (
      <button type="button" className="ns-button-link" onClick={onReplaySlice}>
        Replay Slice
      </button>
    )}
    {onReplayContinuity && continuityCheckpoint && (
      <button type="button" className="ns-button-link" onClick={onReplayContinuity}>
        Replay Continuity
      </button>
    )}
  </div>
);
