# Conformance Ecosystem (Plane 2)

**Authority:** CRK-1 Conformance v1.0
**Status:** Dynamic — evolves with engineering

This directory contains **verification, evidence, and certification** — how we demonstrate the specification is true.

## Repository Invariant R-∞

Every artifact here must resolve to one or more normative requirements in `/specification/normative-requirements/`.

**Formal:** ∀V ∈ {tests, receipts, audits, certifications, provenance, drift checks, reproduction}: ∃R ∈ Requirements: resolves(V, R)

## Contents

| Path | Purpose |
|------|---------|
| [traceability-matrix.md](./traceability-matrix.md) | **Master audit matrix** (Req → CTS → MRI → Evidence) |
| [traceability-matrix.json](./traceability-matrix.json) | Machine-readable traceability matrix |
| [resolution-map.json](./resolution-map.json) | Machine-readable proof graph |
| [resolution-map.md](./resolution-map.md) | Human-readable conformance map |
| [CTS-1.0/](./CTS-1.0/) | Constitutional test suite |
| [MRI-1.0/](./MRI-1.0/) | Minimal reference implementation |
| [compliance-profiles/](./compliance-profiles/) | C0–C6 badges |
| [certification/](./certification/) | **ORC**, **RCD**, **SCVP**, **SGDF**, [External Auditor Handbook](./certification/external-auditor-handbook-v1.0.md) |
| [governance/governance-ledger/](../governance/governance-ledger/GLS-1.0.md) | **GLS-1.0** canonical governance ledger |
| [governance/steward-council/](../governance/steward-council/SCC-1.0.md) | **SCC-1.0** steward council charter |
| [federation/](./federation/) | F1–F6 tests + arbitration engine |
| [reproduction-harness/](./reproduction-harness/) | R1-0 independent reproduction |
| [founder-independence-audit/](./founder-independence-audit/) | FIA protocol |
| [evidence-requirements/](./evidence-requirements/) | Evidence schema |
| [evidence-ledger/](./evidence-ledger/) | EL-1.0 artifact index |
| [merkle-spine/](./merkle-spine/) | Cryptographic anchoring |
| [proof-graph/](./proof-graph/) | Proof-graph index, explain engine, counterfactual engine, canonical/derived registry |
| [observability/](./observability/) | **COR-1.0**, **CSR-1.0**, **DRA-1.0**, **DARP-1.0** |
| [cor-suite/](./cor-suite/) | COR Suite JSON Schemas (state vector, proof analysis, governance receipt, maturity, hygiene) |
| [validation/](./validation/) | **CAV-1.0** canonical artifact validator |
| [certification/SGDF-1.0.md](./certification/SGDF-1.0.md) | Steward governance decision framework |
| [provenance-ledger/](./provenance-ledger/) | PL-1.1 historical truth |

## Implementation pointers (this repo)

| Conformance artifact | Code location |
|---------------------|---------------|
| CTS M/G partial | `tests/skillzmcgee/`, `tests/governance*.test.js` |
| MRI partial | `governance/constitution/`, `src/crk1/`, `nova-studio/server/runtime/` |
| Merkle | `governance/merkle.py`, `src/governance/receipts.js` |
| Provenance | `governance/continuity_ledger.py`, `.runtime/nova-studio/ledger.jsonl` |
| Receipts | REC-HDR mapping in `conformance/evidence-requirements/` |

## Regenerate derived artifacts (DARP-1.0)

```bash
npm run spec:rebuild
# or
node tools/crk.mjs regenerate all
node tools/crk.mjs validate canonical
npm run spec:rebuild
node tools/crk.mjs orc evaluate
node tools/crk.mjs rcd evaluate
```

## Public explainers

- [Architecture vs Evidence](../docs/public/architecture-vs-evidence.md)
- [v1.0 Launch Narrative](../docs/public/v1.0-launch-narrative.md)
- [Public FAQ v1.0](../docs/public/faq-v1.0.md)
- [Press Kit](../docs/launch-kit/press-kit-v1.0.md)
- [Architecture Overview](../docs/public/architecture-overview-v1.0.txt)
- [Don't Trust the Repository — Query It](../docs/public/dont-trust-query-it.md)

## Regenerate requirement files

```bash
node tools/generators/requirements-catalog.mjs
```
