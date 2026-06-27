# Governance Engine Interface

**Layer:** Governance (Steward Council)
**RFC:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md)
**Schema:** [governance-receipt.schema.json](./governance-receipt.schema.json)

## Identity

The steward’s decision-making substrate.

## Purpose

To convert **validated measurements and reasoned analysis** into governed decisions recorded as receipts in CAR.

## Inputs

- **CAV-1.0** findings (blocking MUST gate release; advisory informs rationale)
- **COR-1.0** state vector
- **CSR-1.0** / **DRA-1.0** measurements (when available)
- Proof Analysis claims
- Release criteria and invariant definitions
- Steward policies

Governance MUST base decisions on validated measurements and published criteria — not on unvalidated repo scans.

## Capabilities

### A. Decision making

- Approve
- Reject
- Require fixes
- Escalate
- Freeze
- Retire

### B. Workflow triggering

- Open issues
- Assign tasks
- Trigger CI/CD gates
- Require evidence updates
- Require reproduction

### C. Invariant enforcement

- Constitutional invariants
- Safety invariants
- Reproducibility invariants
- Lineage invariants

### D. Governance receipts

Each decision produces:

- decision ID
- inputs (`corStateRef`, optional `analysisRef`, CAV summary)
- rationale
- evidence references
- steward identity
- timestamp
- signature

Receipts **MUST** be registered in CAR as `kind: "governance_receipt"` with content hash and path.

## Prohibitions

Governance **MUST NOT**:

- perform analysis
- modify evidence or CAR directly (only via governed registry edits)
- infer missing artifacts
- declare correctness without evidence

## Output

Governed decisions with full provenance, conforming to `governance-receipt.schema.json`.

## Implementation

- **Governed substrate:** `project-infi/cor-suite/src/governance/`, `npm run govern`
- **Cockpit (read-only):** `skillzmcgee/cor-client/`, Nova Studio COR dashboard
- Charter: [../governance/charter/Founder-Independent-Governance-Charter.md](../governance/charter/Founder-Independent-Governance-Charter.md)
