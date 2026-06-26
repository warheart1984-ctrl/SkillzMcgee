# Continuity OS Stewardship Charter (v1.0)

**Authority:** CRK-1 Specification v1.0  
**Status:** Formal multi-steward governance  
**Related:** [steward-oath.md](./steward-oath.md) · [steward-curriculum.md](../conformance/certification/steward-curriculum.md) · [LONG_TERM_STABILITY_PLAN_v1.0.md](./LONG_TERM_STABILITY_PLAN_v1.0.md)

## 1. Purpose

This charter defines how multiple stewards collectively maintain the CRK-1 specification, the conformance ecosystem, and the long-term continuity of Continuity OS.

## 2. Steward responsibilities

Stewards must:

- uphold the CRK-1 constitution (K0–K12, CA-1.0)
- maintain invariants and contracts
- preserve provenance (PL-1.0, Merkle spine)
- enforce drift monotonicity (R041)
- ensure semantic diversity (R020)
- maintain founder independence (R031, FIA)
- review and approve changes to the conformance ecosystem
- protect the integrity of the twelve-stage constitutional loop

## 3. Steward Council

A **Steward Council** is formed with:

- equal voting rights among seated stewards
- rotating chairship (6-month term)
- transparent deliberation
- public minutes
- recorded provenance for all council decisions (`entry:council_decision`)

**Operational process:** [steward-council-governance-process.md](./steward-council-governance-process.md)

## 4. Decision-making model

All changes fall into one of three categories:

### A. Constitutional changes

- require **unanimous** steward approval
- require reproduction validation (R1-0)
- require provenance anchoring
- extremely rare (Version 2.0+ amendments only)

### B. Conformance ecosystem changes

- require **2/3** approval
- must not alter constitutional semantics (Plane 1 frozen)
- must resolve to normative requirements (R-∞)

### C. Documentation and public materials

- require **simple majority**
- must not contradict Plane 1

## 5. Steward obligations

Stewards must:

- avoid conflicts of interest (disclose within 7 days)
- disclose affiliations
- maintain public transparency
- uphold the [Steward Oath](./steward-oath.md)
- ensure continuity across versions

## 6. Steward removal

A steward may be removed for:

- violating invariants
- introducing hidden state
- rewriting provenance
- collapsing semantics
- bypassing governance
- failing founder-independence audits

**Removal requires 2/3 vote** of seated stewards excluding the subject.

## 7. Steward admission

New stewards must:

1. pass the [Steward Certification Exam](../conformance/certification/steward-exam.md)
2. complete the [training curriculum](../conformance/certification/steward-curriculum.md)
3. take the [Steward Oath](./steward-oath.md)
4. be approved by **2/3 vote**

Admission is recorded as provenance entry `entry:steward_admit`.

## 8. Version governance

Each version release must:

- maintain constitutional continuity
- preserve drift monotonicity
- maintain provenance integrity
- pass reproduction (R1-0 for major/minor conformance releases)
- be approved by the Steward Council

See [LONG_TERM_STABILITY_PLAN_v1.0.md](./LONG_TERM_STABILITY_PLAN_v1.0.md).

## 9. Traceability

```
Charter → Council Decision → Provenance Entry → Receipt → Public Minutes
```

Council decisions that affect the specification or conformance planes must link to ADRs and normative requirements.

## Version

1.0
