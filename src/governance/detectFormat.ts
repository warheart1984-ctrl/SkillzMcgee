export type LedgerFormat = "GL-1.0" | "GLS-1.0" | "empty";

export function detectLedgerFormat(entries: unknown[]): LedgerFormat {
  if (entries.length === 0) return "empty";
  const first = entries[0] as Record<string, unknown>;
  if (typeof first.entry_id === "string" && first.entry_id.startsWith("GLS-")) {
    return "GLS-1.0";
  }
  if (typeof first.id === "string" && first.id.startsWith("sha256:")) {
    return "GL-1.0";
  }
  if (typeof first.governance_hash === "string") return "GLS-1.0";
  return "GL-1.0";
}
