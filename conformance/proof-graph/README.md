# Proof Graph (Introspection Layer)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Derived instrumentation — non-authoritative

The proof graph connects requirements, authorities, specifications, implementations, verification, evidence, receipts, and provenance into a traversable, explainable structure.

| Artifact | Purpose |
|----------|---------|
| [index.schema.json](./index.schema.json) | Proof-Graph Index JSON schema |
| [index.json](./index.json) | Machine-readable graph (generated) |
| [explain-this-node.md](./explain-this-node.md) | Explain-This-Node engine specification |
| [counterfactual-engine.md](./counterfactual-engine.md) | Counterfactual analysis engine specification |
| [canonical-derived-registry.md](./canonical-derived-registry.md) | Canonical vs derived artifact rules |
| [canonical-derived-registry.json](./canonical-derived-registry.json) | Registry instance |
| [operational-architecture.txt](./operational-architecture.txt) | v1.0 three-layer architecture diagram |

## CLI

```bash
node tools/generators/proof-graph-index.mjs
node tools/crk.mjs explain NODE CRK1-R012
node tools/crk.mjs counterfactual remove NODE CRK1-R012
node tools/crk.mjs counterfactual downgrade CLAIM CRK1-R012 verified implemented
```

## Invariant

- **Canonical** defines truth.
- **Derived** computes state from canonical.
- **Operational** exposes and explains that state.

Derived artifacts MUST be regenerable from canonical sources. On disagreement, **canonical wins**.
