# Transformation Contract: Policy Evaluation to Policy Outcome

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T05/policy-eval-to-policy-outcome/v1.0`  
**Specification Name:** `Policy Evaluation to Policy Outcome`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R040, CRK1-R043  
**Invariants:** K12, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T05/policy-eval-to-policy-outcome/v1.0@v1.0`  
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

**Type:** PolicyEvaluationObject  
**Identifier:** `policy_evaluation.id`  
**Required Properties:**

- `id`
- `interpretation_id`
- `evaluation`
- `timestamp`

## 6. Output Artifact

**Type:** PolicyOutcomeObject  
**Identifier:** `policy_outcome.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `policy_evaluation_id`
- `outcome`
- `timestamp`

## 7. Preconditions

- Policy evaluation complete and valid.
- Evaluation deterministic and replayable.

## 8. Postconditions

- Policy outcome explicit and singular (CA-1.0).
- No in-place mutation.
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_policy_outcome(PolicyEvaluationObject pe, assumptions, policy_versions) → PolicyOutcomeObject po
  where po.policy_evaluation_id = pe.id
    and po.outcome = materialize_outcome(pe.evaluation, assumptions)
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-G1  
**Audits:** FIA-Governance  
**Receipts:** `policy_outcome_log`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- PolicyOutcomeObject
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R040 → ADR-003/004 → governance/validator → CTS-G1 → PolicyOutcomeObject → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R040 |
| Implementation | `governance/validator.py` |
| CTS | CTS-G1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
