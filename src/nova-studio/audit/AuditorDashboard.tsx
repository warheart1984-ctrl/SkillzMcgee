import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuditState } from "../hooks/useAuditState";
import {
  CORPanel,
  CSRPanel,
  DRAPanel,
  CAVPanel,
  LedgerPanel,
  ContinuityPanel,
  PGQLConsole,
  GLVPanel,
  CertificationPanel,
  ReleaseReadinessPanel,
  RuntimeReceiptsPanel,
} from "./panels";
import "../styles/novaStudio.css";

export const AuditorDashboard: React.FC = () => {
  const [params] = useSearchParams();
  const focusReceipt = params.get("receipt");
  const { state, glv, caic, loading } = useAuditState();

  return (
    <div className="ns-mode-page ns-audit">
      <h2 className="ns-mode-title">Auditor Dashboard</h2>
      {focusReceipt && (
        <p className="ns-meta">
          Focus receipt: <code>{focusReceipt}</code>{" "}
          <Link to={`/nova/studio/investigate?receipt=${encodeURIComponent(focusReceipt)}`}>
            Investigate
          </Link>
        </p>
      )}

      {loading && <p className="ns-meta">Loading constitutional artifacts…</p>}

      <div className="ns-audit-grid">
        <CORPanel cor={state.cor} />
        <CSRPanel csr={state.csr} />
        <DRAPanel dra={state.dra} />
        <CAVPanel caic={caic} />
        <GLVPanel glv={glv} />
        <LedgerPanel ledger={state.ledger} />
        <RuntimeReceiptsPanel focusReceipt={focusReceipt} />
        <CertificationPanel />
        <ReleaseReadinessPanel />
      </div>

      <div className="ns-audit-bottom">
        <ContinuityPanel />
        <PGQLConsole />
      </div>
    </div>
  );
};
