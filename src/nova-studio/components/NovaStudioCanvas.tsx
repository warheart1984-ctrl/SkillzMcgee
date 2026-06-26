import React from "react";
import { NavLink } from "react-router-dom";
import { useOperatorContext } from "../state/operatorContext";
import { CapabilityTable } from "./CapabilityTable";
import { ReceiptFeed } from "./ReceiptFeed";
import { DriftVisualizer } from "./DriftVisualizer";
import { ControlTower } from "./ControlTower";
import { ReplayPanel } from "./ReplayPanel";
import { RunCapabilityPanel } from "./RunCapabilityPanel";
import { useSubstrateEvents } from "../hooks/useSubstrateEvents";
import "../styles/novaStudio.css";

const MODE_LINKS = [
  { to: "coding-agent", label: "Coding Agent" },
  { to: "drift", label: "Drift" },
  { to: "control", label: "Control" },
  { to: "replay", label: "Replay" },
] as const;

export const NovaStudioCanvas: React.FC = () => {
  const { mode, operatorId } = useOperatorContext();
  const { drift } = useSubstrateEvents();

  return (
    <div className="novaStudio-root">
      <header className="ns-header">
        <span>Nova Studio</span>
        <span className="ns-operator">{operatorId}</span>
        <nav className="novaStudio-nav">
          <NavLink to="/nova/studio/proof-graph" className="novaStudio-nav-link">
            Proof Graph
          </NavLink>
          <NavLink to="audit" className="novaStudio-nav-link">
            Audit
          </NavLink>
          <NavLink to="steward" className="novaStudio-nav-link">
            Steward
          </NavLink>
          {MODE_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "novaStudio-nav-link active" : "novaStudio-nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="novaStudio-grid">
        <CapabilityTable />
        <ReceiptFeed />
      </div>

      {mode === "coding-agent" && <RunCapabilityPanel />}
      {mode === "drift" && <DriftVisualizer points={drift} />}
      {mode === "control" && <ControlTower />}
      {mode === "replay" && <ReplayPanel />}
    </div>
  );
};
