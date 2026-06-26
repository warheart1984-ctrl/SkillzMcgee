# Provenance Ledger Specification

**Resolves to:** CRK1-R030, R035, **CRK1-R043**  
**Versions:** PL-1.0 (legacy) · **PL-1.1** (four-layer binding)  
**Schema:** [schema.json](./schema.json)  
**ADRs:** [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md)

## ProvenanceLedger (PL-1.1)

```json
{
  "entries": [
    {
      "entry_id": "<uuid>",
      "timestamp": "<ISO8601>",
      "input_artifact_id": "<artifact_id>",
      "output_artifact_id": "<artifact_id>",
      "authority_id": "<authority_id>",
      "authority_version": "<vX.Y>",
      "spec_id": "<spec_id>",
      "spec_version": "<vX.Y>",
      "implementation_id": "<impl_id>",
      "implementation_version": "<vX.Y.Z>",
      "assumptions": {
        "items": ["<assumption 1>", "<assumption 2>"],
        "policy_versions": ["<policy_id@vX.Y>"],
        "evaluation_mode": "strict | permissive | experimental",
        "constitution_version": "1.0",
        "frame_set_version": "1.0"
      },
      "verification_method": "CTS-M1 | CTS-S2 | FIA | Receipt | DriftCheck | ...",
      "evidence_type": "OutcomeObject | Receipt | LedgerHash | ReplayLog | ...",
      "evidence_ref": "<object_id or hash>",
      "receipt_id": "<receipt_id>",
      "provenance_hash": "<hash>",
      "parent_hash": "<hash or null>",
      "status": "pass | fail",
      "notes": "<optional>"
    }
  ]
}
```

### Field reference

| Field | Layer | Description |
|-------|-------|-------------|
| `entry_id` | Execution | Unique entry identifier |
| `input_artifact_id` | Execution | CA-1.0 input artifact |
| `output_artifact_id` | Execution | CA-1.0 output artifact |
| `authority_id` | Authority | Authorizing governance body or policy |
| `authority_version` | Authority | Version of authority record |
| `spec_id` | Specification | Transformation spec (e.g. `T01/decision-to-outcome/v1.0`) |
| `spec_version` | Specification | Spec semver |
| `implementation_id` | Implementation | Conformance-claiming implementation |
| `implementation_version` | Implementation | Implementation semver |
| `assumptions` | Execution | Items, policy versions, evaluation mode |
| `verification_method` | Execution | CTS / FIA / receipt method used |
| `evidence_type` | Execution | Type of evidence artifact |
| `evidence_ref` | Execution | ID or hash of evidence |
| `receipt_id` | Execution | REC-HDR-1.0 governance receipt |
| `provenance_hash` | Historical | Hash of this entry (`entry_hash` alias) |
| `parent_hash` | Historical | Hash of previous entry |
| `status` | Execution | pass \| fail |
| `timestamp` | Execution | ISO8601 |

### Legacy field aliases (PL-1.0 → PL-1.1)

| PL-1.0 | PL-1.1 |
|--------|--------|
| `id` | `entry_id` |
| `transformation_spec_id` | `spec_id` |
| `entry_hash` | `provenance_hash` |

## PL-1.0 entry fields (legacy)

| Field | Description |
|-------|-------------|
| `entry_id` | Unique identifier |
| `timestamp` | ISO8601 |
| `actor` | IdentityObject reference |
| `change_type` | architectural \| governance \| runtime \| semantic |
| `description` | Human summary |
| `evidence_refs` | EvidenceObject IDs |
| `receipt_ref` | Governance receipt ID |
| `parent_hash` | Hash of previous entry |
| `entry_hash` | Hash of this entry |

Legacy entries MUST be migratable to PL-1.1 where `implementation_id` and `authority_id` can be inferred from release metadata.

## Invariant P-1 (ADR-004)

Every **transformation** provenance entry SHALL include all PL-1.1 binding fields. See [CA-1.1](../../specification/constitutional-amendments/CA-1.1-four-layer-provenance.md).

## Properties

- **Append-only** — never modify or delete
- **Hash-chained** — tamper-evident
- **Receipt-anchored** — every entry references valid receipt
- **Assumption-aware** — replay requires matching assumptions block
- **Immutable history** — broken chain is unconstitutional

## API (conceptual)

- `append(entry)` — validate PL-1.1 completeness
- `verify_chain()`
- `get_lineage(object_id)`
- `replay(timestamp, assumptions)` — assumption-aware replay
- `verify_binding(authority_id, spec_id, impl_id)`

## Four-layer model

See [four-layer-provenance-model.md](../../specification/four-layer-provenance-model.md), [layer-object-model.md](../../specification/layer-object-model.md).

## Implementation

- `governance/continuity_ledger.py` (transition to PL-1.1)
- `.runtime/nova-studio/ledger.jsonl` (preview — transitional PL-1.0 shape)
