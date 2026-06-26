import React from "react";
import {
  ReceiptDiffPanel,
  DriftHeatmap,
  ImpactPanel,
  SessionReplay,
  ReceiptLineageTree,
  GovernanceImpactPanel,
  MultiSliceReplayPanel,
  DriftAnomalyPanel,
} from "./ForensicPanels";

export const ForensicsPage: React.FC = () => (
  <div className="ns-mode-page ns-forensics">
    <h2 className="ns-mode-title">Forensics</h2>
    <div className="ns-audit-grid">
      <ReceiptDiffPanel />
      <DriftHeatmap />
      <DriftAnomalyPanel />
      <ImpactPanel />
      <ReceiptLineageTree />
      <GovernanceImpactPanel />
      <MultiSliceReplayPanel />
      <SessionReplay />
    </div>
  </div>
);
