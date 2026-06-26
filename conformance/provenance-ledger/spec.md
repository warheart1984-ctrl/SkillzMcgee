# Provenance Ledger Specification

**Resolves to:** CRK1-R030, R035, **CRK1-R043**  
**Versions:** PL-1.0 (legacy) · **PL-1.1** (four-layer binding)

## PL-1.1 entry fields (normative for v1.1+)

| Field | Layer | Description |
|-------|-------|-------------|
| `id` | Execution | Unique entry identifier |
| `input_artifact_id` | Execution | CA-1.0 input artifact |
| `output_artifact_id` | Execution | CA-1.0 output artifact |
| `transformation_spec_id` | Specification | SpecificationID (e.g. `T01/decision-to-outcome/v1.0`) |
| `implementation_id` | Implementation | ImplementationID (e.g. `MRI-1.0/nova-studio-pipeline/1.0.0`) |
| `authority_id` | Authority | AuthorizedBy (e.g. `steward-council/v1.0`) |
| `assumptions` | Execution | Policy version, evaluation mode, constitution version, frame set |
| `receipt_id` | Execution | REC-HDR-1.0 governance receipt |
| `parent_hash` | Historical | Hash of previous entry |
| `entry_hash` | Historical | Hash of this entry |
| `timestamp` | Execution | ISO8601 |

### Assumptions object

```json
{
  "policy_version": "1.0",
  "evaluation_mode": "strict",
  "constitution_version": "1.0",
  "frame_set_version": "1.0"
}
```

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

## Invariant P-1

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

See [four-layer-provenance-model.md](../../specification/four-layer-provenance-model.md).

## Implementation

- `governance/continuity_ledger.py` (transition to PL-1.1)
- `.runtime/nova-studio/ledger.jsonl` (preview — transitional PL-1.0 shape)
