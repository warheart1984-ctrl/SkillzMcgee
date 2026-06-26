# Transformation Contracts

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative  
**Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md), [CA-1.1](../constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**Provenance:** [four-layer-provenance-model.md](../four-layer-provenance-model.md) · **R043**

Twelve constitutionally recognized transformations. Each consumes exactly one semantic artifact and produces exactly one new semantic artifact.

## Template

[template.md](./template.md) — canonical Version 1.0 template.

## Index (T01–T12)

See [INDEX.md](./INDEX.md) for the full contract table.

## Constitutional loop

```
DecisionObject → OutcomeObject → EvidenceObject → InterpretationObject
  → PolicyEvaluationObject → PolicyOutcomeObject → GovernanceDecisionObject
  → ExecutionPlanObject → RuntimeStateTransitionObject → GovernanceReceipt
  → ProvenanceEntry → LineageNode → DriftEnvelopeUpdate
```

Diagram: [../constitutional-loop-v1.0.md](../constitutional-loop-v1.0.md)  
Types: [../semantic-artifact-types.md](../semantic-artifact-types.md)  
Proof: [../constitutional-proof.md](../constitutional-proof.md)

## Implementation pointers

| Stages | Code (preview) |
|--------|----------------|
| T01–T03 | `nova-studio/server/runtime/pipeline.mjs`, `src/crk1/` |
| T04–T07 | `governance/validator.py`, `src/crk1/governance_evaluator.js` |
| T08–T09 | `nova-studio/server/runtime/`, `src/governance/receipts.js` |
| T10–T11 | `governance/continuity_ledger.py`, `src/singularity/lineage.js` |
| T12 | drift engine, `specification/drift-envelopes.md` |
