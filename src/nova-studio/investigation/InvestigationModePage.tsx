import React, { useEffect, useMemo, useState } from "react";
import { fetchAllGovernanceArtifacts } from "../../../cor-client/fetchers/cor.js";
import { buildInvestigationForensics } from "../../../cor-client/visualizers/investigation.js";

type Bundle = Awaited<ReturnType<typeof fetchAllGovernanceArtifacts>>;

export const InvestigationModePage: React.FC = () => {
  const [data, setData] = useState<Bundle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllGovernanceArtifacts()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const forensics = useMemo(() => {
    if (!data) return null;
    return buildInvestigationForensics({
      cav: data.cav,
      cor: data.cor as Parameters<typeof buildInvestigationForensics>[0]["cor"],
      pgi: data.pgi as Parameters<typeof buildInvestigationForensics>[0]["pgi"],
      dra: data.dra as Parameters<typeof buildInvestigationForensics>[0]["dra"],
      receipt: data.receipt as { decision?: string },
    });
  }, [data]);

  if (error) {
    return (
      <div className="ns-page">
        <h1>Investigation Mode</h1>
        <p className="ns-error">{error}</p>
        <p>
          Run <code>npm run pipeline</code> in <code>project-infi/cor-suite</code>, then refresh.
        </p>
      </div>
    );
  }

  if (!data || !forensics) {
    return (
      <div className="ns-page">
        <h1>Investigation Mode</h1>
        <p>Loading Investigation Mode…</p>
      </div>
    );
  }

  const cav = data.cav;
  const cor = data.cor as { structuralIntegrity?: unknown };
  const pgi = data.pgi;
  const dra = data.dra as { risk?: Record<string, unknown> };

  return (
    <div className="ns-page">
      <h1>Investigation Mode</h1>
      <p className="ns-muted">Forensic cockpit — CAR → CAV → COR → PGI → DRA → governance receipts</p>

      <section className="ns-section">
        <h2>Readiness Summary</h2>
        <p>
          <strong>{forensics.readiness.summary}</strong>
        </p>
        <ul className="ns-list">
          <li>
            CAV blocking: {forensics.readiness.blockingCount} · DRA high-risk:{" "}
            {forensics.readiness.highRiskCount} · Decision:{" "}
            {forensics.readiness.governanceDecision}
          </li>
          <li>
            Structural integrity: {forensics.readiness.structuralOk ? "OK" : "CRITICAL ISSUES"}
          </li>
          <li>Release ready: {forensics.readiness.readyForRelease ? "yes" : "no"}</li>
        </ul>
      </section>

      <section className="ns-section">
        <h2>Lineage (PGI-1.0)</h2>
        <p>
          {forensics.lineage.requirementCount} requirements · {forensics.lineage.edgeCount} edges
        </p>
        <pre className="ns-pre">{JSON.stringify(forensics.lineage.byRequirement.slice(0, 20), null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Drift Map (CAV hash / missing)</h2>
        <pre className="ns-pre">{JSON.stringify(forensics.drift, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>Counterfactuals (DRA — if verification gaps closed)</h2>
        <pre className="ns-pre">{JSON.stringify(forensics.counterfactuals.slice(0, 15), null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>1. Canonical State (CAR-1.0)</h2>
        <pre className="ns-pre">
          {JSON.stringify(
            {
              carVersion: (data.car as { carVersion?: string }).carVersion,
              generatedAt: (data.car as { generatedAt?: string }).generatedAt,
              artifactCount: (data.car as { artifacts?: unknown[] }).artifacts?.length,
            },
            null,
            2,
          )}
        </pre>
      </section>

      <section className="ns-section">
        <h2>2. Validation (CAV-1.0)</h2>
        <h3>Blocking</h3>
        <pre className="ns-pre">{JSON.stringify(cav.blocking, null, 2)}</pre>
        <h3>Advisory</h3>
        <pre className="ns-pre">{JSON.stringify(cav.advisory, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>3. Constitutional State (COR-1.0)</h2>
        <pre className="ns-pre">{JSON.stringify(cor.structuralIntegrity, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>4. Proof-Graph (PGI-1.0)</h2>
        <pre className="ns-pre">{JSON.stringify(pgi, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>5. Dependency Risk (DRA-1.0)</h2>
        <pre className="ns-pre">{JSON.stringify(dra.risk, null, 2)}</pre>
      </section>

      <section className="ns-section">
        <h2>6. Governance Receipt</h2>
        <pre className="ns-pre">{JSON.stringify(data.receipt, null, 2)}</pre>
      </section>
    </div>
  );
};
