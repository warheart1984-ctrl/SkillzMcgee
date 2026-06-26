# Transformation Contract Template

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative — canonical template for all constitutional transformations  
**Amendments:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md) · [CA-1.1](../constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**Invariant:** P-1 ([R043](../normative-requirements/R043.md))

Copy this file to `specification/transformation-contracts/<name>.md` when declaring a new stage.

---

# Transformation Contract: &lt;Name of Transformation&gt;

## 1. Authority

**Authority ID:** `&lt;authority_id&gt;`  
**Authority Type:** `&lt;GovernancePolicy | ConstitutionalAmendment | StewardCouncilDecision&gt;`  
**Authority Version:** `&lt;vX.Y&gt;`  
**Description:** &lt;short rationale&gt;

## 2. Transformation Specification

**Specification ID:** `&lt;spec_id&gt;`  
**Specification Name:** `&lt;spec_name&gt;`  
**Specification Version:** `&lt;vX.Y&gt;`  
**Normative Requirements:** &lt;CRK1-R###, ...&gt;  
**Invariants:** &lt;K#–K#, P-1&gt;

## 3. Implementation

**Implementation ID:** `&lt;impl_id&gt;`  
**Implementation Name:** `&lt;impl_name&gt;`  
**Implementation Version:** `&lt;vX.Y.Z&gt;`  
**Claims Conformance To:** `&lt;spec_id@vX.Y&gt;`  
**Runtime Context:** `&lt;runtime name / environment&gt;`

## 4. Assumptions & Policy Versions

**Assumptions:**

- &lt;assumption 1&gt;
- &lt;assumption 2&gt;

**Active Policy Versions:**

- `&lt;policy_id@vX.Y&gt;`
- `&lt;policy_id@vA.B&gt;`

**Evaluation Mode:** `&lt;strict | permissive | experimental&gt;`

## 5. Input Artifact

**Type:** &lt;DecisionObject | OutcomeObject | EvidenceObject | ...&gt;  
**Identifier:** `&lt;artifact_id&gt;`  
**Required Properties:**

- &lt;property 1&gt;
- &lt;property 2&gt;

## 6. Output Artifact

**Type:** &lt;OutcomeObject | EvidenceObject | InterpretationObject | ...&gt;  
**Identifier:** `&lt;artifact_id&gt;` (new, distinct)  
**Guaranteed Properties:**

- &lt;property 1&gt;
- &lt;property 2&gt;

## 7. Preconditions

- &lt;Condition 1&gt;
- Active `authority_id` authorizes this `spec_id`
- `implementation_id` claims conformance to `spec_id@spec_version`

## 8. Postconditions

- &lt;Condition 1&gt;
- PL-1.1 provenance entry with full transformation context (R043, ADR-004)
- No in-place mutation (CA-1.0)

## 9. Transformation Function

**Formal Definition:**

```
f(input_artifact, assumptions, policy_versions) → output_artifact
```

**Constraints:**

- Deterministic under declared assumptions
- Total over valid input domain
- Replayable given spec + impl + assumptions
- Traceable via provenance

## 10. Verification Method

**CTS Tests:** &lt;M#, S#, E#, G#, D#&gt;  
**Audits:** &lt;FIA-#&gt;  
**Receipts:** &lt;receipt_type&gt;  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

- Output artifact
- Receipt
- Provenance entry (PL-1.1)
- Drift deltas (if applicable)

## 12. Traceability Links

```
Authority → Specification → Implementation → Execution → Evidence → Receipt → Provenance
```

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | CRK1-R###, CRK1-R043 |
| Authority | `authority_id` |
| Specification | `spec_id` |
| Implementation | `impl_id` |
| CTS | CTS-M# |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
