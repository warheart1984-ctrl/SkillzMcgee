# Transformation Contract T06: Policy Outcome → Governance Decision

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R042  
**Constitutional Invariants:** K12

## 2. Input Artifact

**Type:** PolicyOutcomeObject  
**Required Properties:** `id`, `policy_evaluation_id`, `outcome`, `timestamp`

## 3. Output Artifact

**Type:** GovernanceDecisionObject  
**Guaranteed Properties:** `id`, `policy_outcome_id`, `decision`, `timestamp`

## 4. Preconditions

- Policy outcome valid.
- Constitutional supremacy checks available (K12).

## 5. Postconditions

- Governance decision explicit (pass | refuse | defer).
- No in-place mutation of PolicyOutcomeObject.

## 6. Transformation Function

```
f_governance_decision(PolicyOutcomeObject po) → GovernanceDecisionObject gd
  where gd.policy_outcome_id = po.id
    and gd.decision = govern(po.outcome)
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-G1 · governance decision logs · `entry:governance_decision`

## 8. Evidence Produced

GovernanceDecisionObject, governance decision logs

## 9. Traceability Links

CRK1-R042 → `src/crk1/governance_evaluator.js` → CTS-G1 → GovernanceDecisionObject

## 10. Version

1.0
