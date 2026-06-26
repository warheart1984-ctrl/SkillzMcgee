# Transformation Contract Template

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative — canonical template for all constitutional transformations

Copy this file to `specification/transformation-contracts/<name>.md` when declaring a new stage.

**Invariant (CA-1.0):** Each stage transforms exactly one semantic artifact into exactly one new semantic artifact.

---

# Transformation Contract: &lt;Name of Transformation&gt;

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendment:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md)  
**Normative Requirements:** &lt;R###, R###, ...&gt;  
**Constitutional Invariants:** &lt;K#–K#&gt;

## 2. Input Artifact

**Type:** &lt;DecisionObject | OutcomeObject | EvidenceObject | InterpretationObject | ...&gt;  
**Identifier:** &lt;object_id&gt;  
**Required Properties:**

- &lt;property 1&gt;
- &lt;property 2&gt;
- &lt;property 3&gt;

## 3. Output Artifact

**Type:** &lt;OutcomeObject | EvidenceObject | InterpretationObject | Receipt | ProvenanceEntry | ...&gt;  
**Identifier:** &lt;object_id&gt;  
**Guaranteed Properties:**

- &lt;property 1&gt;
- &lt;property 2&gt;
- &lt;property 3&gt;

## 4. Preconditions

- &lt;Condition 1&gt;
- &lt;Condition 2&gt;
- &lt;Condition 3&gt;

## 5. Postconditions

- &lt;Condition 1&gt;
- &lt;Condition 2&gt;
- &lt;Condition 3&gt;

## 6. Transformation Function

**Formal Definition:**

```
f(input_artifact) → output_artifact
```

**Constraints:**

- Deterministic
- Total (on valid inputs)
- Replayable
- Traceable

## 7. Verification Method

**CTS Tests:** &lt;M#, S#, E#, G#, D#&gt;  
**Audits:** &lt;FIA-#&gt;  
**Receipts:** &lt;invariant_block | evidence_block | traceability_block&gt;  
**Ledger:** &lt;hash continuity&gt;

## 8. Evidence Produced

- &lt;OutcomeObject | EvidenceObject | InterpretationObject | Receipt | LedgerHash&gt;
- Drift deltas (if applicable)
- Provenance entry

## 9. Traceability Links

```
Requirement → ADR → Implementation → CTS → Evidence → Receipt → Provenance
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R### |
| ADR | ADR-XXX |
| Implementation | `path/to/code` |
| CTS | CTS-M# |
| Evidence | &lt;artifact&gt; |
| Receipt | REC-HDR-1.0 field |
| Provenance | PL-1.0 entry type |

## 10. Version

1.0
