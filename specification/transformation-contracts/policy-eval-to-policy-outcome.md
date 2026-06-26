# Transformation Contract T05: Policy Evaluation → Policy Outcome

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R040  
**Constitutional Invariants:** K12

## 2. Input Artifact

**Type:** PolicyEvaluationObject  
**Required Properties:** `id`, `interpretation_id`, `evaluation`, `timestamp`

## 3. Output Artifact

**Type:** PolicyOutcomeObject  
**Guaranteed Properties:** `id`, `policy_evaluation_id`, `outcome`, `timestamp`

## 4. Preconditions

- Policy evaluation complete and valid.
- Evaluation is deterministic and replayable.

## 5. Postconditions

- Policy outcome explicit and singular (CA-1.0).
- No in-place mutation of PolicyEvaluationObject.

## 6. Transformation Function

```
f_policy_outcome(PolicyEvaluationObject pe) → PolicyOutcomeObject po
  where po.policy_evaluation_id = pe.id
    and po.outcome = materialize_outcome(pe.evaluation)
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-G1 · policy evaluation logs · `entry:policy_outcome`

## 8. Evidence Produced

PolicyOutcomeObject, provenance entry

## 9. Traceability Links

CRK1-R040 → `governance/validator.py` → CTS-G1 → PolicyOutcomeObject → PL-1.0

## 10. Version

1.0
