# COR-1.0 Generator CLI Specification

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative  
**Schema:** [schema.json](./schema.json)  
**Implementation:** `tools/crk.mjs` · `tools/generators/cor-generate.mjs`

## Command

```bash
crk cor generate \
  --out meta/COR-1.0.json \
  [--format json|yaml] \
  [--fail-on-incomplete] \
  [--include-research] \
  [--explain NODE_ID] \
  [--counterfactual NODE_ID]
```

Equivalent:

```bash
node tools/crk.mjs cor generate --out meta/COR-1.0.json
```

## Behavior

The generator is **non-authoritative**. It computes state from canonical artifacts only:

| Input | Path |
|-------|------|
| Requirement catalog | `specification/normative-requirements/catalog.json` |
| Traceability matrix | `conformance/traceability-matrix.json` |
| Claim Status Registry | `conformance/observability/CSR-1.0/registry.json` |
| Resolution map | `conformance/resolution-map.json` |
| Evidence ledger schema | `conformance/evidence-ledger/ledger.json` |
| Provenance schema | `conformance/provenance-ledger/schema.json` |
| Runtime ledger (optional) | `.runtime/nova-studio/ledger.jsonl` |

For each requirement it computes:

- authority, specification, implementation, verification, evidence, receipt, provenance, reproduction status
- claim status (from CSR-1.0, cross-checked against derived dimensions)
- exceptions list

Global summary:

- orphaned requirements / specs / implementations
- missing evidence / receipts
- unanchored receipts
- broken provenance
- unreproduced claims
- unresolved assumptions
- `proof_closure: pass | fail`

CSR-1.0 is **regenerated** during COR generation when `--refresh-csr` is passed; otherwise the committed registry is read.

## Capabilities

### A. State queries (via `crk query`)

| Query | Command |
|-------|---------|
| What is implemented? | `crk query requirements --implemented` |
| What is verified? | `crk query requirements --verified` |
| What is missing? | `crk query requirements --incomplete` |
| Coverage for one req | `crk query coverage --requirement CRK1-R020` |

### B. Explanation queries

```bash
crk cor generate --explain CRK1-R012
```

Returns why a requirement is incomplete: missing edges in the proof graph, CSR vs derived mismatch, absent tests, unanchored receipts.

### C. Counterfactual queries

```bash
crk cor generate --counterfactual CRK1-R012
```

Returns what regresses if this node is removed: dependent requirements, broken closure paths, downstream evidence/receipt/provenance orphans.

### D. Derived-only guarantee

The generator **never** upgrades claim status beyond what artifacts support. CSR overrides may only **downgrade** or mark `research`; upgrades require matching evidence in the traceability matrix and runtime ledger.

## Flags

| Flag | Effect |
|------|--------|
| `--out PATH` | Write COR-1.0 JSON (required) |
| `--format json\|yaml` | Output format (default: json) |
| `--fail-on-incomplete` | Exit 1 if any requirement incomplete |
| `--include-research` | Include research-status rows in summary counts |
| `--explain NODE_ID` | Print explanation for requirement or graph node |
| `--counterfactual NODE_ID` | Print regression analysis for node removal |
| `--refresh-csr` | Regenerate CSR-1.0 from matrix before COR |

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Proof closure satisfied |
| 1 | Incomplete coverage |
| 2 | Structural error in graph |
| 3 | Invalid schema / I/O failure |

## Release gate

`crk cor generate --fail-on-incomplete` is the CI hook for `v1.0.0-spec` tagging. Until proof closure passes, the command **must** exit non-zero (honest posture).
