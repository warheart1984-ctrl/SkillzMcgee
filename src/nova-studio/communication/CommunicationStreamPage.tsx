import React from "react";
import CommunicationPanel from "../../panels/CommunicationPanel.jsx";
import CommunicationGovernancePanel from "../../panels/CommunicationGovernancePanel.jsx";

export const CommunicationStreamPage: React.FC = () => (
  <div className="ns-mode-page comm-stream-layout">
    <CommunicationPanel />
    <CommunicationGovernancePanel />
  </div>
);
