import React from "react";
import { ContinuityProvider } from "./ContinuityContext";
import { SliceExecutorPanel } from "./SliceExecutorPanel";
import { SliceReceiptsList } from "./SliceReceiptsList";
import { ContinuityTimeline } from "./ContinuityTimeline";

export const ContinuityPage: React.FC = () => (
  <ContinuityProvider>
    <div className="ns-continuity-page">
      <div className="ns-continuity-grid">
        <SliceExecutorPanel />
        <SliceReceiptsList />
      </div>
      <ContinuityTimeline />
    </div>
  </ContinuityProvider>
);
