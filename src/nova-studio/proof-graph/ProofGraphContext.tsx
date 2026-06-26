import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { GraphNode, GraphVisual } from "./useProofGraph";

interface ProofGraphContextValue {
  graph: GraphVisual | null;
  loading: boolean;
  error: string | null;
  selectedNode: GraphNode | null;
  setSelectedNode: (n: GraphNode | null) => void;
  search: string;
  setSearch: (v: string) => void;
  filterType: string;
  setFilterType: (v: string) => void;
}

const ProofGraphContext = createContext<ProofGraphContextValue | null>(null);

export const ProofGraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [graph, setGraph] = useState<GraphVisual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    void fetch("/api/proof-graph/visual")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((g: GraphVisual) => setGraph(g))
      .catch(() =>
        fetch("/conformance/proof-graph/graph.json")
          .then((r) => r.json())
          .then((raw) => normalizeGraph(raw))
          .catch((e: unknown) =>
            setError(e instanceof Error ? e.message : String(e)),
          ),
      )
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      graph,
      loading,
      error,
      selectedNode,
      setSelectedNode,
      search,
      setSearch,
      filterType,
      setFilterType,
    }),
    [graph, loading, error, selectedNode, search, filterType],
  );

  return <ProofGraphContext.Provider value={value}>{children}</ProofGraphContext.Provider>;
};

export function useProofGraphContext() {
  const ctx = useContext(ProofGraphContext);
  if (!ctx) throw new Error("useProofGraphContext requires ProofGraphProvider");
  return ctx;
}

function normalizeGraph(raw: Record<string, unknown>): GraphVisual {
  if (Array.isArray(raw.nodes) && Array.isArray(raw.edges)) {
    return raw as GraphVisual;
  }
  const nodes: GraphNode[] = [];
  const edges: { source: string; target: string; kind: string }[] = [];
  for (const [id, node] of Object.entries(raw.implementations ?? {})) {
    nodes.push({ id, type: "implementation", label: id });
  }
  for (const [id, node] of Object.entries(raw.requirements ?? {})) {
    nodes.push({ id, type: "normative", label: id });
  }
  return { nodes, edges, edgeStyles: {} };
}
