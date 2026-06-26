# Release Criteria Document (RCD-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — published release thresholds  
**Related:** [SGDF-1.0](./SGDF-1.0.md), [SCVP-1.0](./SCVP-1.0.md)

## Purpose

Defines the **measurable** conditions required for a Version 1.0 release. Stewards compare COR-1.0 against this document; they do not redefine criteria during a vote without amendment.

## A. Canonical completeness

| Criterion | Measurement |
|-----------|-------------|
| All canonical artifacts present | CAV-1.0 + ORC A1 |
| CAV-1.0 passes with **no errors** | `crk validate canonical --fail-on-error` |

## B. Proof-graph closure

| Criterion | COR field |
|-----------|-----------|
| No orphaned requirements | `summary.orphaned_requirements === 0` |
| No orphaned specifications | `summary.orphaned_specs === 0` |
| No orphaned implementations | `summary.orphaned_implementations === 0` |
| All receipts anchored | `summary.unanchored_receipts === 0` |
| All provenance chains intact | `summary.broken_provenance === 0` |
| Proof closure | `summary.proof_closure === "pass"` |

## C. Claim maturity requirements

| Criterion | Source |
|-----------|--------|
| All normative requirements ≥ **Implemented** | CSR-1.0: no `normative` status except documented deferrals |
| All **critical** requirements ≥ **Verified** | See critical set below |
| No requirement marked Verified without evidence | COR per-requirement evidence_status |
| Research claims explicitly documented | CSR `research` entries listed in release manifest |

### Critical requirements (v1.0)

M-series constitutional kernel (CRK1-R001–R010) plus:

- CRK1-R011 — Contractual Binding
- CRK1-R012 — Governance Gate
- CRK1-R015 — Outcome Completeness
- CRK1-R016 — Evidence Completeness
- CRK1-R043 — Four-Layer Provenance (P-1)

## D. Evidence requirements

Every **Verified** claim must have in COR:

- `evidence_status: complete`
- `receipt_status: complete`
- `provenance_status: anchored`
- `reproduction_status: complete` (or documented exception)

## E. Observability requirements

| Criterion | Check |
|-----------|-------|
| COR-1.0 generated from canonical state | `generated_at` + DARP manifest |
| CSR-1.0 generated from canonical state | CSR `metadata.generated_at` |
| DRA-1.0 executed | `meta/DRA-1.0.json` present |
| No PASS/FAIL **assertions** in derived artifacts | Derived reports state measured facts; `proof_closure: fail` is allowed |

## F. Reproduction requirements

- All critical claims independently reproduced (R1-0 harness)
- Reproduction logs validated by conformance team

## G. Governance requirements

- [ORC-1.0](./ORC-1.0.md) completed
- [SCVP-1.0](./SCVP-1.0.md) executed
- Decision recorded in governance ledger

## Current posture (honest)

As of last `spec:rebuild`:

- `proof_closure: fail` — PL-1.1 runtime provenance binding incomplete
- 37 unanchored receipts
- 5 research claims (R004, R031, R035, R038, R039)
- RCD **not satisfied** — v1.0 spec release may proceed; **operational closure** requires closing measured gaps

## Evaluation

```bash
node tools/crk.mjs rcd evaluate
```

Returns criterion-by-criterion pass/fail against live COR/CSR/CAV.
