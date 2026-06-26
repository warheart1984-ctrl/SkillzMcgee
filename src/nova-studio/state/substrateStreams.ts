import type { SliceCapability } from "../lib/slices";
import type { GovernanceEnvelope } from "../governance/receiptTypes";
import type { ContinuityEvent } from "../lib/replayModel";
import type { DriftPoint } from "../lib/driftMath";

export interface StudioStatePayload {
  capabilities: SliceCapability[];
  receipts: GovernanceEnvelope[];
  continuity: ContinuityEvent[];
  drift: DriftPoint[];
}

const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_NOVA_STUDIO_API
    ? String(import.meta.env.VITE_NOVA_STUDIO_API)
    : "";

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

const EMPTY_STATE: StudioStatePayload = {
  capabilities: [],
  receipts: [],
  continuity: [],
  drift: [],
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(apiUrl(path));
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchLedger(): Promise<GovernanceEnvelope[]> {
  try {
    const res = await fetch(apiUrl("/skillzmcgee/ledger"));
    if (!res.ok) return [];
    const text = await res.text();
    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line.replace(/^\uFEFF/, "")) as GovernanceEnvelope);
  } catch {
    return [];
  }
}

export async function fetchContinuity(): Promise<ContinuityEvent[]> {
  return (await fetchJson<ContinuityEvent[]>("/api/continuity")) ?? [];
}

export async function fetchDrift(): Promise<DriftPoint[]> {
  return (await fetchJson<DriftPoint[]>("/api/drift")) ?? [];
}

export async function fetchCapabilities(): Promise<SliceCapability[]> {
  return (await fetchJson<SliceCapability[]>("/api/capabilities")) ?? [];
}

export interface RunCapabilityResult {
  envelope?: GovernanceEnvelope;
  output?: GovernanceEnvelope;
  value?: unknown;
  violations?: string[];
  ok?: boolean;
}

export async function runCapability(params: {
  capabilityId: string;
  operator: string;
  input: Record<string, unknown>;
}): Promise<RunCapabilityResult | null> {
  try {
    const res = await fetch(
      apiUrl(`/api/run/${encodeURIComponent(params.capabilityId)}`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-operator": params.operator,
        },
        body: JSON.stringify({
          input: params.input,
        }),
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as RunCapabilityResult;
  } catch {
    return null;
  }
}

async function fetchUnifiedState(): Promise<StudioStatePayload> {
  const state = await fetchJson<StudioStatePayload & { ledger?: unknown[] }>(
    "/api/state",
  );
  if (!state) return EMPTY_STATE;

  const substrate: StudioStatePayload = {
    capabilities: state.capabilities ?? [],
    receipts: state.receipts ?? [],
    continuity: state.continuity ?? [],
    drift: state.drift ?? [],
  };

  if (
    substrate.receipts.length === 0 &&
    Array.isArray(state.ledger) &&
    state.ledger.length > 0
  ) {
    const ledgerReceipts = await fetchLedger();
    if (ledgerReceipts.length) {
      substrate.receipts = ledgerReceipts;
    }
  }

  if (substrate.continuity.length === 0) {
    substrate.continuity = await fetchContinuity();
  }
  if (substrate.drift.length === 0) {
    substrate.drift = await fetchDrift();
  }
  if (substrate.capabilities.length === 0) {
    substrate.capabilities = await fetchCapabilities();
  }

  const skillzReceipts = await fetchLedger();
  if (skillzReceipts.length) {
    const byId = new Map(substrate.receipts.map((r) => [r.id, r]));
    for (const r of skillzReceipts) {
      byId.set(r.id, r);
    }
    substrate.receipts = [...byId.values()].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    );
  }

  return substrate;
}

export function subscribeToStudioState(
  onUpdate: (s: StudioStatePayload) => void,
): { close: () => void } {
  let closed = false;

  async function loop() {
    while (!closed) {
      try {
        const state = await fetchUnifiedState();
        if (!closed) onUpdate(state);
      } catch (err) {
        console.error("studio state poll failed", err);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  void loop();
  return { close: () => {
    closed = true;
  } };
}

/** @deprecated use subscribeToStudioState */
export function subscribeToLedger(
  onReceipts: (r: GovernanceEnvelope[]) => void,
): { close: () => void } {
  return subscribeToStudioState((s) => onReceipts(s.receipts));
}

export type { GovernanceEnvelope as LedgerReceipt };
