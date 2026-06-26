export function reduceStance(metrics, ledger, events) {
  const lastReceipt = ledger.at(-1);
  const lastEvent = events[0];
  return {
    operator_id: "op-001",
    stance: mapOperatorStance(metrics),
    focus_capability_id: lastReceipt?.capability ?? phaseCapabilityId(lastReceipt?.phase),
    last_event_at: lastEvent?.timestamp ?? lastReceipt?.timestamp ?? new Date().toISOString(),
  };
}

export function mapOperatorStance(metrics) {
  if (metrics.receiptCount === 0) return "idle";
  if (metrics.lawfulness < 100) return "halted";
  if (metrics.drift > 0.2) return "intervening";
  return "monitoring";
}

function phaseCapabilityId(phase) {
  if (!phase) return undefined;
  return `cap-${String(phase).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}
