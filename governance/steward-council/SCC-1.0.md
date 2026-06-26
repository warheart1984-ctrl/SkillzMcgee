# Steward Council Charter (SCC-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — canonical governance charter  
**Related:** [stewardship-charter.md](../../meta/stewardship-charter.md), [steward-council-governance-process.md](../../meta/steward-council-governance-process.md), [GLS-1.0](../governance-ledger/GLS-1.0.md)

## A. Purpose

The Steward Council governs the constitutional evolution of Continuity OS.  
It does **not** measure evidence — it **evaluates** evidence.

## B. Authority

The Council has authority to:

- approve or reject releases
- authorize new specifications
- update governance policies
- assign or revoke steward roles

The Council does **not**:

- modify canonical artifacts directly
- override COR-1.0 or CSR-1.0
- assert PASS/FAIL independent of evidence

## C. Membership

| Rule | Value |
|------|-------|
| Minimum | 3 stewards |
| Maximum | 9 stewards |
| Term | 12 months, renewable |
| Removal | supermajority vote |

## D. Responsibilities

Stewards must:

- review COR-1.0, CSR-1.0, DRA-1.0, CAV-1.0
- evaluate release readiness per [RCD-1.0](../../conformance/certification/RCD-1.0.md)
- ensure constitutional integrity
- maintain founder-independence ([FIA](../../conformance/founder-independence-audit/FIA.md))
- record decisions in the [Governance Ledger](../governance-ledger/GLS-1.0.md)

## E. Decision types

| Type | `decision_type` |
|------|-----------------|
| Release approval | `release_vote` |
| Specification authorization | `spec_authorization` |
| Governance policy updates | `policy_update` |
| Steward appointments | `role_assignment` |
| External audit result | `audit_result` |

## F. Voting rules

| Rule | Threshold |
|------|-----------|
| Quorum | ⅔ of seated stewards |
| Approval | ⅔ supermajority |
| Abstentions | Allowed; not counted toward approval denominator |

Procedure: [SCVP-1.0](../../conformance/certification/SCVP-1.0.md)  
Onboarding: [steward-onboarding-v1.0.md](./steward-onboarding-v1.0.md)

## G. Transparency

All decisions must be:

- recorded in the Governance Ledger (`governance/governance-ledger/ledger.jsonl`)
- reproducible from canonical state at `inputs.canonical_commit`
- accompanied by rationale

## H. Separation of concerns

| Layer | Role |
|-------|------|
| **Canonical** (`/specification/`) | Defines truth |
| **Derived** (`/meta/`, observability) | Reports measured truth |
| **Observability** | Measures |
| **Governance** | Decides |

This is the governance equivalent of [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md) and [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md).
