# Version 1.0 Steward Handbook

| Field | Value |
|-------|-------|
| Status | Normative |
| Audience | Stewards, Editors, Constitutional Maintainers |
| Stability | Frozen |
| Version | 1.0 |

---

## 1. Purpose

This handbook defines the responsibilities, authorities, and operational practices for stewards of the Continuity OS constitutional platform.

Stewards ensure that:

- the constitutional baseline remains intact
- the specification suite evolves coherently
- compatibility is preserved
- governance decisions are evidence-backed
- the platform remains founder-independent

**Governance charter:** [governance-charter-1.0.md](./governance-charter-1.0.md)
**Steward Council:** [../governance/steward-council/SCC-1.0.md](../governance/steward-council/SCC-1.0.md)
**Index:** [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md)

---

## 2. Steward Responsibilities

### 2.1 Constitutional Integrity

Stewards must:

- protect the constitutional baseline
- prevent drift in invariants
- ensure all changes preserve semantic identity

**Normative reference:** [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md)

### 2.2 Specification Maintenance

Stewards maintain:

- CRK-1
- CAR-1.0
- proof graph semantics
- evidence & provenance models
- constitutional loop definitions

**Normative reference:** [../specification/README.md](../specification/README.md), [CAR-1.0-Registry.md](./CAR-1.0-Registry.md)

### 2.3 Conformance Oversight

Stewards ensure:

- CTS-1.0 remains authoritative
- MRI-1.0 remains correct
- PGI lineage rules remain stable
- DRA drift semantics remain valid

**Normative reference:** [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md), [../conformance/CTS-1.0/README.md](../conformance/CTS-1.0/README.md)

### 2.4 Governance Decision Review

All governance decisions must be:

- evidence-backed
- traceable
- reproducible
- linked to canonical artifacts

**Normative reference:** [../governance/governance-ledger/GLS-1.0.md](../governance/governance-ledger/GLS-1.0.md)

### 2.5 Versioning Discipline

Stewards determine:

- patch vs minor vs major
- compatibility impact
- lineage changes
- migration requirements

**Normative reference:** [constitutional-evolution-guidelines.md](./constitutional-evolution-guidelines.md), [amendment-procedure-1.0.md](./amendment-procedure-1.0.md)

---

## 3. Steward Processes

### 3.1 Change Proposal Review

Every proposal must include:

- rationale
- expected outcomes
- compatibility analysis
- evidence
- migration impact

**Template:** [../conformance/certification/governance-decision-template.json](../conformance/certification/governance-decision-template.json)

### 3.2 Constitutional Impact Assessment

Stewards classify proposals as:

| Class | Version bump |
|-------|--------------|
| **Patch** | 1.0.x |
| **Minor** | 1.x |
| **Constitutional amendment** | 2.0 |

**Procedure:** [amendment-procedure-1.0.md](./amendment-procedure-1.0.md) (amendments only)

### 3.3 Decision Recording

All decisions must produce:

- decision record
- evidence
- compatibility statement
- version update (if applicable)

**Ledger:** [../governance/governance-ledger/GLS-1.0.md](../governance/governance-ledger/GLS-1.0.md)

---

## 4. Steward Conduct

Stewards must:

- act neutrally
- avoid founder bias
- prioritize reproducibility
- maintain transparency
- uphold constitutional semantics

**Founder-independence:** [../governance/charter/Founder-Independent-Governance-Charter.md](../governance/charter/Founder-Independent-Governance-Charter.md)

---

## 5. Status

This handbook is **normative** for all Version 1.0 stewardship.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [amendment-procedure-1.0.md](./amendment-procedure-1.0.md) | Constitutional amendment process |
| [steward-training-deck-1.0.txt](./steward-training-deck-1.0.txt) | Steward onboarding training deck |
| [glossary-1.0.md](./glossary-1.0.md) | Constitutional terminology reference |
| [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) | Semantic categories and invariants |
| [certification-checklist-1.0.md](./certification-checklist-1.0.md) | Certification evaluation criteria |
| [../conformance/certification/steward-curriculum.md](../conformance/certification/steward-curriculum.md) | Steward training curriculum |
| [../conformance/certification/steward-exam.md](../conformance/certification/steward-exam.md) | Steward qualification exam |
