# Version 1.0 Semantic Test Suite

| Field | Value |
|-------|-------|
| Status | Normative |
| Scope | Semantic Correctness Validation |
| Stability | Frozen |
| Version | 1.0 |

**Index:** [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md)
**Semantic grammar:** [semantic-grammar-1.0.md](./semantic-grammar-1.0.md)
**Conformance matrix:** [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md)
**Certification profile:** [certification-profile-1.0.md](./certification-profile-1.0.md)

---

## 1. Purpose

This suite verifies that an implementation preserves the semantic meaning of the Version 1.0 Constitution.

It tests **what the system means**, not how it is implemented.

Semantic correctness is required for constitutional compatibility.

**See also:** [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md)

---

## 2. Test Categories

1. Category Integrity Tests
2. Invariant Preservation Tests
3. Transformation Semantics Tests
4. Constitutional Loop Semantics Tests
5. Proof Graph Semantics Tests
6. Reproducibility Semantics Tests

---

## 3. Tests

### 3.1 Category Integrity Tests

| Test ID | Requirement | Expected Behavior |
|---------|-------------|-------------------|
| SEM-CAT-01 | Artifact categories match CRK-1 | No category drift |
| SEM-CAT-02 | WMS categories map 1:1 to CRK-1 | Observation ↔ Evidence, etc. |
| SEM-CAT-03 | No cross-category contamination | Categories remain pure |

**Reference:** [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) §2

### 3.2 Invariant Preservation Tests

| Test ID | Requirement | Expected Behavior |
|---------|-------------|-------------------|
| SEM-INV-01 | One-artifact-per-stage | Exactly one input → one output |
| SEM-INV-02 | Loop ordering preserved | V → M → A → G |
| SEM-INV-03 | Monotonic lineage | No backward edges |

**Reference:** [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) §3

### 3.3 Transformation Semantics Tests

| Test ID | Requirement | Expected Behavior |
|---------|-------------|-------------------|
| SEM-TRN-01 | Evidence → Interpretation | Interpretation references evidence |
| SEM-TRN-02 | Interpretation → Policy Evaluation | Evaluation references interpretation |
| SEM-TRN-03 | Policy Evaluation → Policy Outcome | Outcome references evaluation |

**Reference:** [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) §4.1

### 3.4 Constitutional Loop Semantics Tests

| Test ID | Requirement | Expected Behavior |
|---------|-------------|-------------------|
| SEM-LOOP-01 | Validation semantics | Correct validation logic |
| SEM-LOOP-02 | Measurement semantics | Deterministic extraction |
| SEM-LOOP-03 | Analysis semantics | Correct interpretation |
| SEM-LOOP-04 | Governance semantics | Decision grounded in analysis |

**Reference:** [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md) §2.6

### 3.5 Proof Graph Semantics Tests

| Test ID | Requirement | Expected Behavior |
|---------|-------------|-------------------|
| SEM-PG-01 | Acyclic | No cycles |
| SEM-PG-02 | Provenance anchors | Anchors correct |
| SEM-PG-03 | Semantic edges | Edges match transformation rules |

**Reference:** [../conformance/proof-graph/README.md](../conformance/proof-graph/README.md)

### 3.6 Reproducibility Semantics Tests

| Test ID | Requirement | Expected Behavior |
|---------|-------------|-------------------|
| SEM-REP-01 | Deterministic semantics | Same inputs → same meaning |
| SEM-REP-02 | Canonical derivation | Meaning derives from canonical state |

**Reference:** [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md) §2.7

---

## 4. Status

This suite is **normative** and **required** for certification.

All C1+ certification levels must pass the semantic test suite in addition to CTS-1.0 conformance tests.
