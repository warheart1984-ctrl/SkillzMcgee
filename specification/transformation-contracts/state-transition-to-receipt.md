# Transformation Contract T09: Runtime State Transition → Receipt

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R042, CRK1-R011, CRK1-R012, CRK1-R030, CRK1-R033  
**Constitutional Invariants:** K10, K12

## 2. Input Artifact

**Type:** RuntimeStateTransitionObject  
**Required Properties:** `id`, `execution_plan_id`, `transition`, `timestamp`

## 3. Output Artifact

**Type:** GovernanceReceipt (REC-HDR-1.0)  
**Guaranteed Properties:** `id`, `transition_id`, `invariant_block`, `evidence_block`, `traceability_block`, `merkle_root`, `timestamp`

## 4. Preconditions

- Transition valid.
- GovernanceContract enforcement enabled.

## 5. Postconditions

- Receipt generated and Merkle-anchored.
- REC-HDR-1.0 schema satisfied (R033).
- No in-place mutation of RuntimeStateTransitionObject.

## 6. Transformation Function

```
f_receipt(RuntimeStateTransitionObject rst) → GovernanceReceipt r
  where r.transition_id = rst.id
    and r.invariant_block = evaluate_invariants(rst)
    and r.merkle_root = anchor_merkle(r)
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-G1, CTS-G2, CTS-G3 · Receipt · `entry:receipt`

## 8. Evidence Produced

GovernanceReceipt, Merkle anchor

## 9. Traceability Links

CRK1-R042 → `src/governance/receipts.js` → CTS-G1–G3 → GovernanceReceipt

## 10. Version

1.0
