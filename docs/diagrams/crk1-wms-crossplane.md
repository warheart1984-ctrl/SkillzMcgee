# CRK-1 x WMS Cross-Plane Dependency Graph

**Version:** 1.0
**Status:** Canonical Mapping

This document defines the semantic equivalence between the CRK-1 constitutional runtime and the Workflow Modeling Suite (WMS-1.0).

---

## Cross-Plane Mapping Table

| CRK-1 Concept | WMS Concept | Description |
|---------------|-------------|-------------|
| Evidence | Observation | Raw facts about system behavior |
| Interpretation | Finding | Meaning derived from evidence |
| Policy Evaluation | Recommendation | Proposed intervention grounded in findings |
| Policy Outcome | Expected Outcome | Predicted effect of the intervention |
| Drift Envelope | Success Metric | How improvement is measured |
| Receipt | Traceability Entry | Proof of execution |
| Receipt Lineage | Traceability Map | End-to-end chain of governed transformations |
| Constitutional Loop | Evidence Chain | Same semantic grammar |
| Invariants | CMS-1.0 Invariants | One artifact per stage |
| Governance Decision | Workflow Change Decision | Approval of recommended changes |
| Execution Plan | Implementation Roadmap | How changes are applied |
| Runtime State Transition | Workflow State Transition | Actual change in organizational behavior |
| Provenance Ledger | Engagement Ledger | Audit trail of modeling and decisions |

---

## Cross-Plane Dependency Graph

```text
CRK-1 -> WMS Dependency Graph (Cross-Plane)

[Layer 1] CRK-1 Specification
  - Invariants (R001-R042)
  - Object Model (Decision, Outcome, Evidence, Interpretation, Policy Evaluation, Policy Outcome)
  - Required Behaviors (Constitutional Loop)

[Layer 2] Conformance Ecosystem
  - CAR / CAV / COR / CSR
  - CTS (tests constitutional behaviors)
  - MRI (reference implementation)
  - PGI (provenance graph)
  - DRA (drift analysis)
  - Receipts + Evidence Ledger

[Layer 3] Workflow Modeling Suite (WMS-1.0)
  - CMS-1.0 (normative consulting methodology)
    - Observation
    - Finding
    - Recommendation
    - Expected Outcome
    - Success Metric
  - Workflow Modeling Canvas v1.0
  - Operator Protocol (OWMP-1.0)

[Layer 4] Nova Studio Modeling Agent (WM-A1.0)
  - Uses CMS-1.0 stages as semantic types
  - Writes to WMS evidence structures
  - Anchors outputs in CRK-1 evidence ledger

Cross-plane edges:

CRK-1.Evidence          -> WMS.Observation
CRK-1.Interpretation    -> WMS.Finding
CRK-1.PolicyEvaluation  -> WMS.Recommendation
CRK-1.PolicyOutcome     -> WMS.ExpectedOutcome
CRK-1.DriftEnvelope     -> WMS.SuccessMetric
CRK-1.ReceiptLineage    -> WMS.TraceabilityMap

Conformance -> WMS:

CTS/MRI/PGI/DRA results
  -> feed into WMS Observations (system-level workflow)

WMS Recommendations
  -> feed back into Governance decisions (system changes)

Nova Studio:

WM-A1.0
  - reads CRK-1 state via COR/CAV/CAR
  - generates WMS artifacts
  - writes back to evidence ledger + provenance
```

---

## Summary

CRK-1 and WMS share a unified semantic grammar. This mapping is the canonical bridge between constitutional governance and workflow governance.

Result: a closed, governed loop where constitutional runtime and workflow methodology share the same evidence discipline.

---

## Related

- [Unified architecture SVG](./unified-architecture.svg)
- [Unified architecture SVG spec](./unified-architecture.svg.md)
- [Extended dependency graph](../architecture/crk-wms-cross-plane-dependencies.txt)
- [Equivalence table](../architecture/crk-wms-equivalence-table.md)
