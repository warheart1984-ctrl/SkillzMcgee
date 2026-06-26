import { useEffect, useState } from "react";

export interface AuditState {
  cor: { requirements?: unknown[]; version?: string };
  csr: { claims?: Record<string, string>; metadata?: { version?: string } };
  dra: { top_blockers?: unknown[]; version?: string };
  ledger: unknown[];
  continuity: unknown[];
  proofGraph: Record<string, unknown>;
  paths: Record<string, string>;
}

const EMPTY: AuditState = {
  cor: {},
  csr: {},
  dra: {},
  ledger: [],
  continuity: [],
  proofGraph: {},
  paths: {},
};

export function useAuditState() {
  const [state, setState] = useState<AuditState>(EMPTY);
  const [glv, setGlv] = useState<Record<string, unknown> | null>(null);
  const [caic, setCaic] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let closed = false;

    async function load() {
      try {
        const [auditRes, glvRes, caicRes] = await Promise.all([
          fetch("/api/audit/state"),
          fetch("/api/glv/validate"),
          fetch("/api/caic/validate"),
        ]);
        if (closed) return;
        if (auditRes.ok) setState(await auditRes.json());
        if (glvRes.ok) setGlv(await glvRes.json());
        if (caicRes.ok) setCaic(await caicRes.json());
      } finally {
        if (!closed) setLoading(false);
      }
    }

    void load();
    const id = setInterval(load, 5000);
    return () => {
      closed = true;
      clearInterval(id);
    };
  }, []);

  return { state, glv, caic, loading };
}
