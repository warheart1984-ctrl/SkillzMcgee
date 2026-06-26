# Evidence Ledger (EL-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Schema stub — runtime population in preview implementations

The evidence ledger indexes constitutional artifacts produced by each transformation contract (CA-1.0).

## Schema

[ledger.json](./ledger.json) — JSON schema stub for evidence index entries.

## Relationship to other ledgers

| Ledger | Purpose |
|--------|---------|
| **Evidence ledger** (this) | Index of semantic artifacts per stage |
| **Provenance ledger** (PL-1.0) | Immutable historical truth |
| **Merkle spine** | Cryptographic anchoring of receipt chains |
| **Runtime ledger** | `.runtime/nova-studio/ledger.jsonl` (preview) |

## Entry types

Each entry records one artifact from a CA-1.0 stage:

- `DecisionObject`, `OutcomeObject`, `EvidenceObject`, `InterpretationObject`
- `GovernanceReceipt` (REC-HDR-1.0)

## Transformation contract linkage

| Contract | `transformation_contract` value |
|----------|----------------------------------|
| decision-to-outcome | `specification/transformation-contracts/decision-to-outcome.md` |
| outcome-to-evidence | `specification/transformation-contracts/outcome-to-evidence.md` |
| evidence-to-interpretation | `specification/transformation-contracts/evidence-to-interpretation.md` |
| interpretation-to-policy-eval | `specification/transformation-contracts/interpretation-to-policy-eval.md` |
