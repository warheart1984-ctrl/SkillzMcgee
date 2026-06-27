# Proof Analysis Spec

**Layer:** Analysis
**RFC:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md)
**Schema:** [proof-analysis.schema.json](./proof-analysis.schema.json)

## Identity

A governed reasoning module that consumes **measured constitutional state** and produces derived claims.

## Purpose

To answer questions requiring reasoning over the graph, not just reporting it.

## Inputs

- **CAR-1.0** (read-only) — canonical artifact registry for identity and lineage context
- **COR-1.0** state vector (read-only) — structural integrity and requirement groupings
- **DRA-1.0** (read-only, when available) — dependency-risk and readiness metrics
- **CAV-1.0** advisory findings (optional context; MUST NOT be treated as governance decisions)
- Proof graph index (when available)
- Optional prior analysis for regression comparison

## Capabilities

### A. Counterfactual analysis

- “What breaks if X disappears?”
- “What regresses if Y changes?”

### B. Dependency impact

- Topological dependency mapping
- Blast radius estimation
- Critical path identification

### C. Regression detection

- Implementation regressions
- Verification regressions
- Evidence regressions

### D. Architectural consequence mapping

- Invariant threats
- Invalidated assumptions
- Propagation effects

## Prohibitions

Proof Analysis **MUST NOT**:

- modify repository state
- mutate COR outputs
- invent evidence
- make governance decisions

## Output

A set of reasoned claims with full derivation and traceability, conforming to `proof-analysis.schema.json`.

Each claim includes: `claimId`, `type`, `summary`, `severity`, `derivation[]`, optional `relatedRequirements[]`.

## Implementation (this repository)

- DRA-1.0: `tools/generators/dra-analyze.mjs` → `meta/DRA-1.0.json`
- PGQL: `tools/pgql/` (SELECT, EXPLAIN, COUNTERFACTUAL)
- Runtime forensics: `nova-studio/server/runtime/forensics.mjs`
- Proof graph forensics: `nova-studio/server/runtime/proofGraphForensics.mjs`
