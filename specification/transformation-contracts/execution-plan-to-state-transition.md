# Transformation Contract: Execution Plan to Runtime State Transition

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T08/execution-plan-to-state-transition/v1.0`  
**Specification Name:** `Execution Plan to Runtime State Transition`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R040, CRK1-R004, CRK1-R043  
**Invariants:** K3, K5, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T08/execution-plan-to-state-transition/v1.0@v1.0`  
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

**Type:** ExecutionPlanObject  
**Identifier:** `execution_plan.id`  
**Required Properties:**

- `id`
- `governance_decision_id`
- `plan`
- `timestamp`

## 6. Output Artifact

**Type:** RuntimeStateTransitionObject  
**Identifier:** `state_transition.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `execution_plan_id`
- `transition` (before/after state hashes)
- `timestamp`

## 7. Preconditions

- Execution plan valid and complete.
- Runtime not in halt state.

## 8. Postconditions

- State transition explicit.
- No hidden state mutation (R008).
- No in-place mutation.
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_state_transition(ExecutionPlanObject ep, assumptions, policy_versions) → RuntimeStateTransitionObject rst
  where rst.execution_plan_id = ep.id
    and rst.transition = apply_plan(ep.plan, assumptions)
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-M4  
**Audits:** FIA-Mechanical  
**Receipts:** `state_transition_log`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- RuntimeStateTransitionObject
- Transition logs
- Replay snapshot
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R040, R004 → ADR-003/004 → nova-studio/runtime → CTS-M4 → RuntimeStateTransitionObject → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R040 |
| Implementation | `nova-studio/server/runtime/` |
| CTS | CTS-M4 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
