import { useEffect, useState } from "react";

export interface GraphNode {
  id: string;
  type: string;
  status?: string;
  label?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  kind: string;
  style?: { color: string; dash: string };
}

export interface GraphVisual {
  nodes: GraphNode[];
  edges: GraphEdge[];
  edgeStyles: Record<string, { color: string; dash: string }>;
  nodeCount?: number;
  edgeCount?: number;
}

export function useProofGraph() {
  const [graph, setGraph] = useState<GraphVisual | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/proof-graph/visual")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((g: GraphVisual) => setGraph(g))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => setLoading(false));
  }, []);

  return { graph, loading, error };
}
