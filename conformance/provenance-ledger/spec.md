# Provenance Ledger Specification (PL-1.0)

**Resolves to:** CRK1-R030, R035

## Entry fields

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

## Properties

- **Append-only** — never modify or delete
- **Hash-chained** — tamper-evident
- **Receipt-anchored** — every entry references valid receipt
- **Immutable history** — broken chain is unconstitutional

## API (conceptual)

- `append(entry)`
- `verify_chain()`
- `get_lineage(object_id)`
- `replay(timestamp)`

## Implementation

`governance/continuity_ledger.py`, `.runtime/nova-studio/ledger.jsonl`
