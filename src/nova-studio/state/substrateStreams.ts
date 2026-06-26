export interface LedgerReceipt {
  id: string;
  timestamp: string;
  actor: string;
  slice: string;
  status: string;
}

const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_NOVA_STUDIO_API
    ? String(import.meta.env.VITE_NOVA_STUDIO_API)
    : "";

function mapLedgerEntry(raw: Record<string, unknown>): LedgerReceipt {
  return {
    id: String(raw.id ?? ""),
    timestamp: String(raw.timestamp ?? ""),
    actor: String(raw.actor ?? "nova-studio"),
    slice: String(raw.slice ?? raw.phase ?? "nova"),
    status: String(raw.status ?? "ok"),
  };
}

async function fetchLedgerReceipts(): Promise<LedgerReceipt[]> {
  const res = await fetch(`${API_BASE}/api/state`);
  if (!res.ok) return [];
  const data = (await res.json()) as { ledger?: Record<string, unknown>[] };
  return (data.ledger ?? []).map(mapLedgerEntry);
}

export function subscribeToLedger(
  onReceipts: (r: LedgerReceipt[]) => void,
): { close: () => void } {
  let closed = false;

  (async () => {
    while (!closed) {
      try {
        const receipts = await fetchLedgerReceipts();
        if (!closed) onReceipts(receipts);
      } catch {
        if (!closed) onReceipts([]);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  })();

  return { close: () => {
    closed = true;
  } };
}
