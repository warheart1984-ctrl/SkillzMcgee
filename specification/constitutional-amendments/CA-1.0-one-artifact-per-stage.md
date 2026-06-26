# CRK-1 Constitutional Amendment CA-1.0: One-Artifact-Per-Stage Invariant

**Authority:** CRK-1 Specification v1.0  
**Status:** Immutable constitutional layer (Version 1.0)  
**Version:** 1.0

## Authority

- CRK-1 Specification v1.0
- [K-∞ Axioms](../../docs/K-infinity-axioms/README.md)
- Normative Requirements R001–R042

## Amendment Text

### CA-1.0 — One-Artifact-Per-Stage Invariant

1. Each stage of the constitutional loop **SHALL** accept exactly one semantic artifact as input.
2. Each stage **SHALL** produce exactly one new semantic artifact as output.
3. No stage **MAY** mutate an artifact in place.
4. No stage **MAY** produce more than one artifact.
5. No stage **MAY** skip artifact production.
6. Every transformation **MUST** be explicitly declared in a [Transformation Contract](../transformation-contracts/).
7. Every artifact **MUST** be uniquely identifiable and traceable.
8. Every artifact **MUST** be recorded in the provenance ledger.

## Rationale

This amendment ensures:

- Linear, unbroken continuity
- Deterministic replay
- Unambiguous provenance
- No hidden state
- No silent category changes
- No multi-output ambiguity
- Machine-verifiable correctness

Dar-z articulation: semantic boundaries are **stages**, not functions. Each stage is a lawful morphism between artifact types.

## Declared Transformations (Version 1.0)

| ID | Contract | Input → Output |
|----|----------|----------------|
| T01 | [decision-to-outcome](../transformation-contracts/decision-to-outcome.md) | DecisionObject → OutcomeObject |
| T02 | [outcome-to-evidence](../transformation-contracts/outcome-to-evidence.md) | OutcomeObject → EvidenceObject |
| T03 | [evidence-to-interpretation](../transformation-contracts/evidence-to-interpretation.md) | EvidenceObject → InterpretationObject |
| T04 | [interpretation-to-policy-eval](../transformation-contracts/interpretation-to-policy-eval.md) | InterpretationObject → PolicyEvaluationObject |
| T05 | [policy-eval-to-policy-outcome](../transformation-contracts/policy-eval-to-policy-outcome.md) | PolicyEvaluationObject → PolicyOutcomeObject |
| T06 | [policy-outcome-to-governance-decision](../transformation-contracts/policy-outcome-to-governance-decision.md) | PolicyOutcomeObject → GovernanceDecisionObject |
| T07 | [governance-decision-to-execution-plan](../transformation-contracts/governance-decision-to-execution-plan.md) | GovernanceDecisionObject → ExecutionPlanObject |
| T08 | [execution-plan-to-state-transition](../transformation-contracts/execution-plan-to-state-transition.md) | ExecutionPlanObject → RuntimeStateTransitionObject |
| T09 | [state-transition-to-receipt](../transformation-contracts/state-transition-to-receipt.md) | RuntimeStateTransitionObject → GovernanceReceipt |
| T10 | [receipt-to-provenance](../transformation-contracts/receipt-to-provenance.md) | GovernanceReceipt → ProvenanceEntry |
| T11 | [provenance-to-lineage](../transformation-contracts/provenance-to-lineage.md) | ProvenanceEntry → LineageNode |
| T12 | [lineage-to-drift-update](../transformation-contracts/lineage-to-drift-update.md) | LineageNode → DriftEnvelopeUpdate |

Full index: [transformation-contracts/INDEX.md](../transformation-contracts/INDEX.md)

## Verification

Verified by:

- CTS-1.0 (M1–M4, S1–S3, E1–E3, G1–G3, D1–D3)
- Reproduction Harness (R1-0)
- Founder-Independence Audit (FIA)
- Provenance Ledger (PL-1.0)
- Merkle Spine

## Related Requirements

| Requirement | Role |
|-------------|------|
| CRK1-R001–R004 | Mechanical continuity and replay |
| CRK1-R010–R012 | Structural transparency and traceability |
| CRK1-R040 | Constitutional loop completeness |
| CRK1-R030 | Provenance immutability |
| CRK1-R032 | Constitutional supremacy |

## Traceability

```
CA-1.0 → Transformation Contracts → MRI-1.0 → CTS-1.0 → Evidence → Receipt → Provenance
```

This amendment is part of the immutable constitutional layer for Version 1.0.
