# Transformation Contract: Policy Outcome to Governance Decision

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T06/policy-outcome-to-governance-decision/v1.0`  
**Specification Name:** `Policy Outcome to Governance Decision`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R042, CRK1-R043  
**Invariants:** K12, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T06/policy-outcome-to-governance-decision/v1.0@v1.0`  
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

**Type:** PolicyOutcomeObject  
**Identifier:** `policy_outcome.id`  
**Required Properties:**

- `id`
- `policy_evaluation_id`
- `outcome`
- `timestamp`

## 6. Output Artifact

**Type:** GovernanceDecisionObject  
**Identifier:** `governance_decision.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `policy_outcome_id`
- `decision` (pass | refuse | defer)
- `timestamp`

## 7. Preconditions

- Policy outcome valid.
- Constitutional supremacy checks available (K12).

## 8. Postconditions

- Governance decision explicit.
- No in-place mutation.
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_governance_decision(PolicyOutcomeObject po, assumptions, policy_versions) → GovernanceDecisionObject gd
  where gd.policy_outcome_id = po.id
    and gd.decision = govern(po.outcome, assumptions)
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-G1  
**Audits:** FIA-Governance  
**Receipts:** `governance_decision_log`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- GovernanceDecisionObject
- Governance decision logs
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R042 → ADR-003/004 → governance_evaluator → CTS-G1 → GovernanceDecisionObject → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R042 |
| Implementation | `src/crk1/governance_evaluator.js` |
| CTS | CTS-G1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
