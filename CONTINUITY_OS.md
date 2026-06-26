# Continuity OS / CRK-1 — Version 1.0

Continuity OS is a **constitutional runtime** for governed, reproducible, and semantically diverse intelligent systems. **CRK-1** is the constitutional kernel at its core.

Continuity OS doesn't replace AI models — it provides the governed execution, evidence, provenance, and accountability layer intelligent systems build upon.

Version 1.0 is the first **specification-stable**, founder-independent release of the constitutional catalog and conformance proof system.

> **Developer quick start:** see [README.md](./README.md) for runtime commands, tests, and Nova Studio.

## What's in this repository

### 1. CRK-1 Specification (WHAT must be true)

| Path | Contents |
|------|----------|
| [specification/](./specification/) | Constitutional principles, K0–K12, COM-1.0, contracts |
| [specification/normative-requirements/](./specification/normative-requirements/) | **R001–R042** with metadata blocks |
| [specification/constitutional-amendments/](./specification/constitutional-amendments/) | **CA-1.0** One-Artifact-Per-Stage |
| [specification/transformation-contracts/](./specification/transformation-contracts/) | Semantic stage contracts |
| [specification/constitutional-proof.md](./specification/constitutional-proof.md) | End-to-end correctness proof |
| [docs/whitepaper/](./docs/whitepaper/) | Public whitepaper |
| [meta/REPOSITORY_STRUCTURE_v1.0.md](./meta/REPOSITORY_STRUCTURE_v1.0.md) | Canonical repo layout |

### 2. Conformance ecosystem (HOW we prove it is true)

| Path | Contents |
|------|----------|
| [conformance/traceability-matrix.md](./conformance/traceability-matrix.md) | **Master audit matrix** (Req → CTS → MRI → Evidence) |
| [conformance/resolution-map.json](./conformance/resolution-map.json) | Machine-readable proof graph |
| [conformance/CTS-1.0/](./conformance/CTS-1.0/) | Constitutional test suite |
| [conformance/MRI-1.0/](./conformance/MRI-1.0/) | Minimal reference implementation map |
| [conformance/compliance-profiles/](./conformance/compliance-profiles/) | C0–C6 badges |
| [conformance/reproduction-harness/](./conformance/reproduction-harness/) | R1-0 / Mission #006 |

### 3. Documentation

| Path | Contents |
|------|----------|
| [docs/public-diagrams/](./docs/public-diagrams/) | Continuity OS diagram set |
| [docs/launch-kit/](./docs/launch-kit/) | Public launch materials, [FAQ](./docs/launch-kit/FAQ.md), [animation script](./docs/launch-kit/constitutional-loop-animation-script.md) |
| [docs/K-infinity-axioms/](./docs/K-infinity-axioms/) | K-∞ axiom set |
| [meta/adr-template.md](./meta/adr-template.md) | ADR template with requirement linkage |
| [meta/stewardship-charter.md](./meta/stewardship-charter.md) | Multi-steward governance |
| [meta/LONG_TERM_STABILITY_PLAN_v1.0.md](./meta/LONG_TERM_STABILITY_PLAN_v1.0.md) | 10-year stability plan |

### 4. Runnable runtime (Continuity OS v0.1 preview)

| Command | Purpose |
|---------|---------|
| `npm run nova-studio` | Governed IDE shell → http://localhost:8787 |
| `npm test` | Node test suite (singularity, governance, substrations) |
| `npm run test:nova-studio` | Nova Studio API tests (5 tests) |
| `npm run test:governance-gate` | Python governance gate (when configured) |

## Why Continuity OS matters

Continuity OS ensures:

- No hidden state
- No silent failures
- No semantic collapse
- No governance bypass
- No historical rewriting
- No founder dependence

It is the **substrate** for safe, governed, multi-model intelligence — not an agent itself.

## How to get started (auditors & stewards)

1. Read the [CRK-1 specification](./specification/README.md)
2. Review the [traceability matrix](./conformance/traceability-matrix.md) — the proof spine
3. Explore [public diagrams](./docs/public-diagrams/)
4. Run [MRI-1.0](./conformance/MRI-1.0/README.md) pointers against `src/`, `governance/`, `nova-studio/`
5. Execute [CTS-1.0](./conformance/CTS-1.0/README.md) via `npm test` and governance gate
6. Attempt [Mission #006](./conformance/reproduction-harness/R1-0.md) (independent reproduction)

## License

MIT — open, permissive, and reproduction-friendly.
