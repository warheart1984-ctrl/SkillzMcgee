# COR Suite — Constitutional Observability, Reasoning, and Governance Architecture

## Overview

The COR Suite defines the foundational architecture for constitutional software systems. It establishes a strict separation between:

- **Observability** — what exists
- **Reasoning** — what the evidence implies
- **Governance** — what decisions follow
- **Lifecycle** — how requirements mature
- **Operational substrate** — how determinism is maintained

The suite is designed to be evidence-first, reproducible, and founder-independent.

## Components

The COR Suite consists of six layers:

| Layer | Document |
|-------|----------|
| **COR-1.0** — Observability | [../../spec/COR-1.0-Contract.md](../../spec/COR-1.0-Contract.md) |
| **Proof Analysis** — Reasoning | [../../spec/Proof-Analysis-Spec.md](../../spec/Proof-Analysis-Spec.md) |
| **Governance Engine** — Decision | [../../spec/Governance-Engine-Interface.md](../../spec/Governance-Engine-Interface.md) |
| **Maturity Model** — Lifecycle | [../../spec/Maturity-Model.md](../../spec/Maturity-Model.md) |
| **Repo Hygiene → COR Pipeline** — Operational | [../../spec/Repo-Hygiene-and-Pipeline.md](../../spec/Repo-Hygiene-and-Pipeline.md) |
| **Public Messaging** — Narrative | [../../spec/Public-Messaging.md](../../spec/Public-Messaging.md) |

Normative RFC: [../../spec/RFC-COR-Suite-1.0.md](../../spec/RFC-COR-Suite-1.0.md)

**Implementation:** [IMPLEMENTATION.md](./IMPLEMENTATION.md) · `npm run cor-suite:pipeline`

## Philosophy

> The repository does not declare its own correctness.
> It exposes the evidence required for independent reviewers to determine it.

This principle guides every layer of the COR Suite.

## Repository structure (this repo)

```
/
├── spec/                         ← normative COR Suite specs + schemas
├── src/
│   ├── cor/                      ← COR-1.0 generator
│   ├── analysis/                 ← Proof Analysis
│   ├── cor-suite/governance/     ← Governance engine (avoids src/governance collision)
│   ├── maturity/
│   ├── hygiene/
│   └── cli/cor-suite.ts
├── governance/charter/
├── meta/cor-suite/               ← generated artifacts
└── .github/workflows/cor-suite-ci.yml
```

Implementation in this repository also lives under `specification/`, `conformance/observability/`, `tools/generators/`, and `nova-studio/`.

## Schemas

Machine-readable JSON Schemas for all COR Suite artifacts:

| Schema | File |
|--------|------|
| COR-1.0 state vector | [../../spec/cor-state-vector.schema.json](../../spec/cor-state-vector.schema.json) |
| Proof Analysis result | [../../spec/proof-analysis.schema.json](../../spec/proof-analysis.schema.json) |
| Governance receipt | [../../spec/governance-receipt.schema.json](../../spec/governance-receipt.schema.json) |
| Maturity vector | [../../spec/maturity-vector.schema.json](../../spec/maturity-vector.schema.json) |
| Repo hygiene status | [../../spec/repo-hygiene-status.schema.json](../../spec/repo-hygiene-status.schema.json) |

Legacy generator output is documented in [../observability/COR-1.0/schema.json](../observability/COR-1.0/schema.json).

## Standards

The COR Suite is governed by:

- [../../spec/RFC-COR-Suite-1.0.md](../../spec/RFC-COR-Suite-1.0.md)
- [../../governance/charter/Founder-Independent-Governance-Charter.md](../../governance/charter/Founder-Independent-Governance-Charter.md)

All changes must follow the governance process defined in the charter.

## Reproducibility

All verification evidence **must** be:

- deterministic
- portable
- independently reproducible

**Reproduction is the highest form of correctness.**

## Generate artifacts

```bash
cd E:\skillzmcgee   # repository root
npm run spec:rebuild
node tools/generators/cor-generate.mjs --out meta/COR-1.0.json
node tools/generators/dra-analyze.mjs --out meta/DRA-1.0.json
npm run test:v1
```

## License

MIT or Apache-2.0 recommended for maximum openness. See repository root `LICENSE` when present.
