# CRK-1 Specification (Plane 1)

**Authority:** CRK-1 Specification v1.0
**Status:** Normative â€” frozen for Version 1.0

This directory contains **only normative content** â€” what must be true. No tests, tools, or implementations belong here.

## Two-Plane Architecture

```
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚        CRKâ€‘1 SPECIFICATION           â”‚
                   â”‚        (WHAT must be true)           â”‚
                   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
                   â”‚  â€¢ Constitutional Principles          â”‚
                   â”‚  â€¢ Normative Requirements (R001â€“R042) â”‚
                   â”‚  â€¢ Object Model (COMâ€‘1.0)             â”‚
                   â”‚  â€¢ Contracts                          â”‚
                   â”‚  â€¢ Invariants (K0â€“K12)                â”‚
â”‚  â€¢ Required Behaviors                 â”‚
â”‚  â€¢ Drift Envelopes                    â”‚
â”‚  â€¢ Formal Semantics                   â”‚
â”‚  â€¢ CA-1.0 (One-Artifact-Per-Stage)    â”‚
â”‚  â€¢ CA-1.1 (Four-Layer Provenance)     â”‚
â”‚  â€¢ Transformation Contracts           â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                           â”‚
                                           â”‚  Conformance resolves to Specification
                                           â–¼
                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                   â”‚      CONFORMANCE ECOSYSTEM           â”‚
                   â”‚      (HOW we prove it is true)       â”‚
                   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
                   â”‚  â€¢ CTSâ€‘1.0  â€¢ MRIâ€‘1.0  â€¢ C0â€“C6        â”‚
                   â”‚  â€¢ R1â€‘0  â€¢ FIA  â€¢ Merkle / Provenance â”‚
                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## Contents

| Document | Purpose |
|----------|---------|
| [principles.md](./principles.md) | Philosophical and structural foundations |
| [invariants.md](./invariants.md) | Kernel Codex K0â€“K12 |
| [object-model.md](./object-model.md) | COM-1.0 â€” five canonical objects |
| [contracts.md](./contracts.md) | Evidence, Governance, Runtime, Semantic |
| [required-behaviors.md](./required-behaviors.md) | Constitutional loop, replay, governance |
| [drift-envelopes.md](./drift-envelopes.md) | CE(S), SE(S) monotonicity |
| [semantics.md](./semantics.md) | Operational transition rules |
| [normative-requirements/](./normative-requirements/) | R001â€“R042 catalog with metadata blocks |
| [constitutional-loop-v1.0.md](./constitutional-loop-v1.0.md) | 12-stage loop diagram |
| [semantic-artifact-types.md](./semantic-artifact-types.md) | Formal artifact type system |
| [constitutional-proof.md](./constitutional-proof.md) | End-to-end correctness argument |
| [constitutional-stack-v1.0.md](./constitutional-stack-v1.0.md) | Six-layer stack: COR, Proof Analysis, Governance, Maturity, Hygiene, Messaging |
| [four-layer-provenance-model.md](./four-layer-provenance-model.md) | Authority â†’ Spec â†’ Implementation â†’ Execution |
| [layer-object-model.md](./layer-object-model.md) | AuthorityObject, SpecificationObject, ImplementationObject |
| [constitutional-amendments/](./constitutional-amendments/) | CA-1.0, CA-1.1 |
| [transformation-contracts/](./transformation-contracts/) | T01â€“T12 transformation contracts |
| [requirement-graph/](./requirement-graph/) | Requirement DAG and dependencies |

## Repository Invariant R-âˆž

Every verification artifact in `/conformance/` must resolve to one or more normative requirements in this plane.

See [../conformance/resolution-map.json](../conformance/resolution-map.json).

## Related

- Conformance plane: [../conformance/README.md](../conformance/README.md)
- Public docs: [../docs/launch-kit/README.md](../docs/launch-kit/README.md)
- Runtime implementation: `src/crk1/`, `governance/constitution/`, `nova-studio/`
