# Steward Council Voting Protocol (SCVP-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative  
**Related:** [SGDF-1.0](./SGDF-1.0.md), [RCD-1.0](./RCD-1.0.md), [ORC-1.0](./ORC-1.0.md)

## Purpose

Formal process for how stewards evaluate measured constitutional state and decide whether to approve a Version 1.0 release.

## A. Inputs to the vote

Stewards receive:

| Document | Path |
|----------|------|
| COR-1.0 | `meta/COR-1.0.json` |
| CSR-1.0 | `conformance/observability/CSR-1.0/registry.json` |
| DRA-1.0 | `meta/DRA-1.0.json` |
| CAV-1.0 | output of `crk validate canonical` |
| RCD-1.0 | [RCD-1.0.md](./RCD-1.0.md) |
| Release Manifest | `meta/RELEASE_MANIFEST_v1.0.md` (derived, non-authoritative) |

## B. Deliberation questions

Stewards must answer:

1. Does COR-1.0 show that all [RCD-1.0](./RCD-1.0.md) criteria are satisfied?
2. Are any dependency risks (DRA-1.0) unacceptable?
3. Are any unresolved assumptions critical?
4. Are any research-status claims misclassified?
5. Are any canonical artifacts incomplete or invalid?
6. Does the measured state support a stable v1.0 release?

## C. Voting procedure

### 1. Presentation phase

Observability team presents COR-1.0, CSR-1.0, DRA-1.0. **No interpretation; only measurement.**

### 2. Clarification phase

Stewards may request:

```bash
node tools/crk.mjs explain NODE <ID>
node tools/crk.mjs counterfactual remove NODE <ID>
node tools/crk.mjs dra what-unblocks <REQ_ID>
```

### 3. Deliberation phase

Stewards discuss whether measured state satisfies RCD-1.0.

### 4. Vote

Each steward votes: **Approve**, **Reject**, or **Defer**.

Approval requires a **supermajority** (⅔ of seated stewards).

### 5. Record

Decision recorded in [Governance Ledger](../../governance/governance-ledger/GLS-1.0.md). Template: [entry-template.json](../../governance/governance-ledger/entry-template.json)

## D. Governance output

```json
{
  "protocol": "SCVP-1.0",
  "decision": "approve | reject | defer",
  "votes": { "approve": 0, "reject": 0, "defer": 0 },
  "supermajority_required": 0.67,
  "rationale": ["..."],
  "timestamp": "<ISO8601>",
  "stewards": ["<names>"],
  "inputs": {
    "orc_status": "ready | not_ready",
    "rcd_satisfied": true,
    "cor_proof_closure": "pass | fail"
  }
}
```

## Separation from measurement

| Role | Responsibility |
|------|----------------|
| Observability | Generate COR, CSR, DRA; run ORC |
| Stewards | Vote against RCD-1.0 using SCVP-1.0 |
| Engineers | Close gaps identified by DRA |

SCVP does not alter measured state. It records a governance decision **about** measured state.
