# Consulting Methodology Specification (CMS-1.0)

**Version:** 1.0 Â· **Canvas:** [Workflow-Modeling-Canvas-v1.0.md](./Workflow-Modeling-Canvas-v1.0.md)

---

## 1. Purpose

Define a governed, evidence-based workflow analysis and transformation methodology.

CMS-1.0 applies to consulting engagements, internal operator reviews, and Nova Studio agent-assisted modeling (WM-A1.0).

---

## 2. Stages

| Stage | Name | Activity | Output |
|-------|------|----------|--------|
| 1 | Model Reality | Capture the system as it exists | Observation Set |
| 2 | Analyze Reality | Interpret observations into structured insights | Findings Set |
| 3 | Govern Change | Define interventions grounded in evidence | Recommendation Set |
| 4 | Predict Outcomes | Define what should improve and why | Expected Outcome Set |
| 5 | Measure Results | Define how improvement will be validated | Success Metric Set |
| 6 | Assemble Traceability | Link the full evidence chain | Traceability Map |

---

## 3. Invariants

1. **No recommendation without an observation.**
2. **No interpretation without evidence.**
3. **No future state without traceability.**
4. **No metric without a predicted outcome.**
5. **No change without governance.**

Violations are **blocking** for engagement verification.

---

## 4. Required artifacts

| Artifact | Schema |
|----------|--------|
| Observation Set | `observation-set.schema.json` |
| Findings Set | `findings-set.schema.json` |
| Recommendation Set | `recommendation-set.schema.json` |
| Expected Outcome Set | `expected-outcome-set.schema.json` |
| Success Metric Set | `success-metric-set.schema.json` |
| Traceability Map | `traceability-map.schema.json` |

---

## 5. Verification

A consulting engagement is **valid** when:

- Every recommendation traces to an observation (via findings).
- Every finding is evidence-backed (observation IDs present).
- Every outcome is measurable (success metrics defined).
- Every metric is defined **before** implementation.
- Traceability map validates with zero orphan recommendations or metrics.

Use `workflow-canvas/validate.ts` for automated checks.

---

## 6. Governance integration

CMS-1.0 complements COR Suite governance:

- Observations may reference CAR artifacts as evidence.
- Findings may cite CAV/COR structural issues.
- Recommendations requiring release **MUST** pass constitutional governance pipeline.

See [GOV-INV-1.0.md](../../governance/invariants/GOV-INV-1.0.md).
