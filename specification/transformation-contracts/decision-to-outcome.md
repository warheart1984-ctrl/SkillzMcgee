# Transformation Contract: Decision to Outcome

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T01/decision-to-outcome/v1.0`  
**Specification Name:** `Decision to Outcome`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R001, CRK1-R005, CRK1-R014, CRK1-R015, CRK1-R040, CRK1-R043  
**Invariants:** K0, K1, K4, K5, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T01/decision-to-outcome/v1.0@v1.0`  
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

**Type:** DecisionObject  
**Identifier:** `decision.id`  
**Required Properties:**

- `id` (unique)
- `actor` (IdentityObject reference)
- `payload` (action intent)
- `timestamp` (ISO8601)

## 6. Output Artifact

**Type:** OutcomeObject  
**Identifier:** `outcome.id` (new, distinct)  
**Guaranteed Properties:**

- `id` (unique, distinct from decision)
- `decision_id` (references input)
- `result` (consequence payload)
- `timestamp` (ISO8601, ≥ decision timestamp)

## 7. Preconditions

- Input DecisionObject validates against COM-1.0 schema (R014).
- Actor identity is resolvable.
- Runtime is not in halt state.
- RuntimeContract permits execution.

## 8. Postconditions

- Exactly one OutcomeObject exists for this decision (R001).
- `outcome.decision_id === decision.id`.
- No in-place mutation of DecisionObject (CA-1.0).
- Outcome is eligible for evidence transformation.
- PL-1.1 provenance entry records full transformation context (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_decision_outcome(DecisionObject d, assumptions, policy_versions) → OutcomeObject o
  where o.decision_id = d.id
    and o.result = execute(d.payload, d.actor, assumptions, policy_versions)
```

**Constraints:** Deterministic on `(d, runtime_state_at_decision, assumptions)` · Total on valid decisions · Replayable from ledger + decision snapshot · Traceable via `decision_id` link

## 10. Verification Method

**CTS Tests:** CTS-M1  
**Audits:** FIA-Mechanical  
**Receipts:** `invariant_block`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- OutcomeObject instance
- Governance receipt (`receipt_id`)
- PL-1.1 provenance entry
- Optional drift delta if execution envelope exceeded

## 12. Traceability Links

```
CRK1-R001 → ADR-003/004 → nova-studio/runtime → CTS-M1 → OutcomeObject → invariant_block → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R001 |
| Implementation | `nova-studio/server/runtime/pipeline.mjs` |
| CTS | CTS-M1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
