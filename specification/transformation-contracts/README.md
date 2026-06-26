# Transformation Contracts

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative  
**Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)

Every stage of the constitutional loop is declared as a **Transformation Contract**: exactly one input artifact, exactly one output artifact.

## Template

[template.md](./template.md) — canonical Version 1.0 template.

## Declared Contracts (v1.0)

| Contract | Stage | Requirements |
|----------|-------|--------------|
| [decision-to-outcome](./decision-to-outcome.md) | Execute decision | R001, R040 |
| [outcome-to-evidence](./outcome-to-evidence.md) | Materialize evidence | R002, R018 |
| [evidence-to-interpretation](./evidence-to-interpretation.md) | Semantic exposure | R003, R020 |
| [interpretation-to-policy-eval](./interpretation-to-policy-eval.md) | Governance evaluation | R042, R033 |

## Constitutional loop (artifact chain)

```
DecisionObject
  → OutcomeObject
  → EvidenceObject
  → InterpretationObject
  → GovernanceReceipt (REC-HDR-1.0)
  → ProvenanceEntry (PL-1.0)
```

Drift updates and Merkle anchoring are **recorded** on receipt and ledger stages; they do not violate CA-1.0 because they are provenance annotations, not additional semantic artifacts per stage.

## Implementation pointers

| Contract | Code (preview) |
|----------|----------------|
| decision-to-outcome | `nova-studio/server/runtime/pipeline.mjs` |
| outcome-to-evidence | `governance/constitution/`, `src/crk1/` |
| evidence-to-interpretation | `src/crk1/`, SRE hooks |
| interpretation-to-policy-eval | `governance/validator.py`, `src/governance/receipts.js` |
