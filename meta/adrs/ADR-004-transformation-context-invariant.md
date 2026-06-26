# ADR-004: Transformation Context Invariant

## Status

Accepted

## Context

Transformations were previously recorded primarily as input → output mappings, without full context about authority, specification, implementation, and assumptions. This limited reconstructability and made legitimate divergences between conforming implementations hard to explain.

## Decision

We adopt a repository-wide invariant:

Every semantic transformation SHALL identify:

- the artifact it consumes,
- the specification it claims to implement,
- the authority that authorizes that specification,
- the implementation that performed it,
- the assumptions and policy versions in force,
- the artifact it produced,
- and the receipt that records the transition.

This invariant is enforced in transformation contracts and the provenance ledger (PL-1.1). Normative expression: **P-1** ([CRK1-R043](../../specification/normative-requirements/R043.md)).

## Consequences

**Positive:**

- Complete, reconstructable transformation context
- Clear explanation for differences between conforming implementations
- Stronger evidence-first posture
- Better support for policy-versioned execution and arbitration

**Negative:**

- More fields in contracts and provenance entries
- Slightly higher implementation overhead

## Linked Normative Requirements

- CRK1-R002 — Evidence Completeness
- CRK1-R003 — Interpretive Exposure
- CRK1-R010 — Structural Transparency
- CRK1-R012 — Traceability Preservation
- CRK1-R030 — Provenance Immutability
- CRK1-R041 — Drift Monotonicity
- CRK1-R042 — Governance Visibility
- CRK1-R043 — Transformation Context Binding (P-1)

## Verification Method

- CTS-M2–M3 (evidence & interpretation)
- CTS-S1–S3 (structure & traceability)
- CTS-G1–G3 (governance & provenance)
- Federation & arbitration tests

## Evidence Required

- Transformation contracts including authority/spec/impl/assumptions (sections 1–4)
- Provenance entries with full context (PL-1.1)
- Receipts referencing the same context

## Traceability Links

```
Requirement → ADR-004 → Contract Template → Provenance Schema → CTS → Evidence → Receipts → Provenance
```

## Version

1.0

## Author

Jon
