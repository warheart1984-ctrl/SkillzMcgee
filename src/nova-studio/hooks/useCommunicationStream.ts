import { useEffect, useState } from "react";
import { getActiveLaneId, setActiveLaneId } from "../../runtime/laneContext.js";

export interface CommunicationTickEvent {
  id?: string;
  entry_type?: string;
  lane_id?: string;
  timestamp: string;
  direction: string;
  category: string;
  core_claim: string;
  impact?: string;
  required_action?: string;
  altitude?: string;
  latency?: string;
  corridor_status?: string;
  drift_violations?: Array<Record<string, unknown>>;
}

function eventsWsUrl() {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/events`;
}

export function useCommunicationStream(laneId: string) {
  const [events, setEvents] = useState<CommunicationTickEvent[]>([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let closed = false;
    setEvents([]);

    void fetch(`/api/ledger/communication?lane_id=${encodeURIComponent(laneId)}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        if (closed || !data.ok) return;
        setEvents(data.ticks ?? []);
      })
      .catch(() => {});

    let ws: WebSocket;
    try {
      ws = new WebSocket(eventsWsUrl());
    } catch {
      setLive(false);
      return () => {
        closed = true;
      };
    }

    ws.onopen = () => setLive(true);
    ws.onclose = () => setLive(false);
    ws.onerror = () => setLive(false);

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.channel === "communication" && data.payload) {
          if (data.payload.lane_id !== laneId) return;
          setEvents((prev) => [data.payload, ...prev].slice(0, 100));
        }
      } catch {
        // ignore non-json frames
      }
    };

    return () => {
      closed = true;
      ws.close();
    };
  }, [laneId]);

  return { events, live };
}

export function useLaneContext() {
  const [laneId, setLaneIdState] = useState(getActiveLaneId());
  const [laneContext, setLaneContext] = useState<{
    label?: string;
    corridor_summary?: string;
    status?: string;
  } | null>(null);

  useEffect(() => {
    void fetch(`/api/communication/lanes/${encodeURIComponent(laneId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setLaneContext(data.lane);
      })
      .catch(() => setLaneContext(null));
  }, [laneId]);

  function setLaneId(next: string) {
    setActiveLaneId(next);
    setLaneIdState(next);
  }

  return { laneId, setLaneId, laneContext };
}
