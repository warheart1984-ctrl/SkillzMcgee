# Transformation Contract Template

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative — canonical template for all constitutional transformations

Copy this file to `specification/transformation-contracts/<name>.md` when declaring a new stage.

**Invariants:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md) · [CA-1.1](../constitutional-amendments/CA-1.1-four-layer-provenance.md) · **P-1** ([R043](../normative-requirements/R043.md))

---

# Transformation Contract: &lt;Name of Transformation&gt;

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendments:** CA-1.0, CA-1.1  
**Normative Requirements:** &lt;R###, R###, R043, ...&gt;  
**Constitutional Invariants:** &lt;K#–K#&gt;, P-1

### Four-layer binding (required)

| Field | Value |
|-------|-------|
| **AuthorizedBy** | `&lt;authority_id&gt;` — e.g. `steward-council/v1.0` |
| **SpecificationID** | `&lt;transformation_spec_id&gt;` — e.g. `T01/decision-to-outcome/v1.0` |
| **ImplementationID** | `&lt;implementation_id&gt;` — e.g. `MRI-1.0/&lt;module&gt;/&lt;semver&gt;` |

### Assumptions block (required at execution)

```yaml
assumptions:
  policy_version: "1.0"
  evaluation_mode: "strict"   # strict | audit | replay
  constitution_version: "1.0"
  frame_set_version: "1.0"    # when semantic stages apply
```

## 2. Input Artifact

**Type:** &lt;DecisionObject | OutcomeObject | ...&gt;  
**Identifier:** `&lt;object_id&gt;`  
**Required Properties:**

- &lt;property 1&gt;
- &lt;property 2&gt;

## 3. Output Artifact

**Type:** &lt;OutcomeObject | EvidenceObject | ...&gt;  
**Identifier:** `&lt;object_id&gt;` (new, distinct)  
**Guaranteed Properties:**

- &lt;property 1&gt;
- &lt;property 2&gt;

## 4. Preconditions

- &lt;Condition 1&gt;
- Active `authority_id` authorizes this `SpecificationID`
- `ImplementationID` claims conformance to this spec version

## 5. Postconditions

- &lt;Condition 1&gt;
- PL-1.1 provenance entry with full seven-field binding (R043)
- No in-place mutation (CA-1.0)

## 6. Transformation Function

```
f(input_artifact) → output_artifact
  under (authority_id, specification_id, implementation_id, assumptions)
```

**Constraints:** Deterministic, total, replayable, traceable, assumption-aware

## 7. Verification Method

**CTS Tests:** &lt;M#, S#, G#, D#&gt;  
**Provenance:** PL-1.1 field completeness  
**Receipts:** &lt;invariant_block | evidence_block | traceability_block&gt;

## 8. Evidence Produced

- Output artifact
- Governance receipt (`receipt_id`)
- ProvenanceEntry (PL-1.1) with `input_artifact_id`, `output_artifact_id`, `transformation_spec_id`, `implementation_id`, `authority_id`, `assumptions`

## 9. Traceability Links

```
Authority → Specification → Implementation → Execution → CTS → Evidence → Receipt → Provenance (PL-1.1)
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R###, CRK1-R043 |
| Authority | `authority_id` |
| Specification | `SpecificationID` |
| Implementation | `ImplementationID` |
| CTS | CTS-M# |
| Provenance | PL-1.1 |

## 10. Version

1.0 (contract) · binding fields per CA-1.1
