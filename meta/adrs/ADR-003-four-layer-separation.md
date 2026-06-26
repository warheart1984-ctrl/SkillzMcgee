# ADR-003: Authority–Specification–Implementation–Execution Separation

## Status

Accepted

## Context

Authority, specifications, implementations, and executions were previously treated as a single conceptual layer, making provenance and governance less explicit.

## Decision

We separate the runtime into four distinct semantic layers:

- **Authority Layer** — governance policies, constitutional amendments, council decisions
- **Specification Layer** — transformation specs, contracts, invariants, normative requirements
- **Implementation Layer** — runtime implementations claiming conformance to specs
- **Execution Layer** — artifact transformations recorded in provenance

## Consequences

**Positive:**

- Clear provenance chain: Authority → Spec → Implementation → Execution
- Independent evolution of governance, specs, implementations, and executions
- Stronger auditability and reconstructability
- Enables multi-implementation ecosystems and policy-versioned execution

**Negative:**

- Slightly more complex object model
- Requires updates to contracts, provenance, and documentation

## Linked Normative Requirements

- CRK1-R010 — Structural Transparency
- CRK1-R012 — Traceability Preservation
- CRK1-R030 — Provenance Immutability
- CRK1-R032 — Constitutional Supremacy
- CRK1-R043 — Transformation Context Binding (P-1)

## Verification Method

- CTS-S1–S3 (structural & traceability)
- CTS-G1–G3 (governance & provenance)
- FIA (founder-independence audit)

## Evidence Required

- AuthorityObject, SpecificationObject, ImplementationObject instances
- Provenance entries linking all four layers (PL-1.1)

## Traceability Links

```
Requirement → ADR-003 → layer-object-model.md → transformation contracts → CTS → Evidence → Receipts → Provenance
```

## Version

1.0

## Author

Jon
