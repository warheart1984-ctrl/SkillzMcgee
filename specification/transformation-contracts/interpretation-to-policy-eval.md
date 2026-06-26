# Transformation Contract: Interpretation to Policy Evaluation

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T04/interpretation-to-policy-eval/v1.0`  
**Specification Name:** `Interpretation to Policy Evaluation`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R033, CRK1-R042, CRK1-R011, CRK1-R032, CRK1-R040, CRK1-R043  
**Invariants:** K10, K12, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T04/interpretation-to-policy-eval/v1.0@v1.0`  
**Runtime Context:** `nova-studio / MRI-1.0 preview`

## 4. Assumptions & Policy Versions

**Assumptions:**

- COM-1.0 artifact schemas satisfied
- Constitution v1.0 active
- One artifact per stage (CA-1.0)

**Active Policy Versions:**

- `continuity-policy@v1.0`
- `governance-policy@v1.0`

**Evaluation Mode:** `strict`

## 5. Input Artifact

**Type:** InterpretationObject  
**Identifier:** `interpretation.id`  
**Required Properties:**

- `id` (unique)
- `evidence_id`
- `interpretation`
- `frames_used`
- `timestamp` (ISO8601)

## 6. Output Artifact

**Type:** PolicyEvaluationObject  
**Identifier:** `policy_evaluation.id` (new, distinct)  
**Guaranteed Properties:**

- `id` (unique)
- `interpretation_id`
- `evaluation` (deterministic policy assessment)
- `timestamp`

## 7. Preconditions

- InterpretationObject validates (R017).
- Interpretation replayable (R021).
- SemanticContract satisfied.

## 8. Postconditions

- Exactly one PolicyEvaluationObject per interpretation (R040).
- Deterministic on `(interpretation, constitution_version, assumptions)`.
- No in-place mutation (CA-1.0).
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_interpretation_policy_eval(InterpretationObject i, assumptions, policy_versions) → PolicyEvaluationObject pe
  where pe.interpretation_id = i.id
    and pe.evaluation = evaluate_policy(i, policy_versions, assumptions)
```

**Constraints:** Deterministic · Total on valid inputs · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-G1  
**Audits:** FIA-Governance  
**Receipts:** `policy_eval_log`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- PolicyEvaluationObject
- Policy evaluation logs
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R040 → ADR-003/004 → governance/validator → CTS-G1 → PolicyEvaluationObject → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R033 |
| Implementation | `governance/validator.py, src/crk1/governance_evaluator.js` |
| CTS | CTS-G1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
