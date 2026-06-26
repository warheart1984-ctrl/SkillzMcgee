# Four-Layer Provenance Model

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative — architectural synthesis (Dar-z refinement)  
**Amendment:** [CA-1.1](./constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**Requirement:** [CRK1-R043](./normative-requirements/R043.md)

## Architectural synthesis

This refinement introduces a **four-layer provenance model**. Each layer has its own identity, lifecycle, and provenance chain. Together they enable multi-implementation ecosystems, policy-versioned execution, and assumption-aware replay.

```
Authority Layer
    ↓ authorizes
Specification Layer
    ↓ constrains
Implementation Layer
    ↓ realizes
Execution Layer
    ↓ records
```

## 1. Authority Layer (Governance)

**Evolution:** Slow  
**Identity:** `authority_id`

Defines:

- which specifications exist and which versions are valid
- which assumptions and policies are active
- who can authorize changes (Steward Council, charter)

**Artifacts:** Stewardship charter, council votes, policy version registry  
**Documents:** [stewardship-charter.md](../meta/stewardship-charter.md), [steward-council-governance-process.md](../meta/steward-council-governance-process.md)

**Example `authority_id`:** `steward-council/v1.0/2026-06`

## 2. Specification Layer (Transformation Specs)

**Evolution:** With governance approval (CP / CFP)  
**Identity:** `transformation_spec_id` (SpecificationID)

Defines:

- what a transformation **means**
- its contract, invariants, pre/postconditions
- required evidence

**Artifacts:** Transformation contracts T01–T12  
**Path:** [transformation-contracts/](./transformation-contracts/)

**Example `transformation_spec_id`:** `T01/decision-to-outcome/v1.0`

## 3. Implementation Layer

**Evolution:** Frequent (conformance plane)  
**Identity:** `implementation_id` (ImplementationID)

Defines:

- how a specification is realized in code
- which spec version the implementation claims conformance to
- which assumptions it supports
- which policies it can execute under

**Artifacts:** MRI-1.0 maps, package versions, conformance badges  
**Path:** [conformance/MRI-1.0/](../conformance/MRI-1.0/)

**Example `implementation_id`:** `MRI-1.0/nova-studio-pipeline/1.0.0`

## 4. Execution Layer

**Evolution:** Continuous (runtime)  
**Identity:** per-transformation execution context

Defines:

- the actual artifact transformation
- runtime context and assumptions in force
- the governance receipt
- the provenance entry

**Artifacts:** Constitutional loop objects, receipts, PL-1.1 entries  
**Runtime:** `nova-studio/`, `.runtime/nova-studio/ledger.jsonl`

## Provenance entry (PL-1.1)

Each transformation provenance entry **SHALL** include:

```typescript
ProvenanceEntry = {
  id: ID,
  input_artifact_id: ID,
  output_artifact_id: ID,
  transformation_spec_id: ID,      // SpecificationID
  implementation_id: ID,           // ImplementationID
  authority_id: ID,                // AuthorizedBy
  assumptions: {
    policy_version: string,
    evaluation_mode: string,
    constitution_version: string,
    frame_set_version?: string
  },
  receipt_id: ID,
  parent_hash: Hash,
  entry_hash: Hash,
  timestamp: Timestamp
}
```

PL-1.0 entries (`receipt_id`, `parent_hash`, `entry_hash` only) remain valid for legacy ledgers; PL-1.1 is required for new conformance claims from v1.1 onward.

## Transformation contract binding

Every transformation contract **SHALL** declare:

| Field | Layer |
|-------|-------|
| `AuthorizedBy` | Authority |
| `SpecificationID` | Specification |
| `ImplementationID` | Implementation |
| `Assumptions` | Execution context |
| Input / output artifacts | Execution |
| Receipt / provenance | Execution |

See [transformation-contracts/template.md](./transformation-contracts/template.md).

## Repository-wide invariant (P-1)

**Every semantic transformation SHALL declare its authority, specification, implementation, assumptions, input artifact, output artifact, and receipt.**

Formalized as [CRK1-R043](./normative-requirements/R043.md) and [CA-1.1](./constitutional-amendments/CA-1.1-four-layer-provenance.md).

## What this enables

| Capability | Mechanism |
|------------|-----------|
| Multi-implementation ecosystems | Same `SpecificationID`, many `ImplementationID`s |
| Policy-versioned execution | `assumptions.policy_version` on every entry |
| Assumption-aware replay | Replay requires matching authority + spec + impl + assumptions |
| Cross-runtime arbitration with context | [ARBITRATION_ENGINE.md](../conformance/federation/ARBITRATION_ENGINE.md) compares full PL-1.1 entries |
| Spec-level governance independent of code | Authority + Specification layers frozen separately from Implementation |
| Implementation-level certification | C4–C6 bind to `implementation_id` |
| Execution-level provenance clarity | Full reconstructability from ledger |

## Traceability chain (upgraded)

```
Authority → Specification → Implementation → Execution
    → Receipt → ProvenanceEntry (PL-1.1) → Lineage → Drift
```

## Related

- [constitutional-proof.md](./constitutional-proof.md)
- [semantic-artifact-types.md](./semantic-artifact-types.md)
- [provenance-ledger spec](../conformance/provenance-ledger/spec.md)

## Version

1.1 (additive to v1.0; does not alter K0–K12 semantics)
