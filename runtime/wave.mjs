export function reduceWaves(metrics, ledger) {
  if (ledger.length === 0) return [];
  const firstReceipt = ledger[0];
  const lastReceipt = ledger.at(-1);
  const foldId = metrics.fingerprint ? `fold-${metrics.fingerprint.slice(0, 12)}` : "fold-pending";
  return [
    {
      wave_id: `wave-${metrics.receiptCount}`,
      runtime_id: "nova-rt-001",
      phase: mapWavePhase(lastReceipt?.phase),
      drift_score: metrics.drift,
      fold_id: foldId,
      started_at: firstReceipt?.timestamp ?? new Date().toISOString(),
      updated_at: lastReceipt?.timestamp ?? new Date().toISOString(),
    },
  ];
}

export function mapWavePhase(phase) {
  if (phase === "intent" || phase === "plan" || phase === "reasoning") return "plan";
  if (phase === "capability" || phase === "execute" || phase === "complete") return "act";
  return "reflect";
}
