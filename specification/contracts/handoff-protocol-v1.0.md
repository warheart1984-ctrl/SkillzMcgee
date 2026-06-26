# Handoff Protocol (Cursor ↔ Codex) v1.0

Constitutional interface between operator surface (Cursor) and runtime (Codex).

## Cursor → Codex

Cursor may only call:

```
POST /api/run/:capabilityId
GET  /api/state
GET  /api/capabilities
GET  /api/continuity
GET  /api/drift
GET  /skillzmcgee/ledger
```

**POST body:**

```json
{
  "operator": "operator:local",
  "input": { }
}
```

## Codex → Cursor

Codex returns:

- envelope (governance receipt)
- receipts (ledger entries)
- continuity events
- drift points
- capability metadata

## Principle

**Cursor never trusts Codex. Cursor displays evidence. Codex produces evidence.**

This is the constitutional separation of powers.
