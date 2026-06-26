import React from "react";
import { useContinuity } from "./ContinuityContext";

export const ContinuityTimeline: React.FC = () => {
  const { timeline } = useContinuity();

  return (
    <div className="ns-panel ns-continuity-timeline">
      <h3>Continuity Timeline</h3>
      {!timeline.length && <div className="ns-meta">No events</div>}
      <div className="ns-timeline-strip">
        {timeline.map((ev) => (
          <div
            key={ev.id}
            className={`ns-timeline-event ns-kind-${(ev.kind ?? "event").toLowerCase()}`}
          >
            <div className="ns-timeline-label">{ev.label ?? ev.id}</div>
            <div className="ns-timeline-ts">{ev.timestamp ?? "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
