import React from "react";
import { NavLink } from "react-router-dom";

export const MODES = [
  { to: "/nova/studio/capabilities", label: "Capabilities" },
  { to: "/nova/studio/continuity", label: "Continuity" },
  { to: "/nova/studio/proof-graph", label: "Proof Graph" },
  { to: "/nova/studio/audit", label: "Audit" },
  { to: "/nova/studio/forensics", label: "Forensics" },
  { to: "/nova/studio/investigate", label: "Investigate" },
  { to: "/nova/studio/steward", label: "Steward" },
] as const;

export const NavSidebar: React.FC = () => (
  <nav className="ns-left-nav">
    {MODES.map((m) => (
      <NavLink
        key={m.to}
        to={m.to}
        className={({ isActive }) => (isActive ? "ns-left-nav-link active" : "ns-left-nav-link")}
      >
        {m.label}
      </NavLink>
    ))}
  </nav>
);
