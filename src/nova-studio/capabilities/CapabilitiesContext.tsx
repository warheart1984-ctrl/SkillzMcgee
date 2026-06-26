import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CapabilityInput {
  name: string;
  description?: string;
  type?: string;
}

export interface CapabilityDef {
  id: string;
  name: string;
  description?: string;
  kind?: string;
  inputs?: CapabilityInput[];
}

interface CapabilitiesContextValue {
  capabilities: CapabilityDef[];
  selected: CapabilityDef | null;
  setSelected: (cap: CapabilityDef | null) => void;
  loading: boolean;
}

const CapabilitiesContext = createContext<CapabilitiesContextValue | null>(null);

export const CapabilitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capabilities, setCapabilities] = useState<CapabilityDef[]>([]);
  const [selected, setSelected] = useState<CapabilityDef | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/canonical/capabilities.json")
      .then((r) => (r.ok ? r.json() : fetch("/api/capabilities").then((x) => x.json())))
      .then((data) => {
        const caps: CapabilityDef[] = Array.isArray(data)
          ? data.map(registryToCapability)
          : (data.capabilities ?? []).map((c: CapabilityDef) => c);
        setCapabilities(caps);
        setSelected(caps[0] ?? null);
      })
      .catch(() => setCapabilities([]))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({ capabilities, selected, setSelected, loading }),
    [capabilities, selected, loading],
  );

  return <CapabilitiesContext.Provider value={value}>{children}</CapabilitiesContext.Provider>;
};

export function useCapabilities() {
  const ctx = useContext(CapabilitiesContext);
  if (!ctx) throw new Error("useCapabilities requires CapabilitiesProvider");
  return ctx;
}

function registryToCapability(cap: {
  id: string;
  kind?: string;
  inputSchema?: { properties?: Record<string, { type?: string; description?: string }> };
  required?: string[];
}): CapabilityDef {
  const props = cap.inputSchema?.properties ?? {};
  const inputs = Object.entries(props).map(([name, schema]) => ({
    name,
    description: schema.description ?? name,
    type: schema.type ?? "string",
  }));
  return {
    id: cap.id,
    name: cap.id,
    description: `${cap.kind ?? "capability"} — ${cap.id}`,
    kind: cap.kind,
    inputs,
  };
}
