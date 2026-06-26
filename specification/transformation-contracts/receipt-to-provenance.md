# Transformation Contract T10: Receipt → Provenance Entry

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R030  
**Constitutional Invariants:** K10

## 2. Input Artifact

**Type:** GovernanceReceipt  
**Required Properties:** `id`, `transition_id`, `invariant_block`, `merkle_root`, `timestamp`

## 3. Output Artifact

**Type:** ProvenanceEntry (PL-1.0)  
**Guaranteed Properties:** `id`, `receipt_id`, `parent_hash`, `entry_hash`, `timestamp`

## 4. Preconditions

- Receipt valid against REC-HDR-1.0.
- Ledger append-only mode active.

## 5. Postconditions

- Ledger append-only (no rewrite).
- Hash chain continuity: `parent_hash` links to prior entry.
- No in-place mutation of GovernanceReceipt.

## 6. Transformation Function

```
f_provenance(GovernanceReceipt r) → ProvenanceEntry p
  where p.receipt_id = r.id
    and p.entry_hash = hash(r)
    and p.parent_hash = ledger_tip()
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-G3 · ledger hash · `entry:hash`

## 8. Evidence Produced

ProvenanceEntry, ledger hash continuity proof

## 9. Traceability Links

CRK1-R030 → `governance/continuity_ledger.py` → CTS-G3 → ProvenanceEntry

## 10. Version

1.0
