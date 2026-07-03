# COR-1.0 Contract

**Layer:** Measurement (with CSR-1.0, DRA-1.0)
**RFC:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md)
**Schema:** [cor-state-vector.schema.json](./cor-state-vector.schema.json)

## Identity

COR-1.0 is the deterministic **measurement** of constitutional repository state, derived from CAR-1.0.

## Purpose

To expose exactly what exists, how it is linked, and what evidence supports it — **without inference, interpretation, or governance decisions**.

## Inputs (normative)

- **CAR-1.0** — Canonical Artifact Registry (`car/car-1.0.json`); MUST be the sole source of canonical object identity.
- **CAV-1.0** — Validation MUST pass blocking checks before COR generation runs.

COR MUST NOT scan the repository for canonical paths when CAR is available.

## Scope

COR-1.0 reports:

### A. Normative requirements

For each requirement (grouped from CAR entries by namespace and `kind: requirement`):

- ID
- Authority
- Specification artifact(s)
- Implementation artifact(s)
- Verification artifact(s)
- Evidence
- Provenance
- Reproduction status
- Maturity level

### B. Structural integrity

- Orphaned requirements
- Orphaned implementations
- Orphaned tests
- Missing artifacts
- Broken lineage links
- Unresolved assumptions

### C. Repository state vector

A deterministic snapshot of relationships and evidence derived from CAR groupings.

## Prohibitions

COR-1.0 **MUST NOT**:

- infer policy or make decisions
- interpret CAV advisory findings as approve/reject
- reason, score risk, or perform counterfactuals (DRA and Proof Analysis respectively)
- make governance decisions
- declare correctness
- mutate CAR

## Output

A pure evidence ledger conforming to `cor-state-vector.schema.json`, optionally referencing `carRef`.

## Relationship to CSR and DRA

- **CSR-1.0** — stewardship metrics from governance artifacts registered in CAR.
- **DRA-1.0** — dependency-risk and readiness metrics from CAR lineage (separate artifact; MUST NOT be folded into COR prohibitions).

## Implementation

- **Governed substrate:** `project-infi/cor-suite/src/cor/from-car.ts`, `npm run cor`
- **Legacy (deprecated for canonical):** `skillzmcgee/tools/generators/cor-generate.mjs` — filesystem scan; superseded by CAR-first pipeline in project-infi
