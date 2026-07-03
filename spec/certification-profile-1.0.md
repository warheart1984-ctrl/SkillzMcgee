# Version 1.0 Certification Profile

| Field | Value |
|-------|-------|
| Status | Normative |
| Scope | Constitutional Conformance Certification |
| Stability | Frozen |
| Version | 1.0 |

---

## 1. Purpose

This document defines the certification criteria for verifying that an implementation of Continuity OS is:

- constitutionally compatible
- semantically correct
- reproducible
- evidence-backed
- traceability-complete

Certification ensures that independent implementations can interoperate and that constitutional guarantees are preserved.

**Baseline:** [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md)
**Compatibility:** [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md)
**Index:** [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md)

---

## 2. Certification Levels

### 2.1 Level C0 — Minimal

- CAR-1.0 parsing
- canonical hashing
- artifact category recognition

**Normative reference:** [CAR-1.0-Registry.md](./CAR-1.0-Registry.md), [CAV-1.0-Validation.md](./CAV-1.0-Validation.md)

### 2.2 Level C1 — Standard

Includes C0 plus:

- constitutional loop execution
- one-artifact-per-stage invariant
- deterministic transformations
- basic proof graph construction

**Normative reference:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md), [Proof-Analysis-Spec.md](./Proof-Analysis-Spec.md)

### 2.3 Level C2 — Verified

Includes C1 plus:

- full proof graph semantics
- provenance anchoring
- reproducibility validation
- drift envelope computation

**Normative reference:** [COR-1.0-Contract.md](./COR-1.0-Contract.md), DRA drift analysis layer

### 2.4 Level C3 — Reproduced

Includes C2 plus:

- independent reproduction of constitutional state
- cross-implementation equivalence
- lineage equivalence
- full compatibility with Version 1.0 baseline

**Normative reference:** [constitutional-compatibility-1.0.md §4](./constitutional-compatibility-1.0.md#4-compatibility-tests)

---

## 3. Certification Tests

**Checklist:** [certification-checklist-1.0.md](./certification-checklist-1.0.md) — authoritative pass/fail criteria for auditors.

**Matrix:** [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md) — CTS-1.0 requirement-to-test mapping.

Certification requires passing:

| Test suite | Role |
|------------|------|
| **CTS-1.0** | Conformance test suite |
| **MRI equivalence tests** | Reference implementation parity |
| **PGI lineage tests** | Proof graph integrity |
| **DRA drift envelope tests** | Drift boundary compliance |
| **Reproducibility tests** | Deterministic output from canonical inputs |
| **Constitutional behavior tests** | Observable behavior equivalence |
| **Semantic test suite (SEM-*)** | Semantic correctness validation |

**Semantic suite:** [semantic-test-suite-1.0.md](./semantic-test-suite-1.0.md)

**Implementation:** See [../conformance/cor-suite/IMPLEMENTATION.md](../conformance/cor-suite/IMPLEMENTATION.md) and governance gate (`tests/skillzmcgee/test_traceability.py`, `test_dependencies.py`, `test_fitness.py`).

---

## 4. Certification Artifacts

A certified implementation must produce:

| Artifact | Description |
|----------|-------------|
| **Certification report** | Summary of level achieved, test results, configuration |
| **Proof graph** | Governed transformation graph with lineage |
| **Evidence ledger** | Machine-readable conformance evidence |
| **Reproducibility receipts** | Cryptographically anchored execution records |
| **Compatibility statement** | Declaration of baseline and compatibility level |

**Schema:** [governance-receipt.schema.json](./governance-receipt.schema.json)

---

## 5. Certification Validity

Certification is valid for:

- the specific version tested
- the specific implementation tested
- the specific configuration tested

Changes to constitutional behavior **invalidate** certification.

Re-certification is required after:

- constitutional amendments (major version)
- baseline-affecting changes
- implementation changes that alter observable constitutional behavior

See [constitutional-evolution-guidelines.md §3](./constitutional-evolution-guidelines.md#3-types-of-evolution).

---

## 6. Status

This profile is **normative** and required for all Version 1.0 certified implementations.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md) | Semantics under certification |
| [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md) | Compatibility criteria (C3) |
| [constitutional-evolution-guidelines.md](./constitutional-evolution-guidelines.md) | When re-certification is required |
| [certification-checklist-1.0.md](./certification-checklist-1.0.md) | Authoritative checklist (5 categories) |
| [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md) | CTS-1.0 requirement → test ID matrix |
| [migration-guide-1.0.md](./migration-guide-1.0.md) | Pre-certification migration |
| [Maturity-Model.md](./Maturity-Model.md) | Maturity vector alignment |
