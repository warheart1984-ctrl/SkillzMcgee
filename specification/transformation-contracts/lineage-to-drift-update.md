# Transformation Contract T12: Lineage Update → Drift Envelope Update

## 1. Authority

CRK-1 Specification v1.0 · [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** CRK1-R041, CRK1-R022  
**Constitutional Invariants:** K9

## 2. Input Artifact

**Type:** LineageNode  
**Required Properties:** `id`, `provenance_entry_id`, `lineage_hash`, `timestamp`

## 3. Output Artifact

**Type:** DriftEnvelopeUpdate  
**Guaranteed Properties:** `id`, `lineage_node_id`, `CE_delta`, `SE_delta`, `timestamp`

## 4. Preconditions

- Lineage valid.
- Prior drift envelopes available.

## 5. Postconditions

- CE and SE monotonic: `CEₜ₊₁ ≥ CEₜ`, `SEₜ₊₁ ≥ SEₜ` (R041).
- Drift deltas recorded.
- No in-place mutation of LineageNode.
- Loop closure: system ready for next DecisionObject.

## 6. Transformation Function

```
f_drift(LineageNode ln) → DriftEnvelopeUpdate de
  where de.lineage_node_id = ln.id
    and (de.CE_delta, de.SE_delta) = compute_drift(ln)
    and CE_new >= CE_prev and SE_new >= SE_prev
```

**Constraints:** Deterministic, total, replayable, traceable.

## 7. Verification Method

CTS-D1, CTS-D2, CTS-D3 · drift deltas · `entry:drift`

## 8. Evidence Produced

DriftEnvelopeUpdate, drift audit report

## 9. Traceability Links

CRK1-R041 → `src/crk1/`, drift engine → CTS-D1–D3 → DriftEnvelopeUpdate

## 10. Version

1.0
