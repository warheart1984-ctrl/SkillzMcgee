import React from "react";
import { Link } from "react-router-dom";

export const InvestigationDecisionView: React.FC<{ data: Record<string, unknown> }> = ({
  data,
}) => {
  const impact = data.impact as {
    decision: Record<string, unknown>;
    transitiveClosure: string[];
  };

  return (
    <div className="ns-investigation">
      <h2 className="ns-mode-title">Governance Decision Investigation</h2>

      <section className="ns-panel">
        <h3>Decision</h3>
        <pre className="ns-envelope-detail">{JSON.stringify(impact.decision, null, 2)}</pre>
      </section>

      <section className="ns-panel">
        <h3>Affected Nodes</h3>
        <ul className="ns-link-list">
          {impact.transitiveClosure.map((id) => (
            <li key={id}>
              <Link to={`/nova/studio/proof-graph?node=${encodeURIComponent(id)}`}>{id}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="ns-panel">
        <h3>Drift Anomalies (system-wide)</h3>
        <pre className="ns-envelope-detail">{JSON.stringify(data.anomalies, null, 2)}</pre>
      </section>
    </div>
  );
};
