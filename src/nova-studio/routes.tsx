import React from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { NovaStudioShell } from "./NovaStudioShell";
import { CapabilitiesPage } from "./capabilities/CapabilitiesPage";
import { ContinuityPage } from "./continuity/ContinuityPage";
import { ProofGraphPage } from "./proof-graph/ProofGraphPage";
import { AuditorDashboard } from "./audit/AuditorDashboard";
import { StewardDashboard } from "./steward/StewardDashboard";
import { InvestigationPage } from "./investigation/InvestigationPage";
import { ForensicsPage } from "./forensics/ForensicsPage";

export const novaStudioRoutes: RouteObject[] = [
  {
    path: "/nova/studio",
    element: <NovaStudioShell />,
    children: [
      { index: true, element: <Navigate to="capabilities" replace /> },
      { path: "capabilities", element: <CapabilitiesPage /> },
      { path: "continuity", element: <ContinuityPage /> },
      { path: "proof-graph", element: <ProofGraphPage /> },
      { path: "audit", element: <AuditorDashboard /> },
      { path: "steward", element: <StewardDashboard /> },
      { path: "investigate", element: <InvestigationPage /> },
      { path: "forensics", element: <ForensicsPage /> },
      { path: "coding-agent", element: <Navigate to="../capabilities" replace /> },
      { path: "drift", element: <Navigate to="../capabilities" replace /> },
      { path: "control", element: <Navigate to="../capabilities" replace /> },
      { path: "replay", element: <Navigate to="../continuity" replace /> },
    ],
  },
];
