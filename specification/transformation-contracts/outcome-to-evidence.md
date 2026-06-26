# Transformation Contract: Outcome to Evidence

## 1. Authority

**Authority ID:** `steward-council/v1.0`  
**Authority Type:** `StewardCouncilDecision`  
**Authority Version:** `v1.0`  
**Description:** Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.

## 2. Transformation Specification

**Specification ID:** `T02/outcome-to-evidence/v1.0`  
**Specification Name:** `Outcome to Evidence`  
**Specification Version:** `v1.0`  
**Normative Requirements:** CRK1-R002, CRK1-R006, CRK1-R016, CRK1-R018, CRK1-R040, CRK1-R043  
**Invariants:** K2, K4, K5, K6, P-1

## 3. Implementation

**Implementation ID:** `MRI-1.0/nova-studio-pipeline/1.0.0`  
**Implementation Name:** `Nova Studio Governed Pipeline`  
**Implementation Version:** `1.0.0`  
**Claims Conformance To:** `T02/outcome-to-evidence/v1.0@v1.0`  
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

**Type:** OutcomeObject  
**Identifier:** `outcome.id`  
**Required Properties:**

- `id` (unique)
- `decision_id` (parent decision)
- `result` (consequence payload)
- `timestamp` (ISO8601)

## 6. Output Artifact

**Type:** EvidenceObject  
**Identifier:** `evidence.id` (new, distinct)  
**Guaranteed Properties:**

- `id` (unique)
- `outcome_id` (references input)
- `data` (complete evidentiary payload)
- `timestamp` (ISO8601, ≥ outcome timestamp)
- Hash-stable serialization (EvidenceContract)

## 7. Preconditions

- Input OutcomeObject validates against COM-1.0 schema (R015).
- Outcome is complete (not partial or suppressed).
- EvidenceContract enforcement enabled.

## 8. Postconditions

- Exactly one EvidenceObject per OutcomeObject (R002).
- Evidence derived solely from the outcome.
- No in-place mutation of OutcomeObject (CA-1.0).
- All relevant fields exposed (K4).
- PL-1.1 provenance entry (R043).

## 9. Transformation Function

**Formal Definition:**

```
f_outcome_evidence(OutcomeObject o, assumptions, policy_versions) → EvidenceObject e
  where e.outcome_id = o.id
    and e.data = materialize_evidence(o.result, assumptions)
```

**Constraints:** Deterministic · Total on valid outcomes · Replayable from outcome snapshot · Traceable via `outcome_id`

## 10. Verification Method

**CTS Tests:** CTS-M2  
**Audits:** FIA-Mechanical  
**Receipts:** `evidence_block`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- EvidenceObject instance
- PL-1.1 provenance entry
- EvidenceContract validation log

## 12. Traceability Links

```
CRK1-R002 → ADR-003/004 → governance/constitution → CTS-M2 → EvidenceObject → evidence_block → PL-1.1
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R002 |
| Implementation | `governance/constitution/, src/crk1/` |
| CTS | CTS-M2 |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
