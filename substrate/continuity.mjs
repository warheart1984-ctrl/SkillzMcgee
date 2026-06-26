import { stableHash } from "./executionEnvelope.mjs";

export function nextCheckpoint(previous) {
  const n = Number.parseInt(previous || "0", 10);
  return String(n + 1).padStart(5, "0");
}

export function recordEvent(state, kind, label, extras = {}) {
  const checkpoint = nextCheckpoint(state.checkpoint);
  const event = {
    id: stableHash({ checkpoint, kind, label, extras }),
    checkpoint,
    kind,
    timestamp: new Date().toISOString(),
    label,
    ...extras,
  };
  return {
    checkpoint,
    events: [...(state.events ?? []), event],
  };
}

export function bindReceipt(state, receiptId) {
  return recordEvent(state, "DECISION", "Capability executed", { receiptId });
}
