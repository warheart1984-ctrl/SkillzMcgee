# Derived Artifact Regeneration Protocol (DARP-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative  
**Implementation:** `tools/generators/darp-regenerate.mjs`

## Purpose

Define how all derived artifacts are regenerated from canonical state — ensuring they never drift or become hand-edited.

**Invariant:** Every derived artifact SHALL be reproducible from canonical repository state.

## Derived artifacts covered

| Artifact | Output path |
|----------|-------------|
| Proof-Graph Index | `conformance/proof-graph/index.json` |
| CSR-1.0 | `conformance/observability/CSR-1.0/registry.json` |
| COR-1.0 | `meta/COR-1.0.json` |
| DRA-1.0 | `meta/DRA-1.0.json` |
| Coverage reports | `meta/coverage-report.json` (future) |
| Release manifests | `meta/RELEASE_MANIFEST_v1.0.md` (template) |

## Regeneration steps

1. **Load canonical state** — authorities, specs, requirements, contracts, implementations, transformation records, evidence, receipts, provenance
2. **Validate canonical state** — run CAV-1.0
3. **Rebuild proof-graph index** — recompute all edges and nodes
4. **Recompute CSR-1.0** — assign claim statuses from canonical evidence
5. **Recompute COR-1.0** — measure constitutional state
6. **Recompute DRA-1.0** — dependency-risk prioritization
7. **Write outputs** — timestamp, commit hash, canonical inputs recorded in metadata
8. **No manual edits** — derived artifacts MUST NOT be hand-edited; CAV flags drift

## CLI

```bash
crk regenerate all
npm run spec:rebuild
```

Equivalent to:

```bash
node tools/generators/darp-regenerate.mjs
```

## Disagreement resolution

On conflict between canonical and derived: **canonical wins**. Regenerate derived artifacts; never patch derived files to match aspiration.
