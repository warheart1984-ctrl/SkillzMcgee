import React, { useState } from "react";
import { useOperatorContext } from "../state/operatorContext";
import { useSubstrateEvents } from "../hooks/useSubstrateEvents";
import { runCapability } from "../state/substrateStreams";
import { ReceiptFeed } from "./ReceiptFeed";
import { DriftVisualizer } from "./DriftVisualizer";
import { ContinuityTimeline } from "./ContinuityTimeline";

const DEFAULT_CAPABILITY = "slice_math";
const DEFAULT_INPUT = '{\n  "value": 41\n}';

const OperatorBadge: React.FC<{ operatorId: string }> = ({ operatorId }) => (
  <div className="ns-operator-badge" title="Operator identity (evidence-bound)">
    <span className="ns-operator-badge-label">Operator</span>
    <span className="ns-operator-badge-id">{operatorId}</span>
  </div>
);

const InputEditor: React.FC<{
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <label className="ns-input-editor">
    <span className="ns-panel-title">Input (JSON)</span>
    <textarea
      className="ns-json-input"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      spellCheck={false}
    />
  </label>
);

export const RunCapabilityPanel: React.FC = () => {
  const { operatorId } = useOperatorContext();
  const { continuity, drift } = useSubstrateEvents();
  const [capabilityId, setCapabilityId] = useState(DEFAULT_CAPABILITY);
  const [inputJson, setInputJson] = useState(DEFAULT_INPUT);
  const [running, setRunning] = useState(false);
  const [lastEnvelope, setLastEnvelope] = useState<Record<string, unknown> | null>(
    null,
  );
  const [lastVerdict, setLastVerdict] = useState<Record<string, unknown> | null>(null);
  const [lastProvenance, setLastProvenance] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setError(null);
    let input: unknown;
    try {
      input = JSON.parse(inputJson);
    } catch {
      setError("Invalid JSON input");
      return;
    }

    setRunning(true);
    try {
      const result = await runCapability({
        capabilityId,
        operator: operatorId,
        input: input as Record<string, unknown>,
      });
      if (!result) {
        setError("Run failed — no response from runtime");
        return;
      }
      const envelope = (result.envelope ?? result.output) as Record<string, unknown>;
      setLastEnvelope(envelope);
      setLastVerdict((result.verdict as Record<string, unknown>) ?? null);
      setLastProvenance((result.provenance as Record<string, unknown>) ?? null);
      if (result.violations?.length) {
        setError(`Invariant violations: ${result.violations.join(", ")}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }

  const violations = (lastEnvelope?.invariantViolations as string[] | undefined) ?? [];
  const drift = (lastVerdict?.drift as unknown[]) ?? [];
  const proofGraph = lastProvenance?.proofGraph as Record<string, unknown> | undefined;
  const receiptId = lastEnvelope?.id as string | undefined;

  async function replayContinuity() {
    if (!lastEnvelope?.continuityCheckpoint) return;
    const res = await fetch("/api/continuity/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkpoint: lastEnvelope.continuityCheckpoint }),
    });
    const json = await res.json();
    console.log("Continuity replay:", json);
    alert("Replay complete. See console for details.");
  }

  async function replaySlice() {
    if (!receiptId) return;
    const res = await fetch("/api/slice/replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiptId }),
    });
    const json = await res.json();
    setLastEnvelope((json.envelope ?? json.newReceipt) as Record<string, unknown>);
    setLastVerdict(json.verdict as Record<string, unknown>);
    setLastProvenance(json.provenance as Record<string, unknown>);
  }

  return (
    <div className="ns-run-capability">
      <div className="ns-panel ns-run-header">
        <div className="ns-panel-title">Run Capability</div>
        <OperatorBadge operatorId={operatorId} />
        <label className="ns-cap-select">
          <span>Capability</span>
          <input
            type="text"
            value={capabilityId}
            onChange={(e) => setCapabilityId(e.target.value)}
            disabled={running}
          />
        </label>
        <InputEditor
          value={inputJson}
          onChange={setInputJson}
          disabled={running}
        />
        <button
          type="button"
          className="ns-run-button"
          disabled={running}
          onClick={() => void handleRun()}
        >
          {running ? "Running…" : "Run"}
        </button>
        {error && <p className="ns-run-error">{error}</p>}
      </div>

      {lastEnvelope && (
        <div className="ns-panel ns-envelope-status">
          <div className="ns-panel-title">Envelope Status</div>
          <pre className="ns-envelope-detail">
            {JSON.stringify(lastEnvelope, null, 2)}
          </pre>
          {violations.length > 0 && (
            <div className="ns-invariant-violations">
              <strong>Invariant violations</strong>
              <ul>
                {violations.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          )}
          {lastVerdict && (
            <div className="ns-verdict-panel">
              <strong>Law kernel verdict: </strong>
              <span className={lastVerdict.ok ? "ns-status-ok" : "ns-status-error"}>
                {lastVerdict.ok ? "OK" : "DRIFT / VIOLATIONS"}
              </span>
            </div>
          )}
          {drift.length > 0 && (
            <div className="ns-drift-warning">
              <h4>Drift Detected</h4>
              <pre>{JSON.stringify(drift, null, 2)}</pre>
            </div>
          )}
          {proofGraph && (
            <div className="ns-section">
              <h4>Proof Graph Links</h4>
              <ul className="ns-link-list">
                <li>
                  <a
                    href={`/nova/studio/proof-graph?node=${encodeURIComponent(
                      String((proofGraph.implementation as { id?: string })?.id ?? ""),
                    )}`}
                  >
                    Implementation Node
                  </a>
                </li>
                {((proofGraph.dependencies as Array<{ id: string }>) ?? []).map((d) => (
                  <li key={d.id}>
                    <a href={`/nova/studio/proof-graph?node=${encodeURIComponent(d.id)}`}>
                      {d.id}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {receiptId && (
            <div className="ns-receipt-actions">
              <button type="button" className="ns-button-link" onClick={() => void replayContinuity()}>
                Replay Continuity From Here
              </button>
              <button type="button" className="ns-button-link" onClick={() => void replaySlice()}>
                Replay Slice
              </button>
              <a
                className="ns-button-link"
                href={`/nova/studio/audit?receipt=${encodeURIComponent(receiptId)}`}
              >
                Open in Auditor Mode
              </a>
              <a
                className="ns-button-link"
                href={`/nova/studio/investigate?receipt=${encodeURIComponent(receiptId)}`}
              >
                Investigate Receipt
              </a>
            </div>
          )}
        </div>
      )}

      <div className="novaStudio-grid">
        <ReceiptFeed />
        <ContinuityTimeline events={continuity} />
      </div>
      <DriftVisualizer points={drift} />
    </div>
  );
};
