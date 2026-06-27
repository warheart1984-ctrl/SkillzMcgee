# Investigation Mode Operator Handbook (IM-OH-1.0)

**Version:** 1.0
**Audience:** Operators, auditors, Nova Studio agents

Unified guide for investigating CRK-1 runtime behavior and WMS workflow models.

**Nova Studio route:** `/nova/studio/investigation-mode`

---

## 1. Purpose

Investigation Mode is the operator cockpit for the entire governed ecosystem.

It provides:

- forensic visibility
- dependency analysis
- drift inspection
- counterfactual reasoning
- workflow traceability
- constitutional correctness checks

Implementation: `src/nova-studio/investigation/InvestigationModePage.tsx`
Forensics builder: `cor-client/visualizers/investigation.ts`

---

## 2. Core Panels

### A. Readiness Summary

Shows the status of:

| Source | Artifact |
|--------|----------|
| CAR registry | `car-1.0.json` |
| CAV validation | `cav-validation.json` |
| COR observability | `cor-state.json` |
| PGI lineage | `pgi-1.0.json` |
| DRA drift analysis | `dra-report.json` |
| Governance decision | `governance-receipt.json` |

Release-ready means: zero CAV blocking findings, no critical structural breaks, governance not `reject` or `freeze`, and DRA high-risk count within published tolerance.

### B. Lineage Explorer

- Requirement fan-in/out
- Evidence chains
- Receipt lineage
- Workflow traceability maps

### C. Drift Map

- CAV drift: hash mismatches, missing artifacts, schema violations
- DRA drift envelopes: per-requirement risk scores
- Workflow success metrics: WMS Success Metric Set

### D. Counterfactuals

Example questions Investigation Mode supports:

- What breaks if requirement X is removed?
- What regresses if evidence Y disappears?
- What changes if workflow recommendation Z is reversed?

### E. Full Artifact Dumps

Constitutional artifacts:

- CAR
- CAV
- COR
- PGI
- DRA
- receipts

Workflow artifacts:

- observations
- findings
- recommendations
- outcomes
- metrics

---

## 3. Operator Responsibilities

Operators must:

- validate constitutional continuity
- inspect workflow traceability
- confirm evidence grounding
- detect regressions
- approve or reject governance decisions

Human review is required for WM-A1.0 drafts before client delivery or public release.

---

## 4. Anti-Patterns

Operators must never:

- bypass governance
- collapse categories
- introduce hidden state
- accept untraceable recommendations
- rely on founder knowledge instead of artifacts

---

## 5. Success Criteria

Investigation Mode review is complete when:

- [ ] all constitutional checks pass, or exceptions are documented
- [ ] all workflow chains are monotonic
- [ ] all drift envelopes are valid
- [ ] all receipts validate
- [ ] all recommendations trace to observations

---

## 6. Related Routes

| Route | Purpose |
|-------|---------|
| `/nova/studio/investigation-mode` | Unified forensic cockpit |
| `/nova/studio/governance-dashboard` | Steward release criteria |
| `/nova/studio/workflow-canvas` | WMS canvas and WM-A1.0 checklist |
| `/nova/studio/cor` | COR Suite dashboard |
| `/nova/studio/investigate?receipt=` | Single-receipt deep dive |

---

## 7. Related Documents

- [Operator quickstart](./operator-quickstart-1.0.md)
- [Unified architecture](../architecture/unified-architecture-v1.0.txt)
- [CRK x WMS equivalence](../architecture/crk-wms-equivalence-table.md)
- [Cross-plane graph](../diagrams/crk1-wms-crossplane.md)
- [OWMP-1.0](../../spec/workflow-modeling-canvas/OWMP-1.0.md)
- [GOV-INV-1.0](../../governance/invariants/GOV-INV-1.0.md)
