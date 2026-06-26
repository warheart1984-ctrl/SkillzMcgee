import React, { useEffect, useState } from "react";
import { useProofGraphContext } from "./ProofGraphContext";

export const NodeInspector: React.FC = () => {
  const { selectedNode } = useProofGraphContext();
  const [explanation, setExplanation] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExplanation(null);
  }, [selectedNode]);

  async function explain() {
    if (!selectedNode) return;
    setLoading(true);
    try {
      const res = await fetch("/api/pgql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `EXPLAIN CLAIM "${selectedNode.id}"` }),
      });
      const json = await res.json();
      setExplanation(json.result ?? json);
    } finally {
      setLoading(false);
    }
  }

  if (!selectedNode) return <div className="ns-panel ns-node-inspector">Select a node</div>;

  return (
    <div className="ns-panel ns-node-inspector">
      <h3>Node: {selectedNode.id}</h3>
      <div>Type: {selectedNode.type}</div>
      <button type="button" disabled={loading} onClick={() => void explain()}>
        {loading ? "Explaining…" : "Explain"}
      </button>
      {explanation != null && (
        <pre className="ns-envelope-detail">{JSON.stringify(explanation, null, 2)}</pre>
      )}
    </div>
  );
};
