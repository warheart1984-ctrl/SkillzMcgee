import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AuditState } from "../hooks/useAuditState";
import { usePgql } from "../hooks/usePgql";
import { ReplayPanel } from "../components/ReplayPanel";

export function CORPanel({ cor }: { cor: AuditState["cor"] }) {
  const rows = cor.requirements ?? [];
  const missing = rows.filter(
    (r: { evidence_status?: string; receipt_status?: string }) =>
      r.evidence_status === "missing" || r.receipt_status === "missing",
  );
  const integrity = (cor as { canonicalIntegrity?: Record<string, string> }).canonicalIntegrity;
  const readiness = (cor as { releaseReadiness?: string }).releaseReadiness;
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">COR-1.0</div>
      {integrity && (
        <p className="ns-meta">
          Release readiness: {readiness ?? "—"} · integrity: {JSON.stringify(integrity)}
        </p>
      )}
      <p className="ns-meta">{rows.length} requirements · {missing.length} with missing evidence</p>
      <ul className="ns-claim-list">
        {missing.slice(0, 8).map((r: { requirement_id: string; claim_status?: string }) => (
          <li key={r.requirement_id} className="ns-missing">
            {r.requirement_id} — {r.claim_status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CSRPanel({ csr }: { csr: AuditState["csr"] }) {
  const claims = Array.isArray(csr.claims)
    ? csr.claims.map((c: { id: string; status: string }) => [c.id, c.status])
    : Object.entries(csr.claims ?? {});
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">CSR-1.0</div>
      <table className="ns-table">
        <thead>
          <tr>
            <th>Claim</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {claims.slice(0, 12).map(([id, status]) => (
            <tr key={id}>
              <td>{id}</td>
              <td className={status === "research" ? "ns-warn" : ""}>{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DRAPanel({ dra }: { dra: AuditState["dra"] }) {
  const blockers = dra.top_blockers ?? [];
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">DRA-1.0</div>
      <ul className="ns-blocker-list">
        {blockers.slice(0, 6).map((b: { artifact_id: string; impact_score: number; blocked_requirements?: string[] }) => (
          <li key={b.artifact_id}>
            <strong>{b.artifact_id}</strong> (impact {b.impact_score}) —{" "}
            {(b.blocked_requirements ?? []).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CAVPanel({ caic }: { caic: Record<string, unknown> | null }) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">CAV / CAIC-1.0</div>
      <pre className="ns-validator-output">
        {caic
          ? JSON.stringify(
              {
                canonicalIntegrity: caic.canonicalIntegrity,
                hashTree: caic.hashTree,
                unexpectedChanges: (caic.unexpectedChanges as unknown[])?.length ?? 0,
                missingArtifacts: (caic.missingArtifacts as unknown[])?.length ?? 0,
              },
              null,
              2,
            )
          : "Loading…"}
      </pre>
    </div>
  );
}

export function LedgerPanel({ ledger }: { ledger: unknown[] }) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Governance Ledger (GLS)</div>
      <ul className="ns-ledger-list">
        {(ledger as Array<{ entry_id?: string; id?: string; decision: string; decision_type: string }>)
          .slice()
          .reverse()
          .slice(0, 8)
          .map((e) => {
            const entryId = e.entry_id ?? e.id ?? "unknown";
            return (
              <li key={entryId}>
                <span>{entryId}</span> — <em>{e.decision_type}</em> —{" "}
                <strong className={`ns-status-${e.decision}`}>{e.decision}</strong>{" "}
                <Link to={`/nova/studio/investigate?decision=${encodeURIComponent(entryId)}`}>
                  Investigate
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export function RuntimeReceiptsPanel({ focusReceipt }: { focusReceipt: string | null }) {
  const [receipts, setReceipts] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void fetch("/api/state")
      .then((r) => r.json())
      .then((s) => setReceipts(s.receipts ?? []));
  }, [focusReceipt]);

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Runtime Receipt Ledger</div>
      <ul className="ns-ledger-list">
        {receipts
          .slice()
          .reverse()
          .slice(0, 12)
          .map((r) => (
            <li
              key={String(r.id)}
              className={focusReceipt === r.id ? "ns-receipt-focus" : undefined}
            >
              <code>{String(r.id)}</code> — {String(r.capabilityId)} — {String(r.status)}
              {focusReceipt === r.id && <strong> ← focus</strong>}
            </li>
          ))}
      </ul>
    </div>
  );
}

export function ContinuityPanel() {
  return <ReplayPanel />;
}

export function PGQLConsole() {
  const { query, setQuery, result, loading, error, execute } = usePgql();
  const examples = [
    'SELECT claims WHERE status = "missing"',
    'EXPLAIN CLAIM "CRK1-R041"',
    'COUNTERFACTUAL "remove CRK1-R041"',
    "SELECT blockers",
  ];

  return (
    <div className="ns-panel ns-pgql">
      <div className="ns-panel-title">PGQL Console</div>
      <div className="ns-pgql-examples">
        {examples.map((ex) => (
          <button key={ex} type="button" className="ns-pgql-chip" onClick={() => { setQuery(ex); void execute(ex); }}>
            {ex}
          </button>
        ))}
      </div>
      <textarea
        className="ns-pgql-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={3}
      />
      <button type="button" disabled={loading} onClick={() => void execute()}>
        {loading ? "Running…" : "Run query"}
      </button>
      {error && <p className="ns-error">{error}</p>}
      <pre className="ns-pgql-result">
        {result ? JSON.stringify(result.result ?? result, null, 2) : "No result"}
      </pre>
    </div>
  );
}

export function GLVPanel({ glv }: { glv: Record<string, unknown> | null }) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">GLV-1.0 Legitimacy</div>
      <pre className="ns-validator-output">{glv?.summary ?? "Loading…"}</pre>
    </div>
  );
}

export function CertificationPanel() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [running, setRunning] = useState(false);

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Auditor Certification (7-step)</div>
      <button
        type="button"
        disabled={running}
        onClick={() => {
          setRunning(true);
          void fetch("/api/audit/certify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ release: "v1.0", auditor_id: "auditor:local" }),
          })
            .then((r) => r.json())
            .then(setResult)
            .finally(() => setRunning(false));
        }}
      >
        {running ? "Certifying…" : "Run certification protocol"}
      </button>
      <pre className="ns-validator-output">
        {result
          ? JSON.stringify(
              {
                status: result.status,
                certification_id: result.certification_id,
                steps: (result.steps as unknown[])?.map((s: { step: string; pass: boolean }) => ({
                  step: s.step,
                  pass: s.pass,
                })),
              },
              null,
              2,
            )
          : "Not yet certified"}
      </pre>
    </div>
  );
}

export function ReleaseReadinessPanel() {
  const [readiness, setReadiness] = useState<Record<string, unknown> | null>(null);

  React.useEffect(() => {
    void fetch("/api/release/readiness?release=v1.0")
      .then((r) => r.json())
      .then(setReadiness);
  }, []);

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Release Readiness</div>
      <p className={readiness?.ready ? "ns-status-ok" : "ns-status-error"}>
        {readiness?.ready ? "Ready for release" : "Not ready"}
      </p>
      <pre className="ns-validator-output">
        {readiness ? JSON.stringify(readiness, null, 2) : "Loading…"}
      </pre>
    </div>
  );
}
