# Steward Council Governance Process (v1.0)

**Authority:** CRK-1 Stewardship  
**Status:** Formal multi-steward operational process  
**Charter:** [stewardship-charter.md](./stewardship-charter.md)  
**Oath:** [steward-oath.md](./steward-oath.md)

## 1. Governance principles

The Steward Council operates under:

- **transparency** — public minutes, recorded votes
- **reproducibility** — changes validated by R1-0 where required
- **constitutional supremacy** (K12, R032)
- **minimalism** — resist spec inflation
- **founder independence** (R031, FIA)
- **public accountability** — provenance for all council decisions

## 2. Governance structure

| Role | Definition |
|------|------------|
| **Council** | All active certified stewards |
| **Chair** | Rotates every 6 months |
| **Quorum** | 2/3 of seated stewards |
| **Voting** | Recorded in provenance (`entry:council_vote`) |

## 3. Proposal types

### A. Constitutional Proposals (CP)

- Modify CRK-1 Plane 1
- Require **unanimous** approval
- Require reproduction validation (R1-0)
- Require provenance anchoring
- Extremely rare

### B. Conformance Proposals (CFP)

- Modify CTS, MRI, certification, federation tests
- Require **2/3** approval
- Must not alter constitutional semantics (R-∞)

### C. Documentation Proposals (DP)

- Public docs, diagrams, tutorials, launch materials
- Require **simple majority**
- Must not contradict Plane 1

## 4. Proposal lifecycle

### Step 1 — Draft

Author submits proposal with:

- rationale
- requirement linkage (CRK1-R###)
- transformation impact (T01–T12 if applicable)
- evidence impact (CTS, ledger, drift)

Template: use [adr-template.md](./adr-template.md) for architectural proposals.

### Step 2 — Review

Stewards review for:

- constitutional compliance
- semantic correctness
- drift impact
- provenance impact

Review period: minimum 7 days for CP/CFP; 3 days for DP.

### Step 3 — Vote

Votes recorded in provenance ledger with:

- proposal ID
- steward ID
- vote (approve | reject | abstain)
- timestamp
- Merkle anchor

### Step 4 — Implementation

Approved changes applied to:

- `specification/` (CP only)
- `conformance/` (CFP)
- `docs/` (DP)

### Step 5 — Verification

- CTS-1.0 must pass (`npm test`, governance gate)
- Reproduction harness for CP and major CFP
- Traceability matrix updated if requirements affected

## 5. Emergency governance

If invariants are violated in production:

1. **Emergency session** convened (24h notice waiver)
2. **Runtime quarantined** — halt constitutional loop
3. **Provenance frozen** — no ledger compaction
4. **Arbitration invoked** per [ARBITRATION_ENGINE.md](../conformance/federation/ARBITRATION_ENGINE.md)

Emergency actions require 2/3 quorum; post-incident report public within 14 days.

## 6. Steward admission and removal

As defined in [stewardship-charter.md](./stewardship-charter.md) §6–§7.

## 7. Meeting cadence

| Meeting | Frequency |
|---------|-----------|
| Regular council | Monthly |
| Conformance review | Quarterly |
| FIA / founder independence | Annual |
| Charter review | Annual |

## 8. Traceability

```
Proposal → ADR → Vote (provenance) → Implementation → CTS → Public minutes
```

## Version

1.0
