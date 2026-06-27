import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useOperatorContext } from "./state/operatorContext";
import { useSubstrateEvents } from "./hooks/useSubstrateEvents";
import { ContinuityStrip } from "./components/ContinuityStrip";

interface RuntimeStatus {
  online?: boolean;
  lastReceipt?: { id?: string; phase?: string };
}

export const NovaStudioShell: React.FC = () => {
  const loc = useLocation();
  const { operatorId } = useOperatorContext();
  const { receipts } = useSubstrateEvents();
  const [runtime, setRuntime] = useState<RuntimeStatus>({});

  useEffect(() => {
    const load = () => {
      void fetch("/api/runtime/status")
        .then((r) => r.json())
        .then((s: RuntimeStatus) => setRuntime(s))
        .catch(() => setRuntime({ online: false }));
    };
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  const lastReceipt = receipts.at(-1) ?? runtime.lastReceipt ?? null;
  const lastViolation = receipts
    .slice()
    .reverse()
    .find((r) => (r.invariantViolations ?? r.laws?.violations ?? []).length > 0);
  const invariantLabel = lastViolation
    ? `VIOLATION ${lastViolation.id}`
    : "OK";

  return (
    <div className="ns-shell novaStudio-root">
      <aside className="ns-shell-nav">
        <div className="ns-shell-title">Nova Studio</div>
        <nav>
          <NavItem to="/nova/studio/capabilities" label="Capabilities" current={loc.pathname} />
          <NavItem to="/nova/studio/continuity" label="Continuity" current={loc.pathname} />
          <NavItem to="/nova/studio/proof-graph" label="Proof Graph" current={loc.pathname} />
          <NavItem to="/nova/studio/audit" label="Audit" current={loc.pathname} />
          <NavItem to="/nova/studio/steward" label="Steward Council" current={loc.pathname} />
          <NavItem to="/nova/studio/semantic-bridge" label="Semantic Bridge" current={loc.pathname} />
          <NavItem to="/nova/studio/communication" label="Communication" current={loc.pathname} />
          <NavItem to="/nova/studio/communication/canon" label="Comm Canon" current={loc.pathname} />
        </nav>
      </aside>

      <div className="ns-shell-main">
        <header className="ns-shell-topbar">
          <div className="ns-operator">Operator: {operatorId}</div>
          <div className="ns-runtime-status">
            <span className={runtime.online ? "ns-online" : "ns-offline"}>
              {runtime.online ? "Runtime OK" : "Runtime offline"}
            </span>
            <span>Slice: nova-slice-1</span>
            <span>Last receipt: {lastReceipt?.id ?? "—"}</span>
          </div>
        </header>

        <ContinuityStrip />

        <main className="ns-shell-content">
          <Outlet />
        </main>

        <footer className="ns-shell-footer">
          <span>Last invariant: {invariantLabel}</span>
          {lastReceipt?.phase && <span> · phase: {lastReceipt.phase}</span>}
        </footer>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ to: string; label: string; current: string }> = ({
  to,
  label,
  current,
}) => {
  const active = current === to || current.startsWith(`${to}/`);
  return (
    <Link to={to} className={active ? "ns-nav-item ns-nav-active" : "ns-nav-item"}>
      {label}
    </Link>
  );
};
