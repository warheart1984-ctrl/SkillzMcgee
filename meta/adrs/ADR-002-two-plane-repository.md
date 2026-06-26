# ADR-002: Two-Plane Repository (Specification vs Conformance)

## Status

Accepted

## Context

CRK-1 documentation mixed normative law with tests and implementations, making audit and reproduction difficult.

## Decision

Split the repository into Plane 1 (`/specification/` — frozen WHAT) and Plane 2 (`/conformance/` — evolvable HOW), enforced by Repository Invariant R-∞.

## Consequences

- Positive: Auditors can read spec without implementation noise; conformance artifacts must resolve to requirements
- Negative: Requires maintaining resolution-map and traceability matrix
- Neutral: Existing runtime code remains in `src/`, `governance/`, mapped via conformance pointers

## Linked Normative Requirements

- CRK1-R012 — Traceability Preservation
- CRK1-R036 — Requirement-to-ADR Traceability
- CRK1-R037 — Implementation-to-CTS Traceability

## Verification Method

CTS-S5, traceability validator; `resolution-map.json`, `traceability-matrix.json`

## Evidence Required

TraceabilityBlock in receipts; ADR linkage; CTS test mapping

## Traceability Links

```
CRK1-R012 → ADR-002 → specification/ + conformance/ → resolution-map → matrix → entry:trace
```

## Version

1.0

## Author

SkillzMcGee maintainers
