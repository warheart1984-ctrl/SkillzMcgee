# Evidence Requirements — REC-HDR-1.0

## Canonical governance receipt header (Version 1.0)

```json
{
  "type": "object",
  "required": [
    "receipt_id",
    "timestamp",
    "actor",
    "action",
    "invariant_block",
    "evidence_block",
    "traceability_block",
    "merkle_root"
  ],
  "properties": {
    "receipt_id": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" },
    "actor": { "type": "string" },
    "action": { "type": "string" },
    "invariant_block": { "type": "array", "items": { "type": "string" } },
    "evidence_block": { "type": "array", "items": { "type": "string" } },
    "traceability_block": {
      "type": "object",
      "required": ["requirement", "adr", "implementation", "cts"],
      "properties": {
        "requirement": { "type": "string" },
        "adr": { "type": "string" },
        "implementation": { "type": "string" },
        "cts": { "type": "string" }
      }
    },
    "merkle_root": { "type": "string" }
  }
}
```

**Resolves to:** CRK1-R033, R034, R042

## Studio receipt mapping (transitional)

Nova Studio ledger entries map to REC-HDR via:

| Studio field | REC-HDR field |
|--------------|---------------|
| `id` | `receipt_id` |
| `actor` | `actor` |
| `phase` / `slice` | `action` |
| `laws` | `invariant_block` (future) |
| `parentId` + hash chain | `merkle_root` (partial) |

Full REC-HDR compliance is a conformance target — see CTS-G2.
