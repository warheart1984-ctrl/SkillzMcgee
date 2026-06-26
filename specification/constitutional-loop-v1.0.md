# Constitutional Loop v1.0 (Formal Diagram)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative  
**Amendments:** [CA-1.0](./constitutional-amendments/CA-1.0-one-artifact-per-stage.md), [CA-1.1](./constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**ADRs:** [ADR-003](../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../meta/adrs/ADR-004-transformation-context-invariant.md)

The canonical Version 1.0 constitutional loop — twelve stages, one artifact per stage, embedded in the four-layer provenance model.

## Four-layer model (governance stack)

```
                 AUTHORITY LAYER
                 ┌───────────────────────────┐
                 │ Governance Policies       │
                 │ Constitutional Amendments │
                 │ Steward Council Decisions │
                 └──────────────┬────────────┘
                                │
                                ▼
                 SPECIFICATION LAYER
                 ┌───────────────────────────┐
                 │ Transformation Specs      │
                 │ Contracts & Invariants    │
                 │ Normative Requirements    │
                 └──────────────┬────────────┘
                                │
                                ▼
                 IMPLEMENTATION LAYER
                 ┌───────────────────────────┐
                 │ Implementations           │
                 │ (MRI, vendor runtimes)    │
                 │ Conformance Claims        │
                 └──────────────┬────────────┘
                                │
                                ▼
                 EXECUTION LAYER (12-Stage Loop)
```

Every execution step is:

- **authorized** by Authority
- **defined** by Specification
- **performed** by Implementation
- **recorded** in Provenance with full context (PL-1.1, R043)

## Twelve-stage loop (execution layer)

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
| Context-bound | Authority, spec, impl, assumptions on every step (R043, ADR-004) |

## Transformation index

See [transformation-contracts/INDEX.md](./transformation-contracts/INDEX.md).

## Type system

See [semantic-artifact-types.md](./semantic-artifact-types.md), [layer-object-model.md](./layer-object-model.md).
