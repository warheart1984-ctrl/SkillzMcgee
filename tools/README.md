# Tools

| Path | Purpose |
|------|---------|
| [generators/csr-registry.mjs](./generators/csr-registry.mjs) | Emit CSR-1.0 claim registry |
| [generators/cor-generate.mjs](./generators/cor-generate.mjs) | Emit COR-1.0 observability report |
| [generators/proof-graph-index.mjs](./generators/proof-graph-index.mjs) | Build proof-graph index |
| [generators/explain-node.mjs](./generators/explain-node.mjs) | Explain-This-Node engine |
| [generators/counterfactual.mjs](./generators/counterfactual.mjs) | Counterfactual analysis |
| [crk.mjs](./crk.mjs) | Conformance CLI (`cor`, `query`, `explain`, `counterfactual`) |
| validators/ | Traceability and receipt validators (future) |
| merkleizer/ | Merkle spine utilities (see `governance/merkle.py`) |

## Generate normative requirement files

```bash
node tools/generators/requirements-catalog.mjs
```
