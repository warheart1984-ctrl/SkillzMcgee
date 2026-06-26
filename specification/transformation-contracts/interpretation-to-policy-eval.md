# Transformation Contract: Interpretation to Policy Evaluation

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R033, CRK1-R042, CRK1-R011, CRK1-R032, CRK1-R040  
**Constitutional Invariants:** K10, K12

## 2. Input Artifact

**Type:** InterpretationObject  
**Identifier:** `interpretation.id`  
**Required Properties:**

- `id` (unique)
- `evidence_id` (parent evidence)
- `interpretation` (semantic output)
- `frames_used` (frame audit trail)
- `timestamp` (ISO8601)

## 3. Output Artifact

**Type:** PolicyEvaluationObject  
**Identifier:** `policy_evaluation.id` (new)  
**Guaranteed Properties:**

- `id` (unique)
- `interpretation_id` (references input)
- `evaluation` (deterministic policy assessment)
- `timestamp` (ISO8601)

## 4. Preconditions

- Input InterpretationObject validates against COM-1.0 schema (R017).
- Interpretation is valid and replayable (R021).
- SemanticContract satisfied.

## 5. Postconditions

- Exactly one PolicyEvaluationObject per interpretation (R040).
- Policy evaluation is deterministic on `(interpretation, constitution_version)`.
- No in-place mutation of InterpretationObject (CA-1.0).

## 6. Transformation Function

**Formal Definition:**

```
f_interpretation_policy_eval(InterpretationObject i) → PolicyEvaluationObject pe
  where pe.interpretation_id = i.id
    and pe.evaluation = evaluate_policy(i)
```

**Constraints:** Deterministic, total on valid inputs, replayable, traceable.

## 7. Verification Method

**CTS Tests:** CTS-G1  
**Receipts:** policy evaluation logs (pre-receipt)  
**Ledger:** interpretation anchor

## 8. Evidence Produced

- PolicyEvaluationObject
- Policy evaluation logs
- Provenance entry: `entry:policy_eval`

## 9. Traceability Links

```
CRK1-R040 → governance/validator → CTS-G1 → PolicyEvaluationObject → entry:policy_eval
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R040, CRK1-R042 |
| Implementation | `governance/validator.py`, `src/crk1/governance_evaluator.js` |
| CTS | CTS-G1 |
| Evidence | PolicyEvaluationObject |
| Provenance | PL-1.0 `entry:policy_eval` |

## 10. Version

1.0
