# Transformation Contract: Evidence to Interpretation

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R003, CRK1-R007, CRK1-R017, CRK1-R020, CRK1-R027, CRK1-R040  
**Constitutional Invariants:** K7, K8, K9

## 2. Input Artifact

**Type:** EvidenceObject  
**Identifier:** `evidence.id`  
**Required Properties:**

- `id` (unique)
- `outcome_id` (parent outcome)
- `data` (evidentiary payload)
- `timestamp` (ISO8601)

## 3. Output Artifact

**Type:** InterpretationObject  
**Identifier:** `interpretation.id` (new)  
**Guaranteed Properties:**

- `id` (unique)
- `evidence_id` (references input)
- `interpretation` (semantic frame output)
- `frames_used` (non-empty string array — semantic multiplicity)
- `timestamp` (ISO8601, ≥ evidence timestamp)

## 4. Preconditions

- Input EvidenceObject validates against COM-1.0 schema (R016).
- Frame set is available and versioned.
- SemanticContract enforcement enabled.
- No blocked or suppressed interpretation paths (R007).

## 5. Postconditions

- Exactly one InterpretationObject per EvidenceObject for this stage (R003).
- `frames_used` documents all frames applied (R020).
- Interpretation is reproducible from `(evidence, frames, frame_version)` (R021).
- No in-place mutation of EvidenceObject (CA-1.0).

## 6. Transformation Function

**Formal Definition:**

```
f_evidence_interpretation(EvidenceObject e, FrameSet F) → InterpretationObject i
  where i.evidence_id = e.id
    and i.interpretation = interpret(e.data, F)
    and i.frames_used = F.applied_ids
```

**Constraints:**

- Deterministic on `(e, F, frame_version)`
- Total on valid evidence
- Replayable (Semantic Replay Engine)
- Traceable via `evidence_id` and `frames_used`

## 7. Verification Method

**CTS Tests:** CTS-M3, CTS-E1, CTS-E2  
**Audits:** FIA-Semantic  
**Receipts:** `traceability_block`  
**Ledger:** frame lineage hash continuity

## 8. Evidence Produced

- InterpretationObject instance
- Frame list snapshot
- Provenance entry: `entry:interpretation`
- Drift deltas (if semantic envelope exceeded)

## 9. Traceability Links

```
CRK1-R003 → ADR-001 → src/crk1/ SRE → CTS-M3 → InterpretationObject → traceability_block → entry:interpretation
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R003 |
| ADR | [ADR-001](../../meta/adrs/ADR-001-nova-studio-unified-shell.md) |
| Implementation | `src/crk1/`, semantic replay hooks |
| CTS | CTS-M3, CTS-E1 |
| Evidence | InterpretationObject, frame list |
| Receipt | REC-HDR-1.0 `traceability_block` |
| Provenance | PL-1.0 `entry:interpretation` |

## 10. Version

1.0
