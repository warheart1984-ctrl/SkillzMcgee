import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useOperatorContext } from "../state/operatorContext";
import { CapabilityTable } from "./CapabilityTable";
import { ReceiptFeed } from "./ReceiptFeed";
import { DriftVisualizer } from "./DriftVisualizer";
import { ControlTower } from "./ControlTower";
import { ReplayPanel } from "./ReplayPanel";
import "../styles/novaStudio.css";

const MODE_LINKS = [
  { to: "coding-agent", label: "Coding Agent" },
  { to: "drift", label: "Drift" },
  { to: "control", label: "Control" },
  { to: "replay", label: "Replay" },
] as const;

export const NovaStudioCanvas: React.FC = () => {
  const { mode, operatorId } = useOperatorContext();

  return (
    <div className="novaStudio-root">
      <header className="novaStudio-header">
        <span>Nova Studio</span>
        <span className="novaStudio-operator">{operatorId}</span>
        <nav className="novaStudio-nav">
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
        <section className="novaStudio-main">
          <CapabilityTable />
          <Outlet />
        </section>
        <aside className="novaStudio-side">
          <ReceiptFeed />
        </aside>
      </div>
      <div className="novaStudio-modes">
        {mode === "drift" && <DriftVisualizer />}
        {mode === "control" && <ControlTower />}
        {mode === "replay" && <ReplayPanel />}
      </div>
    </div>
  );
};
