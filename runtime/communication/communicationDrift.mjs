export function computeDriftVector(tick, previousTick = null) {
  const semantic = previousTick && previousTick.category !== tick.category ? 0.4 : 0;
  const altitude = previousTick && previousTick.altitude !== tick.altitude ? 0.3 : 0;
  const impact = tick.impact === "none" && tick.required_action && tick.required_action !== "none" ? 0.7 : 0;
  const latency = 0;
  return {
    semantic,
    altitude,
    impact,
    latency,
    composite: Math.max(semantic, altitude, impact, latency, tick.drift_vector?.composite ?? 0),
  };
}

export function computeCommunicationDrift(history) {
  return history.map((tick, index) => {
    const drift = tick.drift_vector ?? computeDriftVector(tick, history[index - 1]);
    return {
      id: tick.id,
      lane_id: tick.lane_id,
      semantic_drift: drift.semantic ?? 0,
      altitude_drift: drift.altitude ?? 0,
      impact_drift: drift.impact ?? 0,
      latency_drift: drift.latency ?? 0,
      composite: drift.composite ?? 0,
    };
  });
}

export function computeCommunicationContinuity(ticks) {
  if (!ticks.length) return { communication_drift: 0 };
  return {
    communication_drift: Math.max(...ticks.map((tick) => tick.drift_vector?.composite ?? 0)),
  };
}
