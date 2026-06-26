import React from "react";
import { useProofGraphContext } from "./ProofGraphContext";

const NODE_TYPES = [
  "all",
  "authority",
  "spec",
  "normative",
  "implementation",
  "evidence",
  "decision",
] as const;

export const GraphToolbar: React.FC = () => {
  const { graph, search, setSearch, filterType, setFilterType, setSelectedNode } =
    useProofGraphContext();

  function doSearch() {
    if (!graph || !search.trim()) return;
    const found = graph.nodes.find(
      (n) => n.id === search || n.id.toLowerCase().includes(search.toLowerCase()),
    );
    if (found) setSelectedNode(found);
  }

  const nodeCount = graph?.nodes?.length ?? 0;
  const edgeCount = graph?.edges?.length ?? 0;

  return (
    <div className="ns-panel ns-graph-toolbar">
      <h3>Proof Graph</h3>
      <div className="ns-proof-toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Node ID (e.g. IMP-42)"
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
        />
        <button type="button" onClick={doSearch}>
          Find
        </button>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {NODE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All types" : t}
            </option>
          ))}
        </select>
        <span className="ns-meta">
          {nodeCount} nodes · {edgeCount} edges
        </span>
      </div>
    </div>
  );
};
