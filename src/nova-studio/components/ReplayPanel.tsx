import React, { useState } from "react";
import { useSubstrateEvents } from "../hooks/useSubstrateEvents";

export const ReplayPanel: React.FC = () => {
  const { continuity } = useSubstrateEvents();
  const [index, setIndex] = useState(0);
  const current = continuity[index];

  return (
    <div className="ns-panel ns-replay">
      <div className="ns-panel-title">Continuity Timeline</div>
      <div className="ns-replay-list">
        {continuity.length === 0 && (
          <div className="ns-replay-empty">No continuity events</div>
        )}
        {continuity.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className={`ns-replay-item ${i === index ? "ns-replay-active" : ""}`}
            onClick={() => setIndex(i)}
          >
            <span className="ns-replay-time">{e.timestamp}</span>
            <span className="ns-replay-kind">{e.kind}</span>
            <span className="ns-replay-label">{e.label}</span>
          </button>
        ))}
      </div>
      <div className="ns-replay-controls">
        <button
          type="button"
          disabled={index <= 0}
          onClick={() => setIndex((i) => i - 1)}
        >
          ← Prev
        </button>
        <button
          type="button"
          disabled={index >= continuity.length - 1}
          onClick={() => setIndex((i) => i + 1)}
        >
          Next →
        </button>
      </div>
      <pre className="ns-replay-detail">
        {current ? JSON.stringify(current, null, 2) : "No events"}
      </pre>
    </div>
  );
};
