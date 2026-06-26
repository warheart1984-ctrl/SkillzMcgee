# Version 1.0 Steward Certification Exam

**Authority:** CRK-1 Certification Program v1.0  
**Status:** Official steward certification exam  
**Prerequisite:** [steward-oath.md](../../meta/steward-oath.md)

## Overview

Candidates demonstrate mastery of the CRK-1 specification, the 12-stage loop, transformation contracts, governance, provenance, drift, and practical reproduction.

## Section 1 — Specification Mastery (20 questions)

Examples:

1. Define the One-Artifact-Per-Stage invariant (CA-1.0).
2. Explain the purpose of K7–K9.
3. What guarantees does the Drift Envelope provide?
4. What is the difference between a normative requirement and a conformance artifact?
5. Describe the constitutional loop in your own words.
6. What is R-∞?
7. Name the four constitutional contracts.
8. What does COM-1.0 define?
9. What is REC-HDR-1.0?
10. What is PL-1.0?

*Additional items drawn from R001–R042 catalog.*

**Pass threshold:** 16/20 (80%)

## Section 2 — Artifact Identification (10 questions)

Given an artifact, identify:

- its type
- its position in the loop (T01–T12)
- its parent artifact type
- its child artifact type
- its verification method (CTS series)

**Pass threshold:** 8/10 (80%)

## Section 3 — Transformation Contracts (12 questions)

One question per transformation T01–T12:

- What is the input artifact?
- What is the output artifact?
- What are the preconditions?
- What CTS tests verify it?

**Pass threshold:** 10/12 (80%) — each contract at least partially correct

## Section 4 — Governance & Provenance (10 questions)

Examples:

1. What must a governance receipt contain?
2. How is the Merkle root computed?
3. What constitutes a provenance violation?
4. What is append-only ledger semantics?
5. How does traceability_block link to requirements?

**Pass threshold:** 8/10 (80%)

## Section 5 — Drift & Semantics (10 questions)

Examples:

1. What causes a drift regression?
2. How is semantic multiplicity enforced?
3. What is the role of frames in interpretation?
4. Define CE vs SE envelopes.
5. What is semantic replay?

**Pass threshold:** 8/10 (80%)

## Section 6 — Practical Evaluation (hands-on)

Candidates must:

1. run MRI-1.0 pointers against the repo
2. execute CTS-1.0 (`npm test`, `npm run test:nova-studio`)
3. validate receipts against REC-HDR-1.0 schema
4. inspect drift envelopes
5. verify provenance chain
6. demonstrate replay of one constitutional loop

**Pass threshold:** 100% — zero critical failures

## Passing criteria (overall)

| Component | Requirement |
|-----------|-------------|
| Written sections (1–5) | ≥ 80% each |
| Practical section (6) | 100%, zero critical failures |
| Steward oath | Signed and recorded |
| Compliance profile | C4 minimum for steward badge |

## Certification artifacts

Upon pass, steward receives:

- certification record in `conformance/certification/`
- provenance entry: `entry:steward_cert`
- traceability link to FIA and R031

## Study materials

- [constitutional-loop-v1.0.md](../../specification/constitutional-loop-v1.0.md)
- [transformation-contracts/INDEX.md](../../specification/transformation-contracts/INDEX.md)
- [constitutional-proof.md](../../specification/constitutional-proof.md)
- [traceability-matrix.md](../traceability-matrix.md)
