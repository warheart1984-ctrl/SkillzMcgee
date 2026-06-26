import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { InvestigationReceiptView } from "./InvestigationReceiptView";
import { InvestigationDecisionView } from "./InvestigationDecisionView";

export const InvestigationPage: React.FC = () => {
  const [params] = useSearchParams();
  const receiptId = params.get("receipt");
  const decisionId = params.get("decision");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setData(null);
    setError(null);
    if (receiptId) {
      void fetch(`/api/investigation/receipt/${encodeURIComponent(receiptId)}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.error) setError(j.error);
          else setData(j);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
    } else if (decisionId) {
      void fetch(`/api/investigation/decision/${encodeURIComponent(decisionId)}`)
        .then((r) => r.json())
        .then((j) => {
          if (j.error) setError(j.error);
          else setData(j);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
    }
  }, [receiptId, decisionId]);

  if (!receiptId && !decisionId) {
    return (
      <div className="ns-panel">
        <p className="ns-meta">Provide ?receipt= or ?decision= query parameter.</p>
      </div>
    );
  }

  if (error) return <div className="ns-panel ns-error">{error}</div>;
  if (!data) return <div className="ns-panel">Loading investigation…</div>;

  if (data.type === "receipt") {
    return <InvestigationReceiptView data={data} />;
  }
  if (data.type === "decision") {
    return <InvestigationDecisionView data={data} />;
  }

  return <div className="ns-panel">Invalid investigation target</div>;
};
