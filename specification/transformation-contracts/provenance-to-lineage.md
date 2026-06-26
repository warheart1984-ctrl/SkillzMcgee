# Transformation Contract: Provenance Entry to Lineage Update

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T11/provenance-to-lineage/v1.0`  
**Specification Name:** `Provenance Entry to Lineage Update`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R012, CRK1-R030, CRK1-R043  
**Invariants:** K6, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T11/provenance-to-lineage/v1.0@v1.0`  
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

**Type:** ProvenanceEntry  
**Identifier:** `provenance_entry.entry_id`  
**Required Properties:**

- `entry_id`
- PL-1.1 fields
- `receipt_id`
- `provenance_hash`
- `parent_hash`
- `timestamp`

## 6. Output Artifact

**Type:** LineageNode  
**Identifier:** `lineage_node.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `provenance_entry_id`
- `lineage_hash`
- `timestamp`

## 7. Preconditions

- Ledger hash valid.
- Parent chain intact.

## 8. Postconditions

- Lineage graph updated (append-only).
- Lineage hash derivable from provenance chain.
- No in-place mutation.
- PL-1.1 context preserved (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_lineage(ProvenanceEntry p, assumptions) → LineageNode ln
  where ln.provenance_entry_id = p.entry_id
    and ln.lineage_hash = hash_lineage(p)
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-S3  
**Audits:** FIA-Governance  
**Receipts:** `lineage_hash`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- LineageNode
- Lineage graph export
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R012 → ADR-003/004 → lineage.js → CTS-S3 → LineageNode → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R012 |
| Implementation | `src/singularity/lineage.js` |
| CTS | CTS-S3 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
