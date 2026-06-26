# Transformation Contract: Lineage Update to Drift Envelope Update

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T12/lineage-to-drift-update/v1.0`  
**Specification Name:** `Lineage Update to Drift Envelope Update`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R041, CRK1-R022, CRK1-R043  
**Invariants:** K9, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T12/lineage-to-drift-update/v1.0@v1.0`  
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

**Type:** LineageNode  
**Identifier:** `lineage_node.id`  
**Required Properties:**

- `id`
- `provenance_entry_id`
- `lineage_hash`
- `timestamp`

## 6. Output Artifact

**Type:** DriftEnvelopeUpdate  
**Identifier:** `drift_update.id` (new, distinct)  
**Guaranteed Properties:**

- `id`
- `lineage_node_id`
- `CE_delta`
- `SE_delta`
- `timestamp`

## 7. Preconditions

- Lineage valid.
- Prior drift envelopes available.

## 8. Postconditions

- CE and SE monotonic (R041).
- Drift deltas recorded.
- No in-place mutation.
- Loop closure: ready for next DecisionObject.
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_drift(LineageNode ln, assumptions) → DriftEnvelopeUpdate de
  where de.lineage_node_id = ln.id
    and (de.CE_delta, de.SE_delta) = compute_drift(ln, assumptions)
    and CE_new >= CE_prev and SE_new >= SE_prev
```

**Constraints:** Deterministic · Total · Replayable · Traceable

## 10. Verification Method

**CTS Tests:** CTS-D1, CTS-D2, CTS-D3  
**Audits:** FIA-Semantic  
**Receipts:** `drift_audit`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- DriftEnvelopeUpdate
- Drift audit report
- PL-1.1 provenance entry

## 12. Traceability Links

```
CRK1-R041 → ADR-003/004 → drift engine → CTS-D1–D3 → DriftEnvelopeUpdate → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R041 |
| Implementation | `src/crk1/, drift engine` |
| CTS | CTS-D1 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
