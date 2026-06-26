# Version 1.0 Steward Training Curriculum

**Authority:** CRK-1 Certification Program v1.0  
**Status:** Official training program  
**Duration:** 8 weeks  
**Prerequisites:** Familiarity with TypeScript/Python; read [CONTINUITY_OS.md](../../CONTINUITY_OS.md)

**Certification path:** Complete all modules → [steward exam](./steward-exam.md) → [steward oath](../../meta/steward-oath.md)

---

## Module 1 — Foundations (Week 1)

### Topics

- What is a constitutional runtime?
- CRK-1 principles
- [K-∞ axioms](../../docs/K-infinity-axioms/README.md)
- [One-artifact-per-stage invariant](../../specification/constitutional-amendments/CA-1.0-one-artifact-per-stage.md)

### Exercises

1. Identify all twelve artifact types in a sample loop trace.
2. Map CRK1-R001, R010, R020, R030 to their governing invariants (K0–K12).

### Readings

- [principles.md](../../specification/principles.md)
- [constitutional-loop-v1.0.md](../../specification/constitutional-loop-v1.0.md)

---

## Module 2 — Specification Mastery (Week 2)

### Topics

- Object model (COM-1.0 + extensions)
- Constitutional contracts
- Invariants K0–K12
- Drift envelopes (CE/SE)
- Formal semantics

### Exercises

1. Write a draft transformation contract for one stage using [template.md](../../specification/transformation-contracts/template.md).
2. Validate a sample drift envelope for monotonicity.

### Readings

- [object-model.md](../../specification/object-model.md)
- [semantic-artifact-types.md](../../specification/semantic-artifact-types.md)
- [contracts.md](../../specification/contracts.md)
- [drift-envelopes.md](../../specification/drift-envelopes.md)

---

## Module 3 — Conformance Ecosystem (Week 3)

### Topics

- CTS-1.0
- MRI-1.0
- Compliance profiles C0–C6
- Certification program

### Exercises

1. Run `npm test` and `npm run test:nova-studio`; map failures to requirements.
2. Diagnose one CTS failure and produce an evidence ledger entry.
3. Locate requirement resolution in [traceability-matrix.md](../traceability-matrix.md).

### Readings

- [CTS-1.0/README.md](../CTS-1.0/README.md)
- [MRI-1.0/README.md](../MRI-1.0/README.md)
- [compliance-profiles/](../compliance-profiles/)

---

## Module 4 — Governance & Provenance (Week 4)

### Topics

- Governance receipts (REC-HDR-1.0)
- Merkle spine
- Provenance ledger (PL-1.0)
- Lineage graphs

### Exercises

1. Validate a receipt against REC-HDR-1.0 schema.
2. Detect a simulated provenance fork in sample ledger data.
3. Reconstruct lineage from `.runtime/nova-studio/ledger.jsonl` (or fixture).

### Readings

- [merkle-spine/spec.md](../merkle-spine/spec.md)
- [provenance-ledger/spec.md](../provenance-ledger/spec.md)
- T09–T11 transformation contracts

---

## Module 5 — Semantic Systems (Week 5)

### Topics

- Frame diversity
- Semantic replay (SRE)
- Drift monotonicity

### Exercises

1. Replay an interpretation from evidence + frame set; verify determinism.
2. Detect semantic collapse in a frame-diversity audit.

### Readings

- [semantics.md](../../specification/semantics.md)
- T03, T12 transformation contracts
- CRK1-R020–R022, R041

---

## Module 6 — Federation & Arbitration (Week 6)

### Topics

- Multi-runtime federation
- [Arbitration rules](../federation/ARBITRATION_ENGINE.md)
- Cross-runtime continuity

### Exercises

1. Resolve a simulated Merkle root mismatch using Rule A.
2. Apply full arbitration procedure (steps 1–8) on paper for two divergent runtimes.
3. Review [federation test suite](../federation/TEST_SUITE.md) F1–F6.

### Readings

- [ARBITRATION_ENGINE.md](../federation/ARBITRATION_ENGINE.md)
- [TEST_SUITE.md](../federation/TEST_SUITE.md)

---

## Module 7 — Stewardship (Week 7)

### Topics

- Steward responsibilities
- [Stewardship Charter](../../meta/stewardship-charter.md)
- Anti-patterns (hidden state, silent bypass, founder knowledge)
- Founder-independence (FIA)
- Ethical obligations

### Exercises

1. Perform a founder-independence audit checklist per [FIA.md](../founder-independence-audit/FIA.md).
2. Produce a one-page stewardship report for a sample deployment.

### Readings

- [steward-oath.md](../../meta/steward-oath.md)
- [constitutional-proof.md](../../specification/constitutional-proof.md)
- [FIA.md](../founder-independence-audit/FIA.md)

---

## Module 8 — Certification (Week 8)

### Final exam

| Component | Reference |
|-----------|-----------|
| Written exam (sections 1–5) | [steward-exam.md](./steward-exam.md) |
| Practical CTS run | `npm test`, governance gate |
| Provenance validation | PL-1.0 exercise |
| Drift analysis | CE/SE inspector |
| Arbitration simulation | Module 6 exercise |

### Ceremony

Stewards take the **Version 1.0 Steward Oath** upon passing.

Certification record: provenance entry `entry:steward_cert`, minimum profile **C4**.

---

## Weekly time commitment

| Week | Hours (estimate) |
|------|------------------|
| 1–2 | 6–8 (reading-heavy) |
| 3–5 | 8–10 (hands-on) |
| 6–7 | 8–10 (federation + audit) |
| 8 | 12–16 (exam + ceremony) |

---

## Instructor resources

- [Animation script](../../docs/launch-kit/constitutional-loop-animation-script.md) — teaching aid
- [FAQ.md](../../docs/launch-kit/FAQ.md) — public Q&A reference
- [Whitepaper](../../docs/whitepaper/CONTINUITY_OS_v0.1_WHITEPAPER.md)
