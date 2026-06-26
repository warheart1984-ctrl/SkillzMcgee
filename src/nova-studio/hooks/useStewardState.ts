import { useEffect, useState } from "react";

export interface StewardState {
  summary: Record<string, unknown>;
  quorum: Record<string, unknown>;
  pending: Array<Record<string, unknown>>;
  ledger: Array<Record<string, unknown>>;
  evidenceBundle: Record<string, string>;
}

const EMPTY: StewardState = {
  summary: {},
  quorum: {},
  pending: [],
  ledger: [],
  evidenceBundle: {},
};

export function useStewardState() {
  const [state, setState] = useState<StewardState>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let closed = false;

    async function load() {
      try {
        const res = await fetch("/api/steward/state");
        if (!closed && res.ok) setState(await res.json());
      } finally {
        if (!closed) setLoading(false);
      }
    }

    void load();
    const id = setInterval(load, 4000);
    return () => {
      closed = true;
      clearInterval(id);
    };
  }, []);

  return { state, loading, refresh: () => fetch("/api/steward/state").then((r) => r.json()).then(setState) };
}
