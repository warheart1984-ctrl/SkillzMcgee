import type {
  CanvasValidationIssue,
  CanvasValidationResult,
  WorkflowCanvasV1,
} from "./types.js";

function issue(invariant: string, message: string, entityId?: string): CanvasValidationIssue {
  return { invariant, message, entityId };
}

/** Enforce CMS-1.0 invariants on a Canvas v1.0 document. */
export function validateCanvas(canvas: WorkflowCanvasV1): CanvasValidationResult {
  const issues: CanvasValidationIssue[] = [];

  const obsIds = new Set(canvas.observationSet.observations.map((o) => o.id));
  const fndIds = new Set(canvas.findingsSet.findings.map((f) => f.id));
  const recIds = new Set(canvas.recommendationSet.recommendations.map((r) => r.id));
  const outIds = new Set(canvas.expectedOutcomeSet.expectedOutcomes.map((o) => o.id));
  const metIds = new Set(canvas.successMetricSet.successMetrics.map((m) => m.id));

  for (const f of canvas.findingsSet.findings) {
    if (f.observationIds.length === 0) {
      issues.push(issue("CMS-2", "Finding without observation citation", f.id));
    }
    for (const oid of f.observationIds) {
      if (!obsIds.has(oid)) {
        issues.push(issue("CMS-2", `Finding cites unknown observation ${oid}`, f.id));
      }
    }
  }

  for (const r of canvas.recommendationSet.recommendations) {
    if (r.findingIds.length === 0) {
      issues.push(issue("CMS-1", "Recommendation without finding citation", r.id));
    }
    for (const fid of r.findingIds) {
      if (!fndIds.has(fid)) {
        issues.push(issue("CMS-1", `Recommendation cites unknown finding ${fid}`, r.id));
      }
    }
  }

  for (const o of canvas.expectedOutcomeSet.expectedOutcomes) {
    if (o.recommendationIds.length === 0) {
      issues.push(issue("CMS-4", "Expected outcome without recommendation citation", o.id));
    }
    for (const rid of o.recommendationIds) {
      if (!recIds.has(rid)) {
        issues.push(issue("CMS-4", `Outcome cites unknown recommendation ${rid}`, o.id));
      }
    }
  }

  for (const m of canvas.successMetricSet.successMetrics) {
    if (m.expectedOutcomeIds.length === 0) {
      issues.push(issue("CMS-4", "Success metric without expected outcome citation", m.id));
    }
    for (const oid of m.expectedOutcomeIds) {
      if (!outIds.has(oid)) {
        issues.push(issue("CMS-4", `Metric cites unknown outcome ${oid}`, m.id));
      }
    }
  }

  for (const chain of canvas.traceabilityMap.chains) {
    if (!obsIds.has(chain.observationId)) {
      issues.push(issue("CMS-3", `Chain ${chain.chainId} unknown observation`, chain.chainId));
    }
    if (!fndIds.has(chain.findingId)) {
      issues.push(issue("CMS-3", `Chain ${chain.chainId} unknown finding`, chain.chainId));
    }
    if (!recIds.has(chain.recommendationId)) {
      issues.push(issue("CMS-3", `Chain ${chain.chainId} unknown recommendation`, chain.chainId));
    }
    if (!outIds.has(chain.expectedOutcomeId)) {
      issues.push(issue("CMS-3", `Chain ${chain.chainId} unknown outcome`, chain.chainId));
    }
    if (!metIds.has(chain.successMetricId)) {
      issues.push(issue("CMS-3", `Chain ${chain.chainId} unknown metric`, chain.chainId));
    }
  }

  const citedObs = new Set<string>();
  const citedRec = new Set<string>();
  for (const chain of canvas.traceabilityMap.chains) {
    citedObs.add(chain.observationId);
    citedRec.add(chain.recommendationId);
  }

  for (const r of canvas.recommendationSet.recommendations) {
    if (!citedRec.has(r.id)) {
      issues.push(issue("CMS-3", "Recommendation not in traceability map", r.id));
    }
    let tracesToObs = false;
    for (const fid of r.findingIds) {
      const finding = canvas.findingsSet.findings.find((f) => f.id === fid);
      if (finding?.observationIds.some((oid) => citedObs.has(oid))) tracesToObs = true;
    }
    if (!tracesToObs) {
      issues.push(issue("CMS-1", "Recommendation does not trace to an observation", r.id));
    }
  }

  if (canvas.methodology !== "CMS-1.0") {
    issues.push(issue("CMS-0", `Expected methodology CMS-1.0, got ${canvas.methodology}`));
  }

  return {
    valid: issues.length === 0,
    issues,
    chainCount: canvas.traceabilityMap.chains.length,
    observationCount: canvas.observationSet.observations.length,
  };
}

/** Build traceability chains from a fully linked canvas (one chain per metric leaf). */
export function assembleTraceabilityMap(canvas: Omit<WorkflowCanvasV1, "traceabilityMap">): WorkflowCanvasV1["traceabilityMap"] {
  const chains: WorkflowCanvasV1["traceabilityMap"]["chains"] = [];
  let idx = 1;

  for (const metric of canvas.successMetricSet.successMetrics) {
    for (const outcomeId of metric.expectedOutcomeIds) {
      const outcome = canvas.expectedOutcomeSet.expectedOutcomes.find((o) => o.id === outcomeId);
      if (!outcome) continue;
      for (const recId of outcome.recommendationIds) {
        const rec = canvas.recommendationSet.recommendations.find((r) => r.id === recId);
        if (!rec) continue;
        for (const fndId of rec.findingIds) {
          const finding = canvas.findingsSet.findings.find((f) => f.id === fndId);
          if (!finding) continue;
          for (const obsId of finding.observationIds) {
            chains.push({
              chainId: `CHAIN-${String(idx++).padStart(3, "0")}`,
              observationId: obsId,
              findingId: fndId,
              recommendationId: recId,
              expectedOutcomeId: outcomeId,
              successMetricId: metric.id,
            });
          }
        }
      }
    }
  }

  return {
    mapVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    chains,
  };
}
