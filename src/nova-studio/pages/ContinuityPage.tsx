import React from "react";
import { ContinuityTimeline } from "../components/ContinuityTimeline";
import { ReplayPanel } from "../components/ReplayPanel";
import { useSubstrateEvents } from "../hooks/useSubstrateEvents";

export const ContinuityPage: React.FC = () => {
  const { continuity } = useSubstrateEvents();

  return (
    <div className="ns-mode-page">
      <h2 className="ns-mode-title">Continuity</h2>
      <div className="ns-continuity-grid">
        <ContinuityTimeline events={continuity} />
        <ReplayPanel />
      </div>
    </div>
  );
};
