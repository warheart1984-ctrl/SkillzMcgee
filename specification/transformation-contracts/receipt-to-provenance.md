# Transformation Contract: Receipt to Provenance Entry

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T10/receipt-to-provenance/v1.0`  
**Specification Name:** `Receipt to Provenance Entry`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R030, CRK1-R043  
**Invariants:** K10, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T10/receipt-to-provenance/v1.0@v1.0`  
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

**Type:** GovernanceReceipt  
**Identifier:** `receipt.id`  
**Required Properties:**

- `id`
- `transition_id`
- `invariant_block`
- `merkle_root`
- `timestamp`

## 6. Output Artifact

**Type:** ProvenanceEntry  
**Identifier:** `provenance_entry.entry_id` (new, distinct)  
**Guaranteed Properties:**

- `entry_id`
- PL-1.1 binding fields (authority, spec, impl, assumptions)
- `receipt_id`
- `provenance_hash`
- `parent_hash`
- `timestamp`

## 7. Preconditions

- Receipt valid against REC-HDR-1.0.
- Ledger append-only mode active.

## 8. Postconditions

- Ledger append-only.
- Hash chain continuity.
- No in-place mutation.
- Full PL-1.1 context recorded (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_provenance(GovernanceReceipt r, authority_id, spec_id, impl_id, assumptions) → ProvenanceEntry p
  where p.receipt_id = r.id
    and p.provenance_hash = hash(p)
    and p.parent_hash = ledger_tip()
```

**Constraints:** Deterministic · Total · Replayable · Traceable · Assumption-aware

## 10. Verification Method

**CTS Tests:** CTS-G3  
**Audits:** FIA-Governance  
**Receipts:** `ledger_hash`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- ProvenanceEntry
- Ledger hash continuity proof

## 12. Traceability Links

```
CRK1-R030 → ADR-003/004 → continuity_ledger → CTS-G3 → ProvenanceEntry → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R030 |
| Implementation | `governance/continuity_ledger.py` |
| CTS | CTS-G3 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
