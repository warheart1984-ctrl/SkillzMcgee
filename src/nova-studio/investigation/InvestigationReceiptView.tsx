import React from "react";
import { Link } from "react-router-dom";

export const InvestigationReceiptView: React.FC<{ data: Record<string, unknown> }> = ({
  data,
}) => {
  const receipt = data.receipt as Record<string, unknown>;
  const lineage = data.lineage;
  const impact = data.impact as string[];
  const anomalies = (data.anomalies as Array<Record<string, unknown>>) ?? [];
  const continuity = data.continuity;
  const verdict = (data.verdict ?? receipt.verdict) as Record<string, unknown> | undefined;
  const provenance = (data.provenance ?? receipt.provenance) as Record<string, unknown> | undefined;

  const anomaly = anomalies.find((a) => a.id === receipt.id);
  const proofGraph = provenance?.proofGraph as Record<string, unknown> | undefined;

  return (
    <div className="ns-investigation">
      <h2 className="ns-mode-title">Receipt Investigation: {String(receipt.id)}</h2>

      <section className="ns-panel">
        <h3>Summary</h3>
        <pre className="ns-envelope-detail">{JSON.stringify(receipt, null, 2)}</pre>
      </section>

      {verdict && (
        <section className="ns-panel">
          <h3>Law Kernel Verdict</h3>
          <p className={verdict.ok ? "ns-status-ok" : "ns-status-error"}>
            {verdict.ok ? "OK" : "Drift or violations detected"}
          </p>
          {(verdict.drift as unknown[])?.length > 0 && (
            <div className="ns-drift-warning">
              <pre>{JSON.stringify(verdict.drift, null, 2)}</pre>
            </div>
          )}
        </section>
      )}

      <section className="ns-panel">
        <h3>Lineage Tree</h3>
        <pre className="ns-envelope-detail">{JSON.stringify(lineage, null, 2)}</pre>
      </section>

      {proofGraph && (
        <section className="ns-panel">
          <h3>Proof Graph Links</h3>
          <ul className="ns-link-list">
            <li>
              <Link
                to={`/nova/studio/proof-graph?node=${encodeURIComponent(
                  String((proofGraph.implementation as { id?: string })?.id ?? ""),
                )}`}
              >
                Implementation Node
              </Link>
            </li>
            {((proofGraph.dependencies as Array<{ id: string }>) ?? []).map((d) => (
              <li key={d.id}>
                <Link to={`/nova/studio/proof-graph?node=${encodeURIComponent(d.id)}`}>
                  {d.id}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="ns-panel">
        <h3>Proof-Graph Impact</h3>
        <ul className="ns-link-list">
          {(impact ?? []).map((id) => (
            <li key={id}>
              <Link to={`/nova/studio/proof-graph?node=${encodeURIComponent(id)}`}>{id}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="ns-panel">
        <h3>Drift Anomaly Score</h3>
        {anomaly ? (
          <div>
            Drift: {String(anomaly.driftCount)} — Score:{" "}
            {Number(anomaly.anomalyScore).toFixed(2)}
            {anomaly.isAnomaly ? <strong className="ns-anomaly"> (ANOMALY)</strong> : null}
          </div>
        ) : (
          <div className="ns-meta">No anomaly data</div>
        )}
      </section>

      <section className="ns-panel">
        <h3>Continuity Replay</h3>
        <pre className="ns-envelope-detail">{JSON.stringify(continuity, null, 2)}</pre>
      </section>

      <section className="ns-panel">
        <Link
          className="ns-button-link"
          to={`/nova/studio/audit?receipt=${encodeURIComponent(String(receipt.id))}`}
        >
          Open in Auditor Mode
        </Link>
      </section>
    </div>
  );
};
