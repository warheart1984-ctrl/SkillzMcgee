import React from "react";
import { ProofGraphProvider } from "./ProofGraphContext";
import { ProofGraphCanvas } from "./ProofGraphCanvas";
import { GraphToolbar } from "./GraphToolbar";
import { NodeInspector } from "./NodeInspector";

export const ProofGraphPage: React.FC = () => (
  <ProofGraphProvider>
    <div className="ns-proof-graph-page">
      <GraphToolbar />
      <div className="ns-proof-graph-layout">
        <ProofGraphCanvas />
        <NodeInspector />
      </div>
    </div>
  </ProofGraphProvider>
);
