# Transformation Contract: Outcome to Evidence

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R002, CRK1-R006, CRK1-R016, CRK1-R018, CRK1-R040  
**Constitutional Invariants:** K2, K4, K5, K6

## 2. Input Artifact

**Type:** OutcomeObject  
**Identifier:** `outcome.id`  
**Required Properties:**

- `id` (unique)
- `decision_id` (parent decision)
- `result` (consequence payload)
- `timestamp` (ISO8601)

## 3. Output Artifact

**Type:** EvidenceObject  
**Identifier:** `evidence.id` (new)  
**Guaranteed Properties:**

- `id` (unique)
- `outcome_id` (references input)
- `data` (complete evidentiary payload derived from outcome)
- `timestamp` (ISO8601, ≥ outcome timestamp)
- Hash-stable serialization (EvidenceContract)

## 4. Preconditions

- Input OutcomeObject validates against COM-1.0 schema (R015).
- Outcome is complete (not partial or suppressed).
- EvidenceContract enforcement enabled.

## 5. Postconditions

- Exactly one EvidenceObject per OutcomeObject (R002, EvidenceContract).
- Evidence derived solely from the outcome — no external hidden inputs.
- No in-place mutation of OutcomeObject (CA-1.0).
- All relevant fields exposed (K4).

## 6. Transformation Function

**Formal Definition:**

```
f_outcome_evidence(OutcomeObject o) → EvidenceObject e
  where e.outcome_id = o.id
    and e.data = materialize_evidence(o.result)
```

**Constraints:**

- Deterministic
- Total on valid outcomes
- Replayable from outcome snapshot
- Traceable via `outcome_id` link

## 7. Verification Method

**CTS Tests:** CTS-M2, CTS-S2  
**Audits:** FIA-Mechanical  
**Receipts:** `evidence_block`  
**Ledger:** hash continuity from outcome entry

## 8. Evidence Produced

- EvidenceObject instance
- Provenance entry: `entry:evidence`
- Contract validation log (EvidenceContract)

## 9. Traceability Links

```
CRK1-R002 → ADR-001 → governance/constitution → CTS-M2 → EvidenceObject → evidence_block → entry:evidence
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R002 |
| ADR | [ADR-001](../../meta/adrs/ADR-001-nova-studio-unified-shell.md) |
| Implementation | `governance/constitution/`, `src/crk1/` |
| CTS | CTS-M2 |
| Evidence | EvidenceObject |
| Receipt | REC-HDR-1.0 `evidence_block` |
| Provenance | PL-1.0 `entry:evidence` |

## 10. Version

1.0
