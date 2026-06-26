# Transformation Contract T08: Execution Plan → Runtime State Transition

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R040, CRK1-R004  
**Constitutional Invariants:** K3, K5

## 2. Input Artifact

**Type:** ExecutionPlanObject  
**Required Properties:** `id`, `governance_decision_id`, `plan`, `timestamp`

## 3. Output Artifact

**Type:** RuntimeStateTransitionObject  
**Guaranteed Properties:** `id`, `execution_plan_id`, `transition`, `timestamp`

## 4. Preconditions

- Execution plan valid and complete.
- Runtime not in halt state.

## 5. Postconditions

- State transition explicit (before/after state hashes).
- No hidden state mutation (R008).
- No in-place mutation of ExecutionPlanObject.

## 6. Transformation Function

```
f_state_transition(ExecutionPlanObject ep) → RuntimeStateTransitionObject rst
  where rst.execution_plan_id = ep.id
    and rst.transition = apply_plan(ep.plan)
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-M4 · transition logs · `entry:state_transition`

## 8. Evidence Produced

RuntimeStateTransitionObject, transition logs, replay snapshot

## 9. Traceability Links

CRK1-R040, R004 → `nova-studio/server/runtime/` → CTS-M4 → RuntimeStateTransitionObject

## 10. Version

1.0
