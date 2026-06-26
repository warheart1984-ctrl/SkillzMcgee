# Transformation Contract T07: Governance Decision → Execution Plan

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R040, CRK1-R042  
**Constitutional Invariants:** K0, K12

## 2. Input Artifact

**Type:** GovernanceDecisionObject  
**Required Properties:** `id`, `policy_outcome_id`, `decision`, `timestamp`

## 3. Output Artifact

**Type:** ExecutionPlanObject  
**Guaranteed Properties:** `id`, `governance_decision_id`, `plan`, `timestamp`

## 4. Preconditions

- Governance decision valid (not refused without explicit refusal artifact chain).
- RuntimeContract permits planning.

## 5. Postconditions

- Execution plan deterministic from governance decision.
- No in-place mutation of GovernanceDecisionObject.

## 6. Transformation Function

```
f_execution_plan(GovernanceDecisionObject gd) → ExecutionPlanObject ep
  where ep.governance_decision_id = gd.id
    and ep.plan = plan_from_decision(gd.decision)
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-G1 · ExecutionPlanObject · `entry:execution_plan`

## 8. Evidence Produced

ExecutionPlanObject, plan trace logs

## 9. Traceability Links

CRK1-R040 → `nova-studio/server/runtime/pipeline.mjs` → CTS-G1 → ExecutionPlanObject

## 10. Version

1.0
