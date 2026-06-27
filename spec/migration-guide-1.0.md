# Version 1.0 Migration Guide

| Field | Value |
|-------|-------|
| Status | Informative |
| Scope | Migration to Constitutional Baseline 1.0 |
| Stability | Stable |
| Version | 1.0 |

---

## 1. Purpose

This guide provides the steps required to migrate an existing implementation, prototype, or experimental runtime to the Version 1.0 constitutional baseline.

It ensures that systems built before the freeze can align with the final constitutional semantics.

**Baseline:** [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md)
**Certification:** [certification-checklist-1.0.md](./certification-checklist-1.0.md)
**Index:** [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md)

---

## 2. Migration Overview

Migration consists of four phases:

1. **Canonicalization**
2. **Semantic Alignment**
3. **Conformance Integration**
4. **Governance Integration**

Each phase must be completed **in order**.

---

## 3. Migration Phases

### 3.1 Phase 1 — Canonicalization

- Convert all artifacts to CAR-1.0
- Remove non-canonical fields from constitutional paths
- Normalize hashing and serialization
- Anchor all artifacts in canonical provenance

**Outcome:** System produces canonical artifacts consistent with Version 1.0.

**References:** [CAR-1.0-Registry.md](./CAR-1.0-Registry.md), [../conformance/provenance-ledger/spec.md](../conformance/provenance-ledger/spec.md)

### 3.2 Phase 2 — Semantic Alignment

- Align object model with CRK-1
- Enforce one-artifact-per-stage invariant
- Align constitutional loop ordering (Validation → Measurement → Analysis → Governance)
- Ensure deterministic transformations
- Validate category boundaries

**Outcome:** System exhibits correct constitutional semantics.

**References:** [../specification/README.md](../specification/README.md), [../specification/semantic-artifact-types.md](../specification/semantic-artifact-types.md), [constitutional-baseline-1.0.md §2.3](./constitutional-baseline-1.0.md#23-one-artifact-per-stage-invariant)

### 3.3 Phase 3 — Conformance Integration

- Integrate CTS-1.0
- Validate against MRI-1.0
- Generate PGI lineage
- Compute DRA drift envelopes
- Populate evidence ledger

**Outcome:** System passes conformance tests and produces valid constitutional state.

**References:** [../conformance/CTS-1.0/README.md](../conformance/CTS-1.0/README.md), [../conformance/MRI-1.0/README.md](../conformance/MRI-1.0/README.md), [../conformance/observability/DRA-1.0/spec.md](../conformance/observability/DRA-1.0/spec.md)

### 3.4 Phase 4 — Governance Integration

- Ensure governance decisions are evidence-backed
- Anchor decisions in receipts
- Validate governance → execution traceability
- Remove any implicit or hidden governance logic

**Outcome:** System becomes fully governed and traceable.

**References:** [governance-charter-1.0.md](./governance-charter-1.0.md), [Governance-Engine-Interface.md](./Governance-Engine-Interface.md), [../governance/governance-ledger/GLS-1.0.md](../governance/governance-ledger/GLS-1.0.md)

---

## 4. Migration Completion Criteria

Migration is complete when:

- [ ] All canonical artifacts match CAR-1.0
- [ ] All constitutional semantics match Version 1.0
- [ ] All conformance tests pass
- [ ] All governance decisions are traceable
- [ ] All derived artifacts are reproducible

Upon completion, run [certification-checklist-1.0.md](./certification-checklist-1.0.md) for formal certification evaluation.

---

## 5. Compatibility During Migration

Systems under migration are **not** certified until all completion criteria pass.

Partial migration must not claim Version 1.0 compatibility. See [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md) for the full compatibility definition.

---

## 6. Status

This guide is **stable** and applies to all pre-1.0 implementations.

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [certification-checklist-1.0.md](./certification-checklist-1.0.md) | Post-migration certification |
| [constitutional-evolution-guidelines.md](./constitutional-evolution-guidelines.md) | Post-1.0 evolution after migration |
| [../conformance/cor-suite/IMPLEMENTATION.md](../conformance/cor-suite/IMPLEMENTATION.md) | Reference implementation integration |
