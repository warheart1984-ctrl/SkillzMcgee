import React from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { NovaStudioShell } from "./NovaStudioShell";
import { CapabilitiesPage } from "./capabilities/CapabilitiesPage";
import { ContinuityPage } from "./continuity/ContinuityPage";
import { ProofGraphPage } from "./proof-graph/ProofGraphPage";
import { AuditorDashboard } from "./audit/AuditorDashboard";
import { StewardDashboard } from "./steward/StewardDashboard";
import { InvestigationPage } from "./investigation/InvestigationPage";
import { InvestigationModePage } from "./investigation/InvestigationModePage";
import { WorkflowModelingCanvasPage } from "./workflow-canvas/WorkflowModelingCanvasPage";
import { ForensicsPage } from "./forensics/ForensicsPage";
import { CorDashboardPage } from "./cor/CorDashboardPage";
import { GovernanceDashboardPage } from "./governance/GovernanceDashboardPage";
import { SemanticBridgePage } from "./semantic-bridge/SemanticBridgePage";
import { CommunicationStreamPage } from "./communication/CommunicationStreamPage";
import { CommunicationCanonPage } from "./communication/CommunicationCanonPage";

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
      { path: "semantic-bridge", element: <SemanticBridgePage /> },
      { path: "communication", element: <CommunicationStreamPage /> },
      { path: "communication/canon", element: <CommunicationCanonPage /> },
      { path: "investigate", element: <InvestigationPage /> },
      { path: "investigation-mode", element: <InvestigationModePage /> },
      { path: "workflow-canvas", element: <WorkflowModelingCanvasPage /> },
      { path: "forensics", element: <ForensicsPage /> },
      { path: "cor", element: <CorDashboardPage /> },
      { path: "governance-dashboard", element: <GovernanceDashboardPage /> },
      { path: "coding-agent", element: <Navigate to="../capabilities" replace /> },
      { path: "drift", element: <Navigate to="../capabilities" replace /> },
      { path: "control", element: <Navigate to="../capabilities" replace /> },
      { path: "replay", element: <Navigate to="../continuity" replace /> },
    ],
  },
];
