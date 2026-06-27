import React, { useEffect, useState } from "react";
import {
  useCommunicationStream,
  useLaneContext,
} from "../nova-studio/hooks/useCommunicationStream";
import { fetchLanes } from "../runtime/laneContext.js";
import "./CommunicationPanel.css";

export default function CommunicationPanel() {
  const { laneId, setLaneId, laneContext } = useLaneContext();
  const { events, live } = useCommunicationStream(laneId);
  const [lanes, setLanes] = useState([]);

  useEffect(() => {
    void fetchLanes().then(setLanes);
  }, []);

  return (
    <div className="communication-panel">
      <h2>Communication Stream</h2>

      <div className="lane-context-bar">
        <label>
          Lane{" "}
          <select value={laneId} onChange={(e) => setLaneId(e.target.value)}>
            {lanes.map((l) => (
              <option key={l.lane_id} value={l.lane_id}>
                {l.label ?? l.lane_id}
              </option>
            ))}
          </select>
        </label>
        {laneContext && (
          <>
            <span className={`lane-status lane-status-${(laneContext.status ?? "ACTIVE").toLowerCase()}`}>
              {laneContext.status ?? "ACTIVE"}
            </span>
            <span className="corridor-summary">{laneContext.corridor_summary}</span>
          </>
        )}
      </div>

      <div className="comm-toolbar">
        <span className={live ? "comm-live" : "comm-offline"}>
          Event stream {live ? "live" : "offline"}
        </span>
        <span>{events.length} ticks in lane</span>
      </div>

      <div className="comm-list">
        {events.length === 0 && (
          <p className="comm-empty">
            No communication ticks in this lane. Switch lanes or normalize in Semantic Bridge.
          </p>
        )}
        {events.map((e) => (
          <div
            key={e.id ?? `${e.timestamp}-${e.core_claim}`}
            className={
              e.corridor_status && e.corridor_status !== "ok"
                ? `comm-item comm-drift comm-${e.corridor_status}`
                : "comm-item"
            }
          >
            <strong>
              {e.direction} — {e.category}
              {e.corridor_status && e.corridor_status !== "ok" && (
                <span className="drift-badge drift-inline">{e.corridor_status}</span>
              )}
            </strong>
            <div className="comm-claim">{e.core_claim}</div>
            <small className="comm-meta">
              {e.timestamp}
              {e.lane_id ? ` · ${e.lane_id}` : ""}
              {e.impact ? ` · impact: ${e.impact}` : ""}
              {e.altitude ? ` · altitude: ${e.altitude}` : ""}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
