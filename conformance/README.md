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
| [certification/](./certification/) | Certification process |
| [reproduction-harness/](./reproduction-harness/) | R1-0 independent reproduction |
| [founder-independence-audit/](./founder-independence-audit/) | FIA protocol |
| [evidence-requirements/](./evidence-requirements/) | Evidence schema |
| [merkle-spine/](./merkle-spine/) | Cryptographic anchoring |
| [provenance-ledger/](./provenance-ledger/) | PL-1.0 historical truth |

## Implementation pointers (this repo)

| Conformance artifact | Code location |
|---------------------|---------------|
| CTS M/G partial | `tests/skillzmcgee/`, `tests/governance*.test.js` |
| MRI partial | `governance/constitution/`, `src/crk1/`, `nova-studio/server/runtime/` |
| Merkle | `governance/merkle.py`, `src/governance/receipts.js` |
| Provenance | `governance/continuity_ledger.py`, `.runtime/nova-studio/ledger.jsonl` |
| Receipts | REC-HDR mapping in `conformance/evidence-requirements/` |

## Regenerate requirement files

```bash
node tools/generators/requirements-catalog.mjs
```
