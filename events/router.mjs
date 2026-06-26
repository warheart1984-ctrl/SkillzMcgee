export function routeEvent(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (raw.type === "stance") {
    return {
      type: "stance",
      runtime_id: raw.runtime_id,
      session_id: raw.session_id,
      timestamp: raw.timestamp,
      payload: raw.payload,
    };
  }
  if (raw.type === "wave") {
    return {
      type: "wave",
      runtime_id: raw.runtime_id,
      session_id: raw.session_id,
      timestamp: raw.timestamp,
      payload: raw.payload,
    };
  }
  if (raw.type === "event") {
    return {
      type: "event",
      runtime_id: raw.runtime_id,
      session_id: raw.session_id,
      timestamp: raw.timestamp,
      payload: raw.payload,
    };
  }
  return null;
}
