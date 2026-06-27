import React, { useCallback, useEffect, useState } from "react";
import "./CanonViewerPanel.css";

export default function CanonViewerPanel() {
  const [canon, setCanon] = useState("");
  const [parsed, setParsed] = useState({});
  const [diff, setDiff] = useState(null);
  const [freeze, setFreeze] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFrozen = freeze?.canon_state === "FROZEN";
  const canonVersion = freeze?.canon_version ?? "—";

  const loadCanon = useCallback(async (regenerate = false) => {
    setLoading(true);
    setError(null);
    try {
      const metaRes = await fetch("/api/communication/canon/freeze");
      const metaData = await metaRes.json();
      const frozen = metaData.canon_state === "FROZEN";
      setFreeze(metaData);

      const mdRes = await fetch(
        `/api/communication/canon?format=md${regenerate && !frozen ? "&regenerate=true" : ""}`,
      );
      if (!mdRes.ok) throw new Error("Failed to load canon markdown");
      const md = await mdRes.text();
      setCanon(md);

      const qs = regenerate && !frozen ? "?regenerate=true" : "";
      const parsedRes = await fetch(`/api/communication/canon/parsed${qs}`);
      const parsedData = await parsedRes.json();
      setParsed(parsedData.parsed ?? {});
      if (parsedData.freeze) setFreeze(parsedData.freeze);

      if (showDiff) {
        const diffRes = await fetch(
          `/api/communication/canon/diff?regenerate=${regenerate && !frozen}`,
        );
        const diffData = await diffRes.json();
        setDiff(diffData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Canon load failed");
    } finally {
      setLoading(false);
    }
  }, [showDiff]);

  useEffect(() => {
    void loadCanon(false);
    const interval = setInterval(() => void loadCanon(false), 30000);
    return () => clearInterval(interval);
  }, [loadCanon]);

  useEffect(() => {
    if (showDiff) {
      void fetch(`/api/communication/canon/diff?regenerate=${!isFrozen}`)
        .then((r) => r.json())
        .then(setDiff)
        .catch(() => setDiff(null));
    } else {
      setDiff(null);
    }
  }, [showDiff, isFrozen]);

  return (
    <div className={`canon-viewer${isFrozen ? " canon-viewer-frozen" : ""}`}>
      <header className="canon-viewer-header">
        <h2>
          {isFrozen
            ? `COMM-CANON v${canonVersion} — FROZEN`
            : "Communication Canon"}
        </h2>
        <div className="canon-viewer-actions">
          <label className="canon-diff-toggle">
            <input
              type="checkbox"
              checked={showDiff}
              onChange={(e) => setShowDiff(e.target.checked)}
            />
            Diff mode
          </label>
          <button
            type="button"
            disabled={loading || isFrozen}
            title={
              isFrozen
                ? `Frozen — changes require ${freeze?.required_amendment ?? "AAIS-COMM-Λ-003"}`
                : "Regenerate canon from live runtime"
            }
            onClick={() => void loadCanon(true)}
          >
            Regenerate
          </button>
        </div>
      </header>

      {isFrozen && (
        <div className="canon-freeze-banner" role="status">
          <strong>Canon is frozen.</strong>
          <span>
            All changes require amendment{" "}
            {freeze?.required_amendment ?? "AAIS-COMM-Λ-003"}.
          </span>
          {freeze?.baseline_id && (
            <span className="canon-freeze-baseline">Baseline: {freeze.baseline_id}</span>
          )}
        </div>
      )}

      {loading && <p className="canon-status">Loading canon…</p>}
      {error && <p className="canon-error">{error}</p>}

      {showDiff && diff && diff.mode === "frozen_baseline" && (
        <p className="canon-status">
          Diff compares live runtime projection against sealed baseline{" "}
          {diff.baseline_id ?? freeze?.baseline_id}.
        </p>
      )}

      {showDiff && diff && diff.change_count > 0 && (
        <div className="canon-diff-summary">
          <h3>Structural Diff ({diff.change_count} sections changed)</h3>
          <ul>
            {diff.changed_sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
          <pre className="canon-diff-detail">{JSON.stringify(diff.diffs, null, 2)}</pre>
        </div>
      )}

      {showDiff && diff && diff.change_count === 0 && (
        <p className="canon-status">No structural changes since last canon.</p>
      )}

      <div className="canon-sections">
        {Object.entries(parsed).map(([title, json]) => (
          <div key={title} className="canon-section">
            <h3>{title}</h3>
            <pre>{JSON.stringify(json, null, 2)}</pre>
          </div>
        ))}
      </div>

      <details className="canon-raw">
        <summary>Raw Canon Markdown</summary>
        <pre>{canon}</pre>
      </details>
    </div>
  );
}
