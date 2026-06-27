import React, { useEffect, useMemo, useState } from "react";
import {
  fetchAllGovernanceArtifacts,
  type CavReportShape,
} from "../../../cor-client/fetchers/cor.js";

type GovernanceBundle = Awaited<ReturnType<typeof fetchAllGovernanceArtifacts>>;

function releaseCriteriaStatus(data: GovernanceBundle) {
  const cav = data.cav as CavReportShape;
  const decision = String((data.receipt as { decision?: string }).decision ?? "");
  const riskEntries = Object.values(
    (data.dra as { risk?: Record<string, { score: number }> }).risk ?? {},
  );
  const highRisk = riskEntries.filter((r) => r.score >= 10).length;
  const blockingCount = cav.blocking?.length ?? 0;

  return [
    {
      id: "cav-clean",
      label: "CAV-1.0: zero blocking findings",
      pass: blockingCount === 0,
      detail: `${blockingCount} blocking, ${cav.advisory?.length ?? 0} advisory`,
    },
    {
      id: "governance-decision",
      label: "Governance decision not reject/freeze",
      pass: !["reject", "freeze"].includes(decision),
      detail: decision || "â€”",
    },
    {
      id: "dra-risk",
      label: "DRA-1.0: no high-risk requirements (score â‰¥ 10)",
      pass: highRisk === 0,
      detail: `${highRisk} high-risk of ${riskEntries.length} requirements`,
    },
    {
      id: "csr-coverage",
      label: "CSR-1.0: decision coverage â‰¥ 80%",
      pass:
        ((data.csr as { decisionCoverage?: { coverageRatio?: number } }).decisionCoverage
          ?.coverageRatio ?? 0) >= 0.8,
      detail: `${Math.round(
        ((data.csr as { decisionCoverage?: { coverageRatio?: number } }).decisionCoverage
          ?.coverageRatio ?? 0) * 100,
      )}% coverage`,
    },
    {
      id: "pgi-present",
      label: "PGI-1.0 graph materialized",
      pass: ((data.pgi as { nodes?: unknown[] }).nodes?.length ?? 0) > 0,
      detail: `${(data.pgi as { nodes?: unknown[] }).nodes?.length ?? 0} nodes, ${
        (data.pgi as { edges?: unknown[] }).edges?.length ?? 0
      } edges`,
    },
  ];
}

export const GovernanceDashboardPage: React.FC = () => {
  const [data, setData] = useState<GovernanceBundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllGovernanceArtifacts()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const criteria = useMemo(() => (data ? releaseCriteriaStatus(data) : []), [data]);

  if (error) {
    return (
      <div className="ns-page">
        <h1>Steward Governance Dashboard</h1>
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
        <h1>Steward Governance Dashboard</h1>
        <p>Loading governance dataâ€¦</p>
      </div>
    );
  }

  const cav = data.cav as CavReportShape;
  const cor = data.cor as { structuralIntegrity?: unknown };
  const dra = data.dra as { risk?: Record<string, unknown> };
  const pgi = data.pgi as { nodes?: unknown[]; edges?: unknown[] };

  return (
    <div className="ns-page">
      <h1>Steward Governance Dashboard</h1>
      <p className="ns-muted">Operator cockpit â€” CAR / CAV / COR / DRA / PGI / governance receipts</p>

      <section className="ns-section">
        <h2>Release Criteria (v1.0)</h2>
        <ul className="ns-list">
          {criteria.map((row) => (
            <li key={row.id}>
              <span className={`ns-badge ns-badge-${row.pass ? "ok" : "fail"}`}>
                {row.pass ? "pass" : "fail"}
              </span>{" "}
              {row.label} â€” {row.detail}
            </li>
          ))}
        </ul>
      </section>

      <section className="ns-section">
        <h2>Canonical Validation (CAVâ€‘1.0)</h2>
        <h3>Blocking Findings</h3>
        <pre className="ns-pre">{JSON.stringify(cav.blocking, null, 2)}</pre>
        <h3>Advisory Findings</h3>
        <pre className="ns-pre">{JSON.stringify(cav.advisory, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Constitutional State (CORâ€‘1.0)</h2>
        <pre className="ns-pre">{JSON.stringify(cor.structuralIntegrity, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Dependency Risk (DRAâ€‘1.0)</h2>
        <pre className="ns-pre">{JSON.stringify(dra.risk, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Proofâ€‘Graph Index (PGIâ€‘1.0)</h2>
        <p>
          {pgi.nodes?.length ?? 0} nodes, {pgi.edges?.length ?? 0} edges
        </p>
        <pre className="ns-pre">{JSON.stringify(pgi, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Stewardship (CSRâ€‘1.0)</h2>
        <pre className="ns-pre">{JSON.stringify(data.csr, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Governance Receipt</h2>
        <pre className="ns-pre">{JSON.stringify(data.receipt, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>CAR Registry Summary</h2>
        <pre className="ns-pre">
          {JSON.stringify(
            {
              carVersion: (data.car as { carVersion?: string }).carVersion,
              artifactCount: (data.car as { artifacts?: unknown[] }).artifacts?.length,
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
};
