# GL-1.0 — Steward Council Governance Ledger

Append-only JSONL record of steward governance decisions. Constitutional memory of governance.

## File

`governance/ledger/ledger.jsonl`

## Invariants

- Append-only (no in-place edits)
- Each record cryptographically hashed (`id: sha256:...`)
- Continuity-linked (`continuityCheckpoint`, `parentDecisionId`)
- Steward-signed (`signature`, `publicKey`)
- Evidence-backed (COR, CSR, DRA, proof graph hash)
- Rationale required

## Relationship to GLS-1.0

`governance/governance-ledger/` (GLS-1.0) remains the council genesis record. GL-1.0 is the steward-signed operational format for v1.0 external verification. Tools accept both; `ledger verify` validates GL-1.0.

## Verification

```bash
npm run audit -- ledger verify
# or: node tools/crk.mjs ledger verify
```

See `conformance/certification/auditor-handbook-internal-v1.0.md` and `conformance/certification/SCVP-1.0.md`.
