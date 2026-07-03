# CRK-1 Specification (Plane 1)

**Authority:** CRK-1 Specification v1.0
**Status:** Normative — frozen for Version 1.0

This directory contains **only normative content** — what must be true. No tests, tools, or implementations belong here.

## Two-Plane Architecture

```
                   ┌──────────────────────────────────────┐
                   │        CRK‑1 SPECIFICATION           │
                   │        (WHAT must be true)           │
                   ├──────────────────────────────────────┤
                   │  • Constitutional Principles          │
                   │  • Normative Requirements (R001–R042) │
                   │  • Object Model (COM‑1.0)             │
                   │  • Contracts                          │
                   │  • Invariants (K0–K12)                │
│  • Required Behaviors                 │
│  • Drift Envelopes                    │
│  • Formal Semantics                   │
│  • CA-1.0 (One-Artifact-Per-Stage)    │
│  • CA-1.1 (Four-Layer Provenance)     │
│  • Transformation Contracts           │
└───────────────────────┬──────────────┘
                                           │
                                           │  Conformance resolves to Specification
                                           ▼
                   ┌──────────────────────────────────────┐
                   │      CONFORMANCE ECOSYSTEM           │
                   │      (HOW we prove it is true)       │
                   ├──────────────────────────────────────┤
                   │  • CTS‑1.0  • MRI‑1.0  • C0–C6        │
                   │  • R1‑0  • FIA  • Merkle / Provenance │
                   └──────────────────────────────────────┘
```

## Contents

| Document | Purpose |
|----------|---------|
| [principles.md](./principles.md) | Philosophical and structural foundations |
| [invariants.md](./invariants.md) | Kernel Codex K0–K12 |
| [object-model.md](./object-model.md) | COM-1.0 — five canonical objects |
| [contracts.md](./contracts.md) | Evidence, Governance, Runtime, Semantic |
| [required-behaviors.md](./required-behaviors.md) | Constitutional loop, replay, governance |
| [drift-envelopes.md](./drift-envelopes.md) | CE(S), SE(S) monotonicity |
| [semantics.md](./semantics.md) | Operational transition rules |
| [normative-requirements/](./normative-requirements/) | R001–R042 catalog with metadata blocks |
| [constitutional-loop-v1.0.md](./constitutional-loop-v1.0.md) | 12-stage loop diagram |
| [semantic-artifact-types.md](./semantic-artifact-types.md) | Formal artifact type system |
| [constitutional-proof.md](./constitutional-proof.md) | End-to-end correctness argument |
| [constitutional-stack-v1.0.md](./constitutional-stack-v1.0.md) | Six-layer stack: COR, Proof Analysis, Governance, Maturity, Hygiene, Messaging |
| [four-layer-provenance-model.md](./four-layer-provenance-model.md) | Authority → Spec → Implementation → Execution |
| [layer-object-model.md](./layer-object-model.md) | AuthorityObject, SpecificationObject, ImplementationObject |
| [constitutional-amendments/](./constitutional-amendments/) | CA-1.0, CA-1.1 |
| [transformation-contracts/](./transformation-contracts/) | T01–T12 transformation contracts |
| [requirement-graph/](./requirement-graph/) | Requirement DAG and dependencies |

## Repository Invariant R-∞

Every verification artifact in `/conformance/` must resolve to one or more normative requirements in this plane.

See [../conformance/resolution-map.json](../conformance/resolution-map.json).

## Related

- Conformance plane: [../conformance/README.md](../conformance/README.md)
- Public docs: [../docs/launch-kit/README.md](../docs/launch-kit/README.md)
- Runtime implementation: `src/crk1/`, `governance/constitution/`, `nova-studio/`
