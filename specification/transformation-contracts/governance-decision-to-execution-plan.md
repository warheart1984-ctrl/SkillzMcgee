# Transformation Contract: Governance Decision to Execution Plan

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T07/governance-decision-to-execution-plan/v1.0`  
**Specification Name:** `Governance Decision to Execution Plan`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R040, CRK1-R042, CRK1-R043  
**Invariants:** K0, K12, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T07/governance-decision-to-execution-plan/v1.0@v1.0`  
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

**Type:** GovernanceDecisionObject  
**Identifier:** `governance_decision.id`  
**Required Properties:**

- `id`
- `policy_outcome_id`
- `decision`
- `timestamp`

## 6. Output Artifact

**Type:** ExecutionPlanObject  
**Identifier:** `execution_plan.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `governance_decision_id`
- `plan`
- `timestamp`

## 7. Preconditions

- Governance decision valid.
- RuntimeContract permits planning.

## 8. Postconditions

- Execution plan deterministic from governance decision.
- No in-place mutation.
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_execution_plan(GovernanceDecisionObject gd, assumptions, policy_versions) → ExecutionPlanObject ep
  where ep.governance_decision_id = gd.id
    and ep.plan = plan_from_decision(gd.decision, assumptions)
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-G1  
**Audits:** FIA-Governance  
**Receipts:** `execution_plan_log`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- ExecutionPlanObject
- Plan trace logs
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R040 → ADR-003/004 → nova-studio/pipeline → CTS-G1 → ExecutionPlanObject → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R040 |
| Implementation | `nova-studio/server/runtime/pipeline.mjs` |
| CTS | CTS-G1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
