# Transformation Contract: Decision to Outcome

## 1. Authority

CRK-1 Specification v1.0  
**Constitutional Amendments:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md), [CA-1.1](../constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**Normative Requirements:** CRK1-R001, CRK1-R005, CRK1-R014, CRK1-R015, CRK1-R040, **CRK1-R043**  
**Constitutional Invariants:** K0, K1, K4, K5, **P-1**

### Four-layer binding

| Field | Value |
|-------|-------|
| **AuthorizedBy** | `steward-council/v1.0` |
| **SpecificationID** | `T01/decision-to-outcome/v1.0` |
| **ImplementationID** | `MRI-1.0/nova-studio-pipeline/1.0.0` |

### Assumptions

```yaml
assumptions:
  policy_version: "1.0"
  evaluation_mode: "strict"
  constitution_version: "1.0"
```

## 2. Input Artifact

**Type:** DecisionObject  
**Identifier:** `decision.id`  
**Required Properties:**

- `id` (unique)
- `actor` (IdentityObject reference)
- `payload` (action intent)
- `timestamp` (ISO8601)

## 3. Output Artifact

**Type:** OutcomeObject  
**Identifier:** `outcome.id` (new)  
**Guaranteed Properties:**

- `id` (unique, distinct from decision)
- `decision_id` (references input)
- `result` (consequence payload)
- `timestamp` (ISO8601, ≥ decision timestamp)

## 4. Preconditions

- Input DecisionObject validates against COM-1.0 schema (R014).
- Actor identity is resolvable.
- Runtime is not in halt state.
- RuntimeContract permits execution.

## 5. Postconditions

- Exactly one OutcomeObject exists for this decision (R001).
- `outcome.decision_id === decision.id`.
- No in-place mutation of DecisionObject (CA-1.0).
- Outcome is eligible for evidence transformation.
- PL-1.1 provenance entry records `input_artifact_id`, `output_artifact_id`, binding fields (R043).

## 6. Transformation Function

**Formal Definition:**

```
f_decision_outcome(DecisionObject d) → OutcomeObject o
  where o.decision_id = d.id
    and o.result = execute(d.payload, d.actor)
```

**Constraints:**

- Deterministic on `(d, runtime_state_at_decision)`
- Total on valid decisions
- Replayable from ledger + decision snapshot
- Traceable via `decision_id` link

## 7. Verification Method

**CTS Tests:** CTS-M1  
**Audits:** FIA-Mechanical  
**Receipts:** `invariant_block` (consequence continuity)  
**Ledger:** parent hash links decision entry → outcome entry

## 8. Evidence Produced

- OutcomeObject instance
- Provenance entry: `entry:decision/outcome`
- Optional drift delta if execution envelope exceeded

## 9. Traceability Links

```
CRK1-R001 → ADR-001 → nova-studio/runtime → CTS-M1 → OutcomeObject → invariant_block → entry:decision/outcome
```

| Link | Reference |
|------|-----------|
| Requirement | CRK1-R001 |
| ADR | [ADR-001](../../meta/adrs/ADR-001-nova-studio-unified-shell.md) |
| Implementation | `nova-studio/server/runtime/pipeline.mjs` |
| CTS | CTS-M1 |
| Evidence | OutcomeObject |
| Receipt | REC-HDR-1.0 `invariant_block` |
| Provenance | PL-1.0 `entry:decision/outcome` |

## 10. Version

1.0
