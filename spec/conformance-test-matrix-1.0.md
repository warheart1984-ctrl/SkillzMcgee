# Version 1.0 Conformance Test Matrix

| Field | Value |
|-------|-------|
| Status | Normative |
| Scope | CTS-1.0 Coverage |
| Stability | Frozen |
| Version | 1.0 |

---

## 1. Purpose

This matrix defines the complete set of conformance requirements and their mapping to CTS-1.0 test cases.

It ensures that implementations are tested consistently and comprehensively.

**CTS suite:** [../conformance/CTS-1.0/README.md](../conformance/CTS-1.0/README.md)
**Resolution map:** [../conformance/resolution-map.json](../conformance/resolution-map.json)
**Certification checklist:** [certification-checklist-1.0.md](./certification-checklist-1.0.md)

---

## 2. Matrix Structure

Each row defines:

| Column | Description |
|--------|-------------|
| **Requirement** | Normative behavior under test |
| **Category** | Matrix category (Canonical, Loop, Proof, Repro, Drift) |
| **Test ID** | Matrix test identifier |
| **CTS mapping** | Corresponding CTS-1.0 series (where applicable) |
| **Expected behavior** | Pass condition |
| **Evidence produced** | Artifact or receipt type |

**Pass condition (CTS-1.0):** All M-, S-, E-, G-, and D-series tests pass with zero exceptions.

---

## 3. Conformance Matrix

### 3.1 Canonical Artifact Model (CAR-1.0)

| Requirement | Category | Test ID | CTS | Expected Behavior | Evidence |
|-------------|----------|---------|-----|-------------------|----------|
| CAR parsing | Canonical | CAR-P01 | S1, S2 | Parses CAR-1.0 | CAR artifact |
| Canonical hashing | Canonical | CAR-H01 | S2, G3 | Hashes match spec | Hash receipts |
| Category validation | Canonical | CAR-C01 | S3, E2 | Categories match | Validation receipts |
| Serialization determinism | Canonical | CAR-S01 | E1, E2 | Deterministic serialize | CAR artifact |

### 3.2 Constitutional Loop

| Requirement | Category | Test ID | CTS | Expected Behavior | Evidence |
|-------------|----------|---------|-----|-------------------|----------|
| Validation stage | Loop | LOOP-V01 | M1, S4 | Correct validation | Validation artifact |
| Measurement stage | Loop | LOOP-M01 | M2, M3 | Deterministic measurement | Measurement artifact |
| Analysis stage | Loop | LOOP-A01 | M3, E3 | Correct interpretation | Analysis artifact |
| Governance stage | Loop | LOOP-G01 | G1, G2 | Correct decision | Governance artifact |
| Stage ordering | Loop | LOOP-O01 | S4, E4 | No merge/reorder/bypass | Loop trace |

### 3.3 Proof Graph Semantics

| Requirement | Category | Test ID | CTS | Expected Behavior | Evidence |
|-------------|----------|---------|-----|-------------------|----------|
| Acyclic graph | Proof | PG-A01 | E4, S5 | No cycles | PGI graph |
| Monotonic lineage | Proof | PG-M01 | E3, D2 | Lineage monotonic | PGI graph |
| Provenance anchors | Proof | PG-P01 | G3, G4 | Anchors correct | Provenance receipts |
| One artifact per stage | Proof | PG-O01 | E2, S3 | Exactly one output per stage | Transformation receipt |

### 3.4 Reproducibility

| Requirement | Category | Test ID | CTS | Expected Behavior | Evidence |
|-------------|----------|---------|-----|-------------------|----------|
| Deterministic outputs | Repro | REP-D01 | E1, E5 | Same inputs â†’ same outputs | Repro receipts |
| Canonical derivation | Repro | REP-C01 | E2, M5 | Derived from canonical state | Ledger entries |
| Independent reproduction | Repro | REP-I01 | E5, G5 | Cross-run equivalence | MRI parity report |

### 3.5 Drift Analysis

| Requirement | Category | Test ID | CTS | Expected Behavior | Evidence |
|-------------|----------|---------|-----|-------------------|----------|
| Drift envelope | Drift | DRA-E01 | D1, D3 | Envelope matches spec | Drift artifact |
| Drift detection | Drift | DRA-D01 | D2, D4 | Detects drift | Drift receipts |
| Drift monotonicity | Drift | DRA-M01 | D4, D5 | CE/SE monotonic | DRA report |

---

## 4. CTS Series Reference

| Series | Domain | Matrix categories |
|--------|--------|-------------------|
| **M** (M1â€“M5) | Mechanical â€” consequence loop | Loop, Repro |
| **S** (S1â€“S5) | Structural â€” schemas, contracts | Canonical, Loop, Proof |
| **E** (E1â€“E5) | Semantic â€” multiplicity, replay | Canonical, Loop, Proof, Repro |
| **G** (G1â€“G5) | Governance â€” receipts, Merkle | Canonical, Loop, Proof, Repro |
| **D** (D1â€“D5) | Drift â€” CE/SE monotonicity | Drift |

---

## 5. Repo Test Mapping (Partial)

| Matrix ID | Repository test |
|-----------|-----------------|
| LOOP-G01 / G1 | `tests/skillzmcgee/test_traceability.py` |
| PG-P01 / G4 | `tests/governance.test.js`, `tests/invariant_evaluator.test.js` |
| LOOP-M01 / M4 | `tests/nova_studio.test.js` |
| CAR-C01 | `tests/cor_suite.test.js` |
| REP-D01 | `tests/constitutional_audit.test.js` |
| DRA-D01 | `tests/communication_governance.test.js`, `tests/communication_continuity.test.js` |

Full CTS reports: `reports/` per [CTS-1.0 README](../conformance/CTS-1.0/README.md).

---

## 6. Certification Integration

| Certification level | Minimum matrix coverage |
|---------------------|-------------------------|
| **C0** | Â§3.1 (CAR-P01, CAR-H01, CAR-C01) |
| **C1** | Â§3.1 + Â§3.2 |
| **C2** | Â§3.1â€“3.4 |
| **C3** | Â§3.1â€“3.5 (full matrix) |

See [certification-profile-1.0.md](./certification-profile-1.0.md).

---

## 7. Status

This matrix is **normative** and required for all certification evaluations.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [certification-checklist-1.0.md](./certification-checklist-1.0.md) | Checklist categories map to matrix sections |
| [semantic-test-suite-1.0.md](./semantic-test-suite-1.0.md) | Semantic correctness tests (SEM-*) |
| [CAV-1.0-Validation.md](./CAV-1.0-Validation.md) | Validation layer spec |
| [../conformance/MRI-1.0/README.md](../conformance/MRI-1.0/README.md) | Reference implementation for equivalence |
