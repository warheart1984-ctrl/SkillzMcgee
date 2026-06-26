# Transformation Contract: Evidence to Interpretation

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T03/evidence-to-interpretation/v1.0`  
**Specification Name:** `Evidence to Interpretation`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R003, CRK1-R007, CRK1-R017, CRK1-R020, CRK1-R027, CRK1-R040, CRK1-R043  
**Invariants:** K7, K8, K9, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T03/evidence-to-interpretation/v1.0@v1.0`  
**Runtime Context:** `nova-studio / MRI-1.0 preview`

## 4. Assumptions & Policy Versions

**Assumptions:**

- COM-1.0 artifact schemas satisfied
- Constitution v1.0 active
- One artifact per stage (CA-1.0)
- Frame set version pinned in assumptions

**Active Policy Versions:**

- `semantic-policy@v1.0`
- `continuity-policy@v1.0`

**Evaluation Mode:** `strict`

## 5. Input Artifact

**Type:** EvidenceObject  
**Identifier:** `evidence.id`  
**Required Properties:**

- `id` (unique)
- `outcome_id` (parent outcome)
- `data` (evidentiary payload)
- `timestamp` (ISO8601)

## 6. Output Artifact

**Type:** InterpretationObject  
**Identifier:** `interpretation.id` (new, distinct)  
**Guaranteed Properties:**

- `id` (unique)
- `evidence_id` (references input)
- `interpretation` (semantic frame output)
- `frames_used` (non-empty array)
- `timestamp` (ISO8601, ≥ evidence timestamp)

## 7. Preconditions

- Input EvidenceObject validates (R016).
- Frame set available and versioned.
- SemanticContract enforcement enabled.
- No blocked interpretation paths (R007).

## 8. Postconditions

- Exactly one InterpretationObject per EvidenceObject (R003).
- `frames_used` documents all frames (R020).
- Reproducible from `(evidence, frames, frame_version)` (R021).
- No in-place mutation (CA-1.0).
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_evidence_interpretation(EvidenceObject e, FrameSet F, assumptions, policy_versions) → InterpretationObject i
  where i.evidence_id = e.id
    and i.interpretation = interpret(e.data, F, assumptions)
    and i.frames_used = F.applied_ids
```

**Constraints:** Deterministic on `(e, F, frame_version, assumptions)` · Total on valid evidence · Replayable (Semantic Replay Engine) · Traceable via `evidence_id` and `frames_used`

## 10. Verification Method

**CTS Tests:** CTS-M3, CTS-E1, CTS-E2  
**Audits:** FIA-Semantic  
**Receipts:** `traceability_block`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- InterpretationObject
- Frame list snapshot
- PL-1.1 provenance entry
- Drift deltas (if semantic envelope exceeded)

## 12. Traceability Links

```
CRK1-R003 → ADR-003/004 → src/crk1/ SRE → CTS-M3 → InterpretationObject → traceability_block → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R003 |
| Implementation | `src/crk1/, semantic replay hooks` |
| CTS | CTS-M3 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
