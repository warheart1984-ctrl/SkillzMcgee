# Governance Ledger Schema (GLS-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — **canonical** (not derived)  
**Schema:** [schema.json](./schema.json)  
**Ledger:** [ledger.jsonl](./ledger.jsonl)

## Purpose

The canonical record of governance decisions, steward votes, rationales, and release outcomes.

**This ledger is canonical, not derived.** It records governance **decisions**, not measurements.

| Layer | Records |
|-------|---------|
| COR / CSR / DRA | Measured state |
| Governance Ledger | Steward decisions **about** measured state |

## Entry model

Each line in `ledger.jsonl` is one immutable entry:

- `entry_id` — unique identifier (`GLS-YYYYMMDD-NNN`)
- `timestamp` — ISO 8601 decision time
- `decision_type` — `release_vote` | `policy_update` | `spec_authorization` | `role_assignment` | `audit_result`
- `inputs` — exact measurement versions evaluated (`cor_version`, `csr_version`, `dra_version`, `cav_version`, `canonical_commit`)
- `decision` — `approve` | `reject` | `defer`
- `rationale` — steward-facing reasons (array of strings)
- `steward_votes` — per-steward vote record
- `governance_hash` — SHA-256 of canonical entry payload
- `previous_hash` — hash chain link (genesis: `GENESIS`)

## Guarantees

1. Governance decisions are **immutable** (append-only ledger)
2. Decisions reference the **exact canonical state** they evaluated
3. Governance is **auditable and reconstructable** from ledger + commit

## CLI

```bash
node tools/crk.mjs gls validate
node tools/crk.mjs gls list
node tools/crk.mjs gls append --file path/to/entry.json
```

## Related

- [SCVP-1.0](../../conformance/certification/SCVP-1.0.md) — voting protocol
- [SCC-1.0](../steward-council/SCC-1.0.md) — council charter
- [SGDF-1.0](../../conformance/certification/SGDF-1.0.md) — decision framework
