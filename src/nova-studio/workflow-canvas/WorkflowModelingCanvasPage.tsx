import React, { useEffect, useMemo, useState } from "react";
import { validateCanvas, type WorkflowCanvasV1, type CanvasValidationResult } from "../../../workflow-canvas/index.js";
import exampleCanvas from "../../../workflow-canvas/examples/canvas-v1.0.example.json";

const OWMP_CHECKLIST = [
  "Observation Set complete â€” no interpretation in Layer 1",
  "Findings cite observation IDs",
  "Recommendations cite finding IDs",
  "Expected outcomes cite recommendation IDs",
  "Success metrics cite expected outcome IDs",
  "Traceability map validates (monotonic chain)",
  "Human operator review complete (WM-A1.0)",
] as const;

export const WorkflowModelingCanvasPage: React.FC = () => {
  const [canvas, setCanvas] = useState<WorkflowCanvasV1 | null>(null);
  const [validation, setValidation] = useState<CanvasValidationResult | null>(null);
  const [layer, setLayer] = useState<1 | 2 | 3 | 4>(1);
  const [operatorReviewed, setOperatorReviewed] = useState(false);

  useEffect(() => {
    const data = exampleCanvas as WorkflowCanvasV1;
    setCanvas(data);
    setValidation(validateCanvas(data));
    setOperatorReviewed(Boolean(data.operatorReviewed));
  }, []);

  const chainPreview = useMemo(() => {
    if (!canvas) return [];
    return canvas.traceabilityMap.chains.slice(0, 10).map((c) => ({
      chain: `${c.observationId} â†’ ${c.findingId} â†’ ${c.recommendationId} â†’ ${c.expectedOutcomeId} â†’ ${c.successMetricId}`,
      id: c.chainId,
    }));
  }, [canvas]);

  if (!canvas || !validation) {
    return (
      <div className="ns-page">
        <h1>Workflow Modeling Canvas v1.0</h1>
        <p>Loading canvasâ€¦</p>
      </div>
    );
  }

  return (
    <div className="ns-page">
      <h1>Workflow Modeling Canvas v1.0</h1>
      <p className="ns-muted">
        CMS-1.0 Â· Evidence chain: Observation â†’ Finding â†’ Recommendation â†’ Outcome â†’ Metric
      </p>

      <section className="ns-section">
        <h2>Validation ({validation.valid ? "valid" : "issues"})</h2>
        <p>
          {validation.observationCount} observations Â· {validation.chainCount} traceability chains
        </p>
        {!validation.valid && (
          <ul className="ns-list">
            {validation.issues.map((v, i) => (
              <li key={`${v.invariant}-${i}`}>
                <span className="ns-badge ns-badge-fail">{v.invariant}</span> {v.message}
                {v.entityId ? ` (${v.entityId})` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ns-section">
        <h2>Layer Navigation</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {([1, 2, 3, 4] as const).map((n) => (
            <button
              key={n}
              type="button"
              className={layer === n ? "ns-button active" : "ns-button"}
              onClick={() => setLayer(n)}
            >
              Layer {n}
            </button>
          ))}
        </div>
      </section>

      {layer === 1 && (
        <section className="ns-section">
          <h2>Layer 1 â€” Current State (Observation Set)</h2>
          <p>Raw facts only â€” no interpretation.</p>
          <pre className="ns-pre">{JSON.stringify(canvas.observationSet, null, 2)}</pre>
        </section>
      )}

      {layer === 2 && (
        <section className="ns-section">
          <h2>Layer 2 â€” Analysis (Findings Set)</h2>
          <pre className="ns-pre">{JSON.stringify(canvas.findingsSet, null, 2)}</pre>
        </section>
      )}

      {layer === 3 && (
        <section className="ns-section">
          <h2>Layer 3 â€” Future State</h2>
          <h3>Recommendations</h3>
          <pre className="ns-pre">{JSON.stringify(canvas.recommendationSet, null, 2)}</pre>
          <h3>Expected Outcomes</h3>
          <pre className="ns-pre">{JSON.stringify(canvas.expectedOutcomeSet, null, 2)}</pre>
        </section>
      )}

      {layer === 4 && (
        <section className="ns-section">
          <h2>Layer 4 â€” Evidence Chain</h2>
          <h3>Success Metrics</h3>
          <pre className="ns-pre">{JSON.stringify(canvas.successMetricSet, null, 2)}</pre>
          <h3>Traceability Map</h3>
          <ul className="ns-list">
            {chainPreview.map((c) => (
              <li key={c.id}>
                <code>{c.id}</code>: {c.chain}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="ns-section">
        <h2>WM-A1.0 Operator Review Checklist</h2>
        <ul className="ns-list">
          {OWMP_CHECKLIST.map((item) => (
            <li key={item}>
              <span className={`ns-badge ns-badge-${validation.valid ? "ok" : "fail"}`}>
                {validation.valid ? "âœ“" : "â—‹"}
              </span>{" "}
              {item}
            </li>
          ))}
          <li>
            <label>
              <input
                type="checkbox"
                checked={operatorReviewed}
                onChange={(e) => setOperatorReviewed(e.target.checked)}
              />{" "}
              Operator reviewed (required before client delivery)
            </label>
          </li>
        </ul>
      </section>

      <section className="ns-section">
        <h2>Engagement</h2>
        <pre className="ns-pre">
          {JSON.stringify(
            {
              engagementId: canvas.engagementId,
              methodology: canvas.methodology,
              canvasVersion: canvas.canvasVersion,
              operatorReviewed,
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
};
