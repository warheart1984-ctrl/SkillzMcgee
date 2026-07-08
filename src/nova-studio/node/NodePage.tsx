import React, { useEffect, useMemo, useState } from "react";

type NodeStatus = {
  node_id?: string;
  operator_id?: string;
  operator_key_id?: string;
  policy_version?: string;
  policy_hash?: string;
  conformance_profile?: string;
  receipt_count?: number;
  governance_health?: {
    ledger_entries?: number;
    continuity_events?: number;
    invalid_signatures?: number;
  };
  rate_limits?: {
    limits?: {
      per_user_per_minute?: number;
      per_user_per_hour?: number;
    };
    callers?: Record<string, { minute_count?: number; hour_count?: number; blocked_count?: number }>;
  };
  federation?: {
    peers?: unknown[];
    gossip_events?: number;
    trusted_gossip_events?: number;
    consensus?: {
      consensus_reached?: boolean;
      policy_hash?: string | null;
      agreement_ratio?: number;
    };
  };
  endpoints?: string[];
};

type NodeReceipt = {
  trace_id?: string;
  receipt_hash?: string;
  task_id?: string;
  timestamp?: string;
  receipt?: Record<string, unknown>;
};

type NodeLedger = {
  ledger?: unknown[];
  continuity?: unknown[];
};

type NodeContinuity = {
  events?: Array<{ event_id?: string; timestamp?: number | string; kind?: string; trace_id?: string; decision?: string }>;
};

type NodePolicy = {
  policy_version?: string;
  policy_hash?: string;
  current_policy?: string;
  previous_policy?: string;
  diff?: { added?: string[]; removed?: string[]; changed?: string[] };
};

type NodeMesh = {
  peers?: Array<{
    node_id?: string;
    trust_level?: string;
    policy_hash?: string;
    signature_valid?: boolean | null;
  }>;
  consensus_ratio?: number;
  divergent_peers?: string[];
};

type NodeAlert = {
  id?: string;
  timestamp?: string | number;
  severity?: string;
  category?: string;
  message?: string;
};

type NodeReplay = {
  trace_id?: string;
  deterministic?: boolean;
  original_output?: unknown;
  replayed_output?: unknown;
  diff?: unknown;
};

export const NodePage: React.FC = () => {
  const [status, setStatus] = useState<NodeStatus | null>(null);
  const [receipts, setReceipts] = useState<NodeReceipt[]>([]);
  const [ledger, setLedger] = useState<NodeLedger>({});
  const [continuity, setContinuity] = useState<NodeContinuity>({});
  const [policy, setPolicy] = useState<NodePolicy>({});
  const [mesh, setMesh] = useState<NodeMesh>({});
  const [alerts, setAlerts] = useState<NodeAlert[]>([]);
  const [replay, setReplay] = useState<NodeReplay | null>(null);
  const [selectedTrace, setSelectedTrace] = useState<string | null>(null);
  const [useNode, setUseNode] = useState(true);
  const [prompt, setPrompt] = useState("Hello from SkillzMcGee Node operator console.");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [hello, setHello] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setError(null);
    try {
      const [statusJson, receiptsJson, ledgerJson] = await Promise.all([
        fetchJson<NodeStatus>("/api/node/status"),
        fetchJson<{ receipts?: NodeReceipt[] }>("/api/node/receipts"),
        fetchJson<NodeLedger>("/api/node/ledger"),
      ]);
      setStatus(statusJson);
      setReceipts(receiptsJson.receipts ?? []);
      setLedger(ledgerJson);
      const [continuityJson, policyJson, meshJson, alertsJson] = await Promise.all([
        fetchJson<NodeContinuity>("/api/node/continuity"),
        fetchJson<NodePolicy>("/api/node/policy"),
        fetchJson<NodeMesh>("/api/node/mesh"),
        fetchJson<{ alerts?: NodeAlert[] }>("/api/node/alerts"),
      ]);
      setContinuity(continuityJson);
      setPolicy(policyJson);
      setMesh(meshJson);
      setAlerts(alertsJson.alerts ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 5000);
    return () => clearInterval(timer);
  }, []);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const endpoint = useNode ? "/api/node/submit" : "/api/capability/run";
      const body = useNode
        ? {
            task_id: `skillz-${Date.now()}`,
            intent: "chat",
            caller_id: "skillzmcgee",
            payload: { messages: [{ role: "user", content: prompt }] },
          }
        : {
            capabilityId: "llm_echo",
            inputs: { prompt },
          };
      const json = await fetchJson<Record<string, unknown>>(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setResult(json);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handshake() {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchJson<Record<string, unknown>>("/api/node/hello", {
        method: "POST",
      });
      setHello(json);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function replayTrace(traceId: string) {
    setLoading(true);
    setError(null);
    setSelectedTrace(traceId);
    try {
      const json = await fetchJson<NodeReplay>(`/api/node/replay/${encodeURIComponent(traceId)}`, {
        method: "POST",
      });
      setReplay(json);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const recentReceipts = useMemo(() => receipts.slice(-8).reverse(), [receipts]);
  const rateCallers = Object.entries(status?.rate_limits?.callers ?? {});
  const recentEvents = useMemo(() => (continuity.events ?? []).slice(-12).reverse(), [continuity.events]);

  return (
    <div className="ns-node-page">
      <section className="ns-panel">
        <div className="ns-node-header">
          <div>
            <h2>Node v0.1</h2>
            <p className="ns-flow-hint">Governed Nova-backed node for Cursor, operators, and federation.</p>
          </div>
          <label className="ns-node-toggle">
            <input
              type="checkbox"
              checked={useNode}
              onChange={(event) => setUseNode(event.target.checked)}
            />
            Use Node v0.1 (governed)
          </label>
        </div>

        <div className="ns-node-status-grid">
          <NodeMetric label="Node" value={status?.node_id ?? "offline"} />
          <NodeMetric label="Policy" value={status?.policy_version ?? "-"} />
          <NodeMetric label="Profile" value={status?.conformance_profile ?? "-"} />
          <NodeMetric label="Receipts" value={String(status?.receipt_count ?? 0)} />
        </div>

        <div className="ns-node-dashboard-grid">
          <section className="ns-section">
            <h3>Governance Health</h3>
            <pre className="ns-envelope-detail">
              {JSON.stringify(status?.governance_health ?? {}, null, 2)}
            </pre>
          </section>

          <section className="ns-section">
            <h3>Rate Limits</h3>
            <pre className="ns-envelope-detail">
              {JSON.stringify(
                {
                  limits: status?.rate_limits?.limits ?? {},
                  callers: rateCallers.slice(0, 5),
                },
                null,
                2,
              )}
            </pre>
          </section>

          <section className="ns-section">
            <h3>Federation</h3>
            <pre className="ns-envelope-detail">
              {JSON.stringify(status?.federation ?? {}, null, 2)}
            </pre>
            <button type="button" disabled={loading} onClick={() => void handshake()}>
              Handshake
            </button>
            {hello && <pre className="ns-envelope-detail">{JSON.stringify(hello, null, 2)}</pre>}
          </section>
        </div>

        <div className="ns-node-dashboard-grid">
          <section className="ns-section">
            <h3>Federation Mesh</h3>
            <p className="ns-flow-hint">Consensus ratio: {formatRatio(mesh.consensus_ratio)}</p>
            <ul className="ns-node-list">
              {(mesh.peers ?? []).slice(0, 6).map((peer) => (
                <li key={peer.node_id ?? peer.policy_hash ?? "peer"}>
                  <strong>{peer.node_id ?? "peer"}</strong>
                  <span>{peer.trust_level ?? "limited"}</span>
                  <span>{peer.signature_valid === false ? "invalid signature" : "signature ok"}</span>
                </li>
              ))}
              {(mesh.peers ?? []).length === 0 && <li>No peers observed.</li>}
            </ul>
          </section>

          <section className="ns-section">
            <h3>Governance Alerts</h3>
            <ul className="ns-node-list">
              {alerts.slice(0, 6).map((alert) => (
                <li key={alert.id ?? `${alert.category}-${alert.timestamp}`}>
                  <strong>{(alert.severity ?? "info").toUpperCase()}</strong>
                  <span>{alert.category ?? "governance"}</span>
                  <span>{alert.message ?? ""}</span>
                </li>
              ))}
              {alerts.length === 0 && <li>No alerts.</li>}
            </ul>
          </section>

          <section className="ns-section">
            <h3>Policy Diff</h3>
            <p className="ns-flow-hint">Policy {policy.policy_version ?? "-"} · {shortHash(policy.policy_hash)}</p>
            <pre className="ns-envelope-detail">{JSON.stringify(policy.diff ?? {}, null, 2)}</pre>
          </section>
        </div>

        <div className="ns-section">
          <label className="ns-input-row">
            <span>Prompt</span>
            <textarea
              className="ns-node-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </label>
          <button type="button" disabled={loading} onClick={() => void submit()}>
            {loading ? "Submitting..." : useNode ? "Submit via Node" : "Run direct capability"}
          </button>
        </div>

        {error && <p className="ns-error">{error}</p>}
        {result && (
          <section className="ns-section">
            <h3>Last Result</h3>
            <pre className="ns-envelope-detail">{JSON.stringify(result, null, 2)}</pre>
          </section>
        )}
      </section>

      <section className="ns-node-grid">
        <div className="ns-panel">
          <h3>Replay Explorer</h3>
          <ul className="ns-receipt-rows">
            {recentReceipts.map((receipt, index) => (
              <li key={receipt.receipt_hash ?? receipt.trace_id ?? index}>
                <strong>{receipt.trace_id ?? "trace"}</strong>
                <span> {receipt.receipt_hash ?? receipt.receipt?.receipt_hash ?? ""}</span>
                {receipt.trace_id && (
                  <button type="button" disabled={loading} onClick={() => void replayTrace(receipt.trace_id ?? "")}>
                    Replay
                  </button>
                )}
              </li>
            ))}
            {recentReceipts.length === 0 && <li>No receipts yet.</li>}
          </ul>
          {replay && (
            <div className="ns-section">
              <h4>Replay Result {selectedTrace}</h4>
              <p className="ns-flow-hint">Deterministic: {replay.deterministic ? "yes" : "no"}</p>
              <pre className="ns-envelope-detail">{JSON.stringify(replay, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="ns-panel">
          <h3>Continuity Graph</h3>
          <div className="ns-continuity-graph">
            {recentEvents.map((event, index) => (
              <div
                className={`ns-continuity-marker ns-continuity-${event.decision ?? event.kind ?? "event"}`}
                key={event.event_id ?? `${event.kind}-${index}`}
                title={`${event.kind ?? "event"} ${event.trace_id ?? ""}`}
              >
                <span>{event.kind ?? "event"}</span>
              </div>
            ))}
            {recentEvents.length === 0 && <p className="ns-flow-hint">No continuity events yet.</p>}
          </div>
        </div>
      </section>

      <section className="ns-node-grid">
        <div className="ns-panel">
          <h3>Node Receipts</h3>
          <pre className="ns-envelope-detail">{JSON.stringify(recentReceipts, null, 2)}</pre>
        </div>

        <div className="ns-panel">
          <h3>Node Ledger</h3>
          <pre className="ns-envelope-detail">
            {JSON.stringify(
              {
                governance_entries: ledger.ledger?.length ?? 0,
                continuity_entries: ledger.continuity?.length ?? 0,
                policy_hash: status?.policy_hash,
                operator_key_id: status?.operator_key_id,
              },
              null,
              2,
            )}
          </pre>
        </div>
      </section>
    </div>
  );
};

const NodeMetric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="ns-node-metric">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

function formatRatio(value?: number): string {
  if (typeof value !== "number") return "-";
  return `${Math.round(value * 100)}%`;
}

function shortHash(value?: string): string {
  if (!value) return "-";
  return value.length > 18 ? `${value.slice(0, 18)}...` : value;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const json = await response.json();
  if (!response.ok || json?.ok === false) {
    throw new Error(json?.error ?? json?.upstream?.error?.reason ?? response.statusText);
  }
  return json as T;
}
