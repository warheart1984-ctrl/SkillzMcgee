import React from "react";
import type { ContinuityEvent } from "../lib/replayModel";

export const ContinuityTimeline: React.FC<{ events: ContinuityEvent[] }> = ({
  events,
}) => (
  <div className="ns-panel ns-continuity-timeline">
    <div className="ns-panel-title">Continuity Timeline</div>
    <div className="ns-replay-list">
      {events.length === 0 && (
        <div className="ns-replay-empty">No continuity events</div>
      )}
      {events.map((e) => (
        <div key={e.id} className="ns-replay-item">
          <span className="ns-replay-time">{e.timestamp}</span>
          <span className="ns-replay-kind">{e.kind}</span>
          <span className="ns-replay-label">{e.label}</span>
        </div>
      ))}
    </div>
  </div>
);
