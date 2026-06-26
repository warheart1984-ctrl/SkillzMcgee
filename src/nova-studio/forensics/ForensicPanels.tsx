import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ReceiptDiffPanel: React.FC = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [diff, setDiff] = useState<Record<string, unknown> | null>(null);

  async function run() {
    const res = await fetch("/api/receipt/diff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ a, b }),
    });
    const json = await res.json();
    setDiff(json.diff);
  }

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Receipt Diff</div>
      <input placeholder="Receipt A" value={a} onChange={(e) => setA(e.target.value)} />
      <input placeholder="Receipt B" value={b} onChange={(e) => setB(e.target.value)} />
      <button type="button" onClick={() => void run()}>
        Compare
      </button>
      {diff && <pre className="ns-envelope-detail">{JSON.stringify(diff, null, 2)}</pre>}
    </div>
  );
};

export const DriftHeatmap: React.FC = () => {
  const [history, setHistory] = React.useState<Array<{ id: string; driftCount: number }>>([]);

  React.useEffect(() => {
    void fetch("/api/drift/history")
      .then((r) => r.json())
      .then((j) => setHistory(j.history ?? []));
  }, []);

  return (
    <div className="ns-panel ns-drift-heatmap">
      <div className="ns-panel-title">Drift Heatmap</div>
      <div className="ns-heatmap-row">
        {history.map((h) => (
          <div
            key={h.id}
            className="ns-heatmap-cell"
            style={{ background: heatColor(h.driftCount) }}
            title={`${h.id}: ${h.driftCount} drift`}
          />
        ))}
      </div>
    </div>
  );
};

function heatColor(n: number) {
  if (n === 0) return "#4caf50";
  if (n <= 2) return "#ffeb3b";
  return "#f44336";
}

export const ImpactPanel: React.FC = () => {
  const [receiptId, setReceiptId] = useState("");
  const [impact, setImpact] = useState<string[]>([]);

  async function run() {
    const res = await fetch("/api/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiptId }),
    });
    const json = await res.json();
    setImpact(json.impact ?? []);
  }

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Proof-Graph Impact</div>
      <input
        value={receiptId}
        onChange={(e) => setReceiptId(e.target.value)}
        placeholder="Receipt ID"
      />
      <button type="button" onClick={() => void run()}>
        Analyze
      </button>
      {impact.length > 0 && (
        <ul className="ns-link-list">
          {impact.map((id) => (
            <li key={id}>
              <Link to={`/nova/studio/proof-graph?node=${encodeURIComponent(id)}`}>{id}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const SessionReplay: React.FC = () => {
  const [log, setLog] = useState<Array<Record<string, unknown>>>([]);
  const [index, setIndex] = useState(0);

  React.useEffect(() => {
    void fetch("/api/session/replay")
      .then((r) => r.json())
      .then((j) => setLog(j.log ?? []));
  }, []);

  const event = log[index];

  return (
    <div className="ns-panel ns-session-replay">
      <div className="ns-panel-title">Operator Session Replay</div>
      {event && (
        <div className="ns-session-event">
          <pre className="ns-envelope-detail">{JSON.stringify(event, null, 2)}</pre>
        </div>
      )}
      <button type="button" disabled={index <= 0} onClick={() => setIndex((i) => i - 1)}>
        Prev
      </button>
      <button
        type="button"
        disabled={index >= log.length - 1}
        onClick={() => setIndex((i) => i + 1)}
      >
        Next
      </button>
    </div>
  );
};

export const ReceiptLineageTree: React.FC = () => {
  const [root, setRoot] = useState("");
  const [tree, setTree] = useState<Record<string, unknown> | null>(null);

  async function load() {
    const res = await fetch(`/api/receipt/lineage/${encodeURIComponent(root)}`);
    const json = await res.json();
    setTree(json.tree);
  }

  function renderNode(node: Record<string, unknown>): React.ReactNode {
    const children = (node.children as Record<string, unknown>[]) ?? [];
    return (
      <li key={String(node.id)}>
        <strong>{String(node.id)}</strong> — {String(node.capabilityId)} —{" "}
        {String(node.timestamp)}
        {children.length > 0 && <ul>{children.map(renderNode)}</ul>}
      </li>
    );
  }

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Receipt Lineage</div>
      <input
        value={root}
        onChange={(e) => setRoot(e.target.value)}
        placeholder="Root receipt ID"
      />
      <button type="button" onClick={() => void load()}>
        Load
      </button>
      {tree && <ul>{renderNode(tree)}</ul>}
    </div>
  );
};

export const GovernanceImpactPanel: React.FC = () => {
  const [decisionId, setDecisionId] = useState("");
  const [impact, setImpact] = useState<Record<string, unknown> | null>(null);

  async function run() {
    const res = await fetch("/api/governance/impact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decisionId }),
    });
    const json = await res.json();
    setImpact(json.impact ?? null);
  }

  const closure = (impact?.transitiveClosure as string[]) ?? [];

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Governance Decision Impact</div>
      <input
        value={decisionId}
        onChange={(e) => setDecisionId(e.target.value)}
        placeholder="Decision ID"
      />
      <button type="button" onClick={() => void run()}>
        Analyze
      </button>
      {impact && (
        <>
          <pre className="ns-envelope-detail">{JSON.stringify(impact.decision, null, 2)}</pre>
          <h4>Transitive Closure</h4>
          <ul className="ns-link-list">
            {closure.map((id) => (
              <li key={id}>
                <Link to={`/nova/studio/proof-graph?node=${encodeURIComponent(id)}`}>{id}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export const MultiSliceReplayPanel: React.FC = () => {
  const [ids, setIds] = useState("");
  const [results, setResults] = useState<unknown[]>([]);

  async function run() {
    const receiptIds = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch("/api/slice/replay-multi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiptIds }),
    });
    const json = await res.json();
    setResults(json.results ?? []);
  }

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Multi-Slice Replay</div>
      <textarea
        value={ids}
        onChange={(e) => setIds(e.target.value)}
        placeholder="receipt-1, receipt-2"
        rows={3}
      />
      <button type="button" onClick={() => void run()}>
        Replay
      </button>
      {results.length > 0 && (
        <pre className="ns-envelope-detail">{JSON.stringify(results, null, 2)}</pre>
      )}
    </div>
  );
};

export const DriftAnomalyPanel: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Array<Record<string, unknown>>>([]);

  React.useEffect(() => {
    void fetch("/api/drift/anomalies")
      .then((r) => r.json())
      .then((j) => setAnomalies(j.anomalies ?? []));
  }, []);

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Drift Anomalies</div>
      {!anomalies.length && <div className="ns-meta">No data</div>}
      <ul className="ns-drift-anomalies">
        {anomalies.map((a) => (
          <li key={String(a.id)} className={a.isAnomaly ? "ns-anomaly" : ""}>
            <strong>{String(a.id)}</strong> — drift={String(a.driftCount)} — score=
            {Number(a.anomalyScore).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};
