import React from "react";
import type { RouteObject } from "react-router-dom";
import { NovaStudioCanvas } from "./components/NovaStudioCanvas";

export const novaStudioRoutes: RouteObject[] = [
  {
    path: "/nova/studio",
    element: <NovaStudioCanvas />,
    children: [
      { index: true, element: <div>Nova Studio Home</div> },
      { path: "coding-agent", element: <div>Coding Agent</div> },
      { path: "drift", element: <div>Drift Visualizer</div> },
      { path: "control", element: <div>Control Tower</div> },
      { path: "replay", element: <div>Replay &amp; Receipts</div> },
    ],
  },
];
