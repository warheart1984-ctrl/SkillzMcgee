# Constitutional Observability (COR / CSR)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative instrumentation — not documentation

This directory defines how the repository reports its own constitutional health.

| Artifact | Purpose |
|----------|---------|
| [COR-1.0/spec.md](./COR-1.0/spec.md) | Constitutional Observability Report specification |
| [COR-1.0/schema.json](./COR-1.0/schema.json) | Canonical COR JSON schema |
| [CSR-1.0/spec.md](./CSR-1.0/spec.md) | Claim Status Registry specification |
| [CSR-1.0/registry.json](./CSR-1.0/registry.json) | Machine-readable claim maturity states |

## Related

| Path | Purpose |
|------|---------|
| [../proof-graph/](../proof-graph/) | Proof-graph index, validator, visualizer, query API |
| [../certification/v1.0-coherence-checklist.md](../certification/v1.0-coherence-checklist.md) | Release gate checklist |
| [../../docs/public/dont-trust-query-it.md](../../docs/public/dont-trust-query-it.md) | Public messaging |

## Generate COR-1.0

```bash
node tools/crk.mjs cor generate --out meta/COR-1.0.json
node tools/crk.mjs query coverage
node tools/crk.mjs validate closure
```

**Honest posture:** COR reports `proof_closure: fail` until all requirements reach verified status with anchored evidence. See [RELEASE_NOTES_v1.0](../../meta/RELEASE_NOTES_v1.0.md).
