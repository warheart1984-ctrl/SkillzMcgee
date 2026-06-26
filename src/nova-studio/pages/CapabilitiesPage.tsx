import React from "react";
import { CapabilityTable } from "../components/CapabilityTable";
import { ReceiptFeed } from "../components/ReceiptFeed";
import { RunCapabilityPanel } from "../components/RunCapabilityPanel";

export const CapabilitiesPage: React.FC = () => (
  <div className="ns-mode-page">
    <h2 className="ns-mode-title">Capabilities</h2>
    <div className="novaStudio-grid">
      <CapabilityTable />
      <ReceiptFeed />
    </div>
    <RunCapabilityPanel />
  </div>
);
