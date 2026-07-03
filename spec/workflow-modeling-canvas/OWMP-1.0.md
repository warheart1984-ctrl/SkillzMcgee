# Operator Workflow Modeling Protocol (OWMP-1.0)

**Version:** 1.0 · **Audience:** Internal operators, auditors, Nova Studio agents

Technical, rigor-focused protocol for executing CMS-1.0 engagements.

---

## Stage 1 — Observation Capture

- Capture raw workflow events.
- **No interpretation allowed.**
- Assign monotonic IDs: `OBS-001`, `OBS-002`, …
- Produce **Observation Set**.

**Exit criteria:** Every observation has actors, steps, and source reference.

---

## Stage 2 — Analytical Derivation

- Convert observations into **Findings**.
- **Must cite Observation IDs** on every finding.
- Produce **Findings Set**.

**Exit criteria:** Zero findings without `observationIds[]`.

---

## Stage 3 — Recommendation Synthesis

- Each recommendation **must cite at least one Finding**.
- Include governance implications and constraints.
- Produce **Recommendation Set**.

**Exit criteria:** Zero recommendations without `findingIds[]`.

---

## Stage 4 — Outcome Projection

- Define expected improvements.
- **Must cite Recommendation IDs**.
- Produce **Expected Outcome Set**.

**Exit criteria:** Zero outcomes without `recommendationIds[]`.

---

## Stage 5 — Metric Definition

- Define measurable indicators (quantitative where possible).
- **Must cite Expected Outcome IDs**.
- Metrics **MUST** be defined before implementation begins.
- Produce **Success Metric Set**.

**Exit criteria:** Zero metrics without `expectedOutcomeIds[]`.

---

## Stage 6 — Traceability Assembly

- Build full chain: Observation → Finding → Recommendation → Outcome → Metric.
- **Validate monotonicity** (no broken links, no orphan nodes).
- Produce **Traceability Map**.

**Automated validation:** `npm run workflow-canvas:validate` (skillzmcgee)

---

## Operator checklist

- [ ] Observation Set complete — no interpretation fields populated
- [ ] Findings cite observations
- [ ] Recommendations cite findings
- [ ] Outcomes cite recommendations
- [ ] Metrics cite outcomes
- [ ] Traceability map validates
- [ ] Human operator review complete (required for WM-A1.0 agent output)
