# Required Behaviors

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative

## Constitutional Loop

Every governed action must complete the **12-stage constitutional loop** (CA-1.0):

```
DecisionObject → OutcomeObject → EvidenceObject → InterpretationObject
  → PolicyEvaluationObject → PolicyOutcomeObject → GovernanceDecisionObject
  → ExecutionPlanObject → RuntimeStateTransitionObject → GovernanceReceipt
  → ProvenanceEntry → LineageNode → DriftEnvelopeUpdate
```

Each stage is declared in a [Transformation Contract](./transformation-contracts/INDEX.md). Each step is mandatory, governed, and replayable. No in-place mutation. No multi-output stages.

**Diagram:** [constitutional-loop-v1.0.md](./constitutional-loop-v1.0.md)  
**Amendment:** [CA-1.0](./constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Requirement:** CRK1-R040

## Governance Visibility

All constitutional actions must be visible through governance receipts and the provenance ledger.

**Requirement:** CRK1-R042

## Refusal Semantics

If any invariant, contract, traceability, or drift check fails:

1. Runtime enters halt state
2. Refusal receipt emitted (REC-HDR-1.0)
3. Provenance entry appended
4. No silent failure permitted

## Replay

Full state reconstruction must be possible from:

- Constitutional objects (D, O, E, I)
- Governance receipts (R)
- Provenance ledger (P)
- Frame set (F)

**Requirements:** CRK1-R004, CRK1-R025

## Interface traceability (URIT-MAP-1.0)

All interface classes (UI-1, API-1, CLI-1, INT-1) must maintain anchors:

- **A1** — Invariant anchor
- **A2** — Governance anchor (receipt per action)
- **A3** — Evidence anchor
- **A4** — Reproducibility anchor
