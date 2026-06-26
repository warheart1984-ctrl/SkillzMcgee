# Constitutional Loop v1.0 (Formal Diagram)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative  
**Amendment:** [CA-1.0](./constitutional-amendments/CA-1.0-one-artifact-per-stage.md)

The canonical Version 1.0 constitutional loop — twelve stages, one artifact per stage.

```
┌──────────────────────────────┐
│        DecisionObject        │
└───────────────┬──────────────┘
                ▼  T01
┌──────────────────────────────┐
│        OutcomeObject         │
└───────────────┬──────────────┘
                ▼  T02
┌──────────────────────────────┐
│        EvidenceObject        │
└───────────────┬──────────────┘
                ▼  T03
┌──────────────────────────────┐
│     InterpretationObject     │
└───────────────┬──────────────┘
                ▼  T04
┌──────────────────────────────┐
│   PolicyEvaluationObject     │
└───────────────┬──────────────┘
                ▼  T05
┌──────────────────────────────┐
│     PolicyOutcomeObject      │
└───────────────┬──────────────┘
                ▼  T06
┌──────────────────────────────┐
│  GovernanceDecisionObject    │
└───────────────┬──────────────┘
                ▼  T07
┌──────────────────────────────┐
│     ExecutionPlanObject      │
└───────────────┬──────────────┘
                ▼  T08
┌──────────────────────────────┐
│ RuntimeStateTransitionObject │
└───────────────┬──────────────┘
                ▼  T09
┌──────────────────────────────┐
│      GovernanceReceipt       │
└───────────────┬──────────────┘
                ▼  T10
┌──────────────────────────────┐
│       ProvenanceEntry        │
└───────────────┬──────────────┘
                ▼  T11
┌──────────────────────────────┐
│         LineageNode          │
└───────────────┬──────────────┘
                ▼  T12
┌──────────────────────────────┐
│     DriftEnvelopeUpdate      │
└──────────────────────────────┘
```

## Properties

| Property | Guarantee |
|----------|-----------|
| Acyclic | Each stage consumes a distinct artifact type |
| Complete | All twelve transformations mandatory (R040) |
| Monotonic | Drift envelopes non-decreasing (R041) |
| Traceable | Parent/child IDs on every artifact (R012) |
| Replayable | Full reconstruction from ledger (R004, R025) |

## Transformation index

See [transformation-contracts/INDEX.md](./transformation-contracts/INDEX.md).

## Type system

See [semantic-artifact-types.md](./semantic-artifact-types.md).
