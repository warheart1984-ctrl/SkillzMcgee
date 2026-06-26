# Transformation Contract: Runtime State Transition to Receipt

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T09/state-transition-to-receipt/v1.0`  
**Specification Name:** `Runtime State Transition to Receipt`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R042, CRK1-R011, CRK1-R012, CRK1-R030, CRK1-R033, CRK1-R043  
**Invariants:** K10, K12, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T09/state-transition-to-receipt/v1.0@v1.0`  
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

**Type:** RuntimeStateTransitionObject  
**Identifier:** `state_transition.id`  
**Required Properties:**

- `id`
- `execution_plan_id`
- `transition`
- `timestamp`

## 6. Output Artifact

**Type:** GovernanceReceipt  
**Identifier:** `receipt.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `transition_id`
- `invariant_block`
- `evidence_block`
- `traceability_block`
- `merkle_root`
- `timestamp`

## 7. Preconditions

- Transition valid.
- GovernanceContract enforcement enabled.

## 8. Postconditions

- Receipt generated and Merkle-anchored.
- REC-HDR-1.0 schema satisfied (R033).
- No in-place mutation.
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_receipt(RuntimeStateTransitionObject rst, assumptions, policy_versions) → GovernanceReceipt r
  where r.transition_id = rst.id
    and r.invariant_block = evaluate_invariants(rst, assumptions)
    and r.merkle_root = anchor_merkle(r)
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-G1, CTS-G2, CTS-G3  
**Audits:** FIA-Governance  
**Receipts:** `REC-HDR-1.0`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- GovernanceReceipt
- Merkle anchor
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R042 → ADR-003/004 → src/governance/receipts.js → CTS-G1–G3 → GovernanceReceipt → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R042 |
| Implementation | `src/governance/receipts.js` |
| CTS | CTS-G1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
