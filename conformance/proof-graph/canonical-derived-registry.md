# Canonical vs Derived Artifact Registry

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative  
**Instance:** [canonical-derived-registry.json](./canonical-derived-registry.json)

## Purpose

Make the canonical/derived distinction explicit and enforce:

> Every derived artifact SHALL be reproducible from canonical repository state.

## Canonical layer (source of truth)

Artifacts that define constitutional truth. Edited only through governed change (spec amendments, ADRs, steward approval):

- Authorities, specifications, normative requirements
- Transformation contracts
- Implementation source (MRI modules, runtime code)
- Transformation records (when committed as evidence)
- Evidence artifacts, receipts, provenance entries (runtime-generated but append-only)

## Derived layer (computed state)

Artifacts regenerated from canonical inputs. **Non-authoritative:**

- Proof-Graph Index
- COR-1.0, CSR-1.0 (CSR may be committed as audit baseline but is regenerable)
- Coverage reports, release manifests
- Dashboards, visualizations, introspection outputs

## Rules

| Rule | Meaning |
|------|---------|
| `derived_non_authoritative` | Derived state never overrides canonical |
| `must_be_regenerable` | `npm run spec:cor` / generators reproduce derived artifacts |
| `disagreement_resolution` | **canonical_wins** |

## Regeneration commands

```bash
node tools/generators/proof-graph-index.mjs
node tools/generators/csr-registry.mjs
node tools/generators/cor-generate.mjs --out meta/COR-1.0.json
```

## Invariant (DI-1)

Every derived artifact SHALL declare its canonical inputs in `canonical-derived-registry.json`.
