import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCapabilities } from "./useCapabilities";

export const CapabilityRunner: React.FC = () => {
  const { selected } = useCapabilities();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null);
  const [verdict, setVerdict] = useState<Record<string, unknown> | null>(null);
  const [provenance, setProvenance] = useState<Record<string, unknown> | null>(null);
  const [drift, setDrift] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;
    const initial: Record<string, string> = {};
    (selected.inputs ?? []).forEach((inp) => {
      initial[inp.name] = inp.name === "value" ? "41" : "";
    });
    setInputs(initial);
    setReceipt(null);
    setVerdict(null);
    setProvenance(null);
    setDrift(null);
    setError(null);
  }, [selected]);

  if (!selected) return <div className="ns-panel">Select a capability</div>;

  async function run() {
    setLoading(true);
    setReceipt(null);
    setVerdict(null);
    setProvenance(null);
    setDrift(null);
    setError(null);

    const parsed: Record<string, unknown> = {};
    for (const inp of selected.inputs ?? []) {
      const raw = inputs[inp.name] ?? "";
      parsed[inp.name] = inp.type === "number" ? Number(raw) : raw;
    }

    try {
      const res = await fetch("/api/capability/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capabilityId: selected.id, inputs: parsed }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "Execution failed");
        setReceipt({ error: json.error });
        return;
      }
      setReceipt(json.receipt ?? null);
      setVerdict(json.verdict ?? null);
      setProvenance(json.provenance ?? null);
      setDrift(json.drift ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const receiptId = receipt && typeof receipt.id === "string" ? receipt.id : null;

  return (
    <div className="ns-panel ns-capability-runner">
      <h3>Run Capability: {selected.name}</h3>
      <p className="ns-flow-hint">Inputs → Execution → Receipt → Law Kernel → Provenance</p>

      {(selected.inputs ?? []).map((inp) => (
        <div key={inp.name} className="ns-input-row">
          <label>{inp.name}</label>
          <input
            value={inputs[inp.name] ?? ""}
            onChange={(e) => setInputs({ ...inputs, [inp.name]: e.target.value })}
            placeholder={inp.description}
          />
        </div>
      ))}

      <button type="button" disabled={loading} onClick={() => void run()}>
        {loading ? "Executing…" : "Execute"}
      </button>

      {error && <p className="ns-error">{error}</p>}

      {receipt && (
        <div className="ns-section">
          <h4>Receipt</h4>
          {receiptId && (
            <p className="ns-meta">
              <Link to="/nova/studio/continuity">Continuity</Link>
              {" · "}
              <Link to={`/nova/studio/proof-graph?node=${encodeURIComponent(selected.id)}`}>
                Proof graph
              </Link>
            </p>
          )}
          <pre className="ns-envelope-detail">{JSON.stringify(receipt, null, 2)}</pre>
        </div>
      )}

      {verdict && (
        <div className="ns-section">
          <h4>Law Kernel Verdict</h4>
          <pre className="ns-envelope-detail">{JSON.stringify(verdict, null, 2)}</pre>
        </div>
      )}

      {provenance && (
        <div className="ns-section">
          <h4>Provenance</h4>
          <pre className="ns-envelope-detail">{JSON.stringify(provenance, null, 2)}</pre>
        </div>
      )}

      {drift && (
        <div className="ns-section">
          <h4>Drift</h4>
          <pre className="ns-envelope-detail">{JSON.stringify(drift, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
