import React, { useState } from "react";

interface ReplayEvent {
  id: string;
  timestamp: string;
  kind: "EVENT" | "DECISION" | "ARTIFACT";
}

export const ReplayPanel: React.FC = () => {
  const [events] = useState<ReplayEvent[]>([]);
  const [index, setIndex] = useState(0);

  const current = events[index];

  return (
    <div className="novaStudio-replay">
      <h3>Continuity Replay</h3>
      <div className="novaStudio-replay-controls">
        <button type="button" disabled={index <= 0} onClick={() => setIndex(index - 1)}>
          Prev
        </button>
        <button
          type="button"
          disabled={index >= events.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Next
        </button>
      </div>
      <pre className="novaStudio-replay-event">
        {current ? JSON.stringify(current, null, 2) : "No events loaded"}
      </pre>
    </div>
  );
};
