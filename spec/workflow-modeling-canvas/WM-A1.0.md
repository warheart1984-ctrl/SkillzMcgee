# Nova Studio Workflow Modeling Agent (WM-A1.0)

**Version:** A1.0 Â· **Protocol:** [OWMP-1.0](./OWMP-1.0.md) Â· **Canvas:** [Workflow-Modeling-Canvas-v1.0.md](./Workflow-Modeling-Canvas-v1.0.md)

Agent-ready specification for AI-assisted workflow modeling in Nova Studio.

---

## Agent inputs

| Input type | Usage |
|------------|--------|
| Raw workflow transcripts | Observation extraction |
| Process logs | Step timing, handoffs, wait states |
| Interviews | Actor and decision-point capture |
| Artifacts | Evidence attachment refs |
| Screenshots | UI/tool context (human-verified) |
| System exports | Structured event normalization |

---

## Agent responsibilities

### 1. Extract observations

- Normalize into **Observation Set**.
- Assign IDs (`OBS-*`).
- **No interpretation** in this phase.

### 2. Generate findings

- Pattern detection, bottleneck identification, risk classification.
- **Must cite Observation IDs.**

### 3. Draft recommendations

- **Must cite Findings.**
- Must be actionable with governance implications.

### 4. Predict outcomes

- Estimate impact; define expected improvements.
- **Must cite Recommendation IDs.**

### 5. Define metrics

- Quantitative where possible; qualitative where necessary.
- **Must cite Expected Outcome IDs.**

### 6. Assemble traceability map

- Full chain from Observation â†’ Metric.
- Run validation before presenting to operator.

---

## Agent output

| Output | Format |
|--------|--------|
| Canvas v1.0 JSON | `canvas-v1.0.schema.json` |
| Traceability Map | Embedded + standalone |
| Draft client report | Derived from [Client-Edition](./Client-Edition.md) |
| Operator review checklist | OWMP-1.0 Â§ Operator checklist |

---

## Governance

1. **All agent outputs MUST be reviewed by a human operator** before client delivery.
2. **No recommendation may bypass the evidence chain.**
3. Agent drafts are **non-canonical** until operator approval and optional CAR registration.

---

## Nova Studio integration

- **Route:** `/nova/studio/workflow-canvas`
- **Module:** `skillzmcgee/workflow-canvas/`
- **Validation:** `validateCanvas()` enforces CMS invariants

Agent prompts **SHOULD** include CMS-1.0 invariants verbatim and require citation fields on every derived artifact.
