import React, { useEffect, useState } from "react";
import { fetchAllCorArtifacts } from "../../../cor-client/fetchers/cor.js";
import { buildLineageGraph } from "../../../cor-client/visualizers/lineage-graph.js";
import { buildMaturityMap, maturityColor } from "../../../cor-client/visualizers/maturity-map.js";
import { buildInvariantDashboard } from "../../../cor-client/visualizers/invariant-dashboard.js";

type CorBundle = Awaited<ReturnType<typeof fetchAllCorArtifacts>>;

export const CorDashboardPage: React.FC = () => {
  const [data, setData] = useState<CorBundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCorArtifacts()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  if (error) {
    return (
      <div className="ns-page">
        <h1>COR Suite Dashboard</h1>
        <p className="ns-error">{error}</p>
        <p>
          Run <code>npm run pipeline</code> in <code>project-infi/cor-suite</code>, then refresh.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="ns-page">
        <h1>COR Suite Dashboard</h1>
        <p>Loading COR Suite data from project-infi…</p>
      </div>
    );
  }

  const lineage = buildLineageGraph(data.cor as Parameters<typeof buildLineageGraph>[0]);
  const maturity = buildMaturityMap(data.maturity as Parameters<typeof buildMaturityMap>[0]);
  const invariants = buildInvariantDashboard({
    cor: data.cor as Parameters<typeof buildInvariantDashboard>[0]["cor"],
    analysis: data.analysis as Parameters<typeof buildInvariantDashboard>[0]["analysis"],
    receipt: data.receipt as Parameters<typeof buildInvariantDashboard>[0]["receipt"],
  });

  return (
    <div className="ns-page">
      <h1>COR Suite Dashboard</h1>
      <p className="ns-muted">Control tower view — governance runs in project-infi</p>

      <section className="ns-section">
        <h2>Governance Decision</h2>
        <p>
          <strong>{String((data.receipt as { decision?: string }).decision ?? "—")}</strong>
        </p>
        <pre className="ns-pre">{JSON.stringify(data.receipt, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Invariant Dashboard</h2>
        <ul className="ns-list">
          {invariants.map((row) => (
            <li key={row.id}>
              <span className={`ns-badge ns-badge-${row.status}`}>{row.status}</span> {row.id}:{" "}
              {row.detail}
            </li>
          ))}
        </ul>
      </section>

      <section className="ns-section">
        <h2>Maturity Map</h2>
        <div className="ns-maturity-summary">
          {Object.entries(maturity.summary).map(([level, count]) => (
            <span key={level} style={{ color: maturityColor(level as keyof typeof maturity.summary) }}>
              {level}: {count}{" "}
            </span>
          ))}
        </div>
        <ul className="ns-list ns-list-compact">
          {maturity.cells.slice(0, 24).map((cell) => (
            <li key={cell.requirementId}>
              <span style={{ color: maturityColor(cell.maturity) }}>{cell.maturity}</span>{" "}
              {cell.requirementId}
            </li>
          ))}
          {maturity.cells.length > 24 && <li>…and {maturity.cells.length - 24} more</li>}
        </ul>
      </section>

      <section className="ns-section">
        <h2>Lineage Graph</h2>
        <p>
          {lineage.nodes.length} nodes, {lineage.edges.length} edges (
          {(data.cor as { structuralIntegrity?: { orphans?: { implementations?: string[] } } })
            .structuralIntegrity?.orphans?.implementations?.length ?? 0}{" "}
          orphan implementations)
        </p>
      </section>

      <section className="ns-section">
        <h2>Proof Analysis</h2>
        <pre className="ns-pre">
          {JSON.stringify(
            (data.analysis as { claims?: unknown[] }).claims?.slice(0, 20) ?? [],
            null,
            2,
          )}
        </pre>
      </section>

      <section className="ns-section">
        <h2>Structural Integrity (COR-1.0)</h2>
        <pre className="ns-pre">
          {JSON.stringify(
            (data.cor as { structuralIntegrity?: unknown }).structuralIntegrity,
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
};
