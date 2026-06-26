# Transformation Contract T11: Provenance Entry → Lineage Update

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R012, CRK1-R030  
**Constitutional Invariants:** K6

## 2. Input Artifact

**Type:** ProvenanceEntry  
**Required Properties:** `id`, `receipt_id`, `parent_hash`, `entry_hash`, `timestamp`

## 3. Output Artifact

**Type:** LineageNode  
**Guaranteed Properties:** `id`, `provenance_entry_id`, `lineage_hash`, `timestamp`

## 4. Preconditions

- Ledger hash valid.
- Parent chain intact.

## 5. Postconditions

- Lineage graph updated (append-only).
- Lineage hash derivable from provenance chain.
- No in-place mutation of ProvenanceEntry.

## 6. Transformation Function

```
f_lineage(ProvenanceEntry p) → LineageNode ln
  where ln.provenance_entry_id = p.id
    and ln.lineage_hash = hash_lineage(p)
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

Provenance inspector · CTS-S3 · `entry:trace`

## 8. Evidence Produced

LineageNode, lineage graph export

## 9. Traceability Links

CRK1-R012 → `src/singularity/lineage.js` → lineage inspector → LineageNode

## 10. Version

1.0
