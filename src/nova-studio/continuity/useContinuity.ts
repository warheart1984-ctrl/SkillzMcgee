import { useEffect, useState } from "react";

export interface ReceiptSummary {
  id: string;
  sliceId?: string;
  capability?: string;
  timestamp?: string;
  status?: string;
}

export interface TimelineEvent {
  id: string;
  kind?: string;
  label?: string;
  timestamp?: string;
  receiptId?: string;
}

export function useContinuity() {
  const [receipts, setReceipts] = useState<ReceiptSummary[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const refresh = () => {
    void fetch("/api/receipts/index")
      .then((r) => r.json())
      .then((data) => setReceipts(Array.isArray(data) ? data : (data.receipts ?? [])))
      .catch(() =>
        fetch("/runtime/receipts/index.json")
          .then((r) => r.json())
          .then(setReceipts)
          .catch(() => setReceipts([])),
      );

    void fetch("/api/continuity")
      .then((r) => r.json())
      .then((data) => setTimeline(data.timeline ?? []))
      .catch(() =>
        fetch("/runtime/continuity/timeline.json")
          .then((r) => r.json())
          .then(setTimeline)
          .catch(() => setTimeline([])),
      );
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, []);

  return { receipts, timeline, refresh };
}
