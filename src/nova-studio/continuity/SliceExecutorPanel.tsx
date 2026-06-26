import React, { useState } from "react";
import { useContinuity } from "./ContinuityContext";

export const SliceExecutorPanel: React.FC = () => {
  const { refresh } = useContinuity();
  const [sliceId, setSliceId] = useState("nova-slice-1");
  const [payload, setPayload] = useState('{"value": 41}');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  async function run() {
    setParseError(null);
    let parsed: Record<string, unknown> = {};
    if (payload.trim()) {
      try {
        parsed = JSON.parse(payload) as Record<string, unknown>;
      } catch {
        setParseError("Invalid JSON payload");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/slice/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sliceId, payload: parsed }),
      });
      const json = await res.json();
      setResult(json);
      if (json.ok) refresh();
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ns-panel ns-slice-executor">
      <h3>Run Governed Slice</h3>
      <label className="ns-label">Slice ID</label>
      <input value={sliceId} onChange={(e) => setSliceId(e.target.value)} />
      <label className="ns-label">Payload (JSON)</label>
      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder='{"intent":"test"}'
        rows={4}
      />
      {parseError && <p className="ns-error">{parseError}</p>}
      <button type="button" disabled={loading} onClick={() => void run()}>
        {loading ? "Executing…" : "Execute"}
      </button>
      {result && (
        <div className="ns-slice-result">
          <h4>Result</h4>
          <pre className="ns-envelope-detail">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
