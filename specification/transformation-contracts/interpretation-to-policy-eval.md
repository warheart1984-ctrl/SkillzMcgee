# Transformation Contract: Interpretation to Policy Evaluation

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R033, CRK1-R042, CRK1-R011, CRK1-R032, CRK1-R040  
**Constitutional Invariants:** K10, K12

## 2. Input Artifact

**Type:** InterpretationObject  
**Identifier:** `interpretation.id`  
**Required Properties:**

- `id` (unique)
- `evidence_id` (parent evidence)
- `interpretation` (semantic output)
- `frames_used` (frame audit trail)
- `timestamp` (ISO8601)

## 3. Output Artifact

**Type:** GovernanceReceipt (REC-HDR-1.0)  
**Identifier:** `receipt.id` (new)  
**Guaranteed Properties:**

- `header` (REC-HDR-1.0 schema version)
- `invariant_block` (constitutional checks)
- `evidence_block` (evidence anchors)
- `traceability_block` (requirement and object links)
- `interpretation_id` (references input)
- `merkle_anchor` (when Merkle spine enabled)
- `timestamp` (ISO8601)

## 4. Preconditions

- Input InterpretationObject validates against COM-1.0 schema (R017).
- GovernanceContract enforcement enabled.
- Invariant evaluator and contract checks available.
- Constitutional supremacy checks pass (K12).

## 5. Postconditions

- Exactly one GovernanceReceipt per interpretation at this stage (R042).
- Receipt conforms to REC-HDR-1.0 (R033).
- Policy evaluation outcome encoded in `invariant_block` (pass | refuse).
- No in-place mutation of InterpretationObject (CA-1.0).
- Receipt is Merkle-anchored when spine is active.

## 6. Transformation Function

**Formal Definition:**

```
f_interpretation_receipt(InterpretationObject i) → GovernanceReceipt r
  where r.interpretation_id = i.id
    and r.invariant_block = evaluate_invariants(i)
    and r.evidence_block = anchor_evidence_chain(i.evidence_id)
    and r.traceability_block = build_traceability(i)
```

**Constraints:**

- Deterministic on `(i, constitution_version)`
- Total on valid interpretations
- Replayable from interpretation + constitution snapshot
- Traceable via `interpretation_id` and traceability_block

## 7. Verification Method

**CTS Tests:** CTS-G1, CTS-G2, CTS-G4  
**Audits:** FIA-Governance  
**Receipts:** full REC-HDR-1.0 envelope  
**Ledger:** Merkle root update, provenance append

## 8. Evidence Produced

- GovernanceReceipt (REC-HDR-1.0)
- Provenance entry: `entry:receipt`
- Drift deltas (if governance envelope exceeded)
- Refusal receipt (on invariant failure — still one artifact)

## 9. Traceability Links

```
CRK1-R042 → ADR-001 → governance/validator → CTS-G1 → GovernanceReceipt → receipt → entry:receipt
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R042 |
| ADR | [ADR-001](../../meta/adrs/ADR-001-nova-studio-unified-shell.md) |
| Implementation | `governance/validator.py`, `src/governance/receipts.js` |
| CTS | CTS-G1, CTS-G2 |
| Evidence | GovernanceReceipt |
| Receipt | REC-HDR-1.0 (self-describing) |
| Provenance | PL-1.0 `entry:receipt` |

## 10. Version

1.0
