# CRK-1 x WMS Equivalence Table (Canonical Mapping)

**Version:** 1.0
**Status:** Normative bridge document

This table is the formal bridge between constitutional governance (CRK-1 / COR Suite) and workflow governance (WMS-1.0 / CMS-1.0).

Both systems enforce the same invariant: every stage transforms exactly one semantic artifact into exactly one new semantic artifact.

---

| CRK-1 Concept | WMS Concept | Explanation |
|---------------|-------------|-------------|
| Evidence | Observation | Raw facts about system or organizational behavior |
| Interpretation | Finding | Meaning derived from evidence |
| Policy Evaluation | Recommendation | Proposed intervention grounded in findings |
| Policy Outcome | Expected Outcome | Predicted effect of the intervention |
| Drift Envelope | Success Metric | How improvement or regression is measured |
| Receipt | Traceability Entry | Proof of execution or modeling decision |
| Receipt Lineage | Traceability Map | End-to-end chain of governed transformations |
| Constitutional Loop | Evidence Chain | Same semantic grammar |
| Invariants | CMS-1.0 Invariants | One artifact per stage; no category collapse |
| Governance Decision | Workflow Change Decision | Approval of recommended changes |
| Execution Plan | Implementation Roadmap | How changes are applied |
| Runtime State Transition | Workflow State Transition | Actual change in system or organizational behavior |
| Provenance Ledger | Engagement Ledger | Audit trail of modeling and decisions |

---

## Artifact Path Mapping

| CRK-1 / COR Suite | WMS-1.0 |
|-------------------|---------|
| `car/car-1.0.json` | Observation Set (engagement-scoped) |
| `out/cav-validation.json` | WMC-CTS W0 validation |
| `out/cor-state.json` | Structural workflow state (COR analog) |
| `out/pgi-1.0.json` | Lineage and traceability graph |
| `out/dra-report.json` | Risk and drift scoring |
| `out/governance-receipt.json` | Engagement governance receipt |
| `workflow-canvas/examples/*.json` | Full CMS canvas envelope |

---

## Evidence Chain

```text
CRK-1: Evidence -> Interpretation -> Policy Evaluation -> Outcome -> Drift Envelope
WMS:   Observation -> Finding -> Recommendation -> Expected Outcome -> Success Metric
```

---

## Related

- [Unified architecture diagram](./unified-architecture-v1.0.txt)
- [Cross-plane graph](../diagrams/crk1-wms-crossplane.md)
- [CMS-1.0](../../spec/workflow-modeling-canvas/CMS-1.0.md)
- [COR Suite Spec](../../spec/COR-Suite-Spec-1.0.md)
- [GOV-INV-1.0](../../governance/invariants/GOV-INV-1.0.md)
