# Repository Structure v1.0

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative layout reference  
**Amendment:** [CA-1.0](../specification/constitutional-amendments/CA-1.0-one-artifact-per-stage.md)

Final Version 1.0 repository layout incorporating the One-Artifact-Per-Stage invariant, transformation contracts, and two-plane separation.

```
/
├── specification/                    # Plane 1 — WHAT must be true (frozen)
│   ├── README.md
│   ├── principles.md
│   ├── invariants.md
│   ├── object-model.md
│   ├── contracts.md
│   ├── normative-requirements/
│   │   ├── R001.md … R042.md
│   │   └── catalog.json
│   ├── required-behaviors.md
│   ├── drift-envelopes.md
│   ├── semantics.md
│   ├── constitutional-amendments/
│   │   └── CA-1.0-one-artifact-per-stage.md
│   ├── transformation-contracts/
│   │   ├── template.md
│   │   ├── decision-to-outcome.md
│   │   ├── outcome-to-evidence.md
│   │   ├── evidence-to-interpretation.md
│   │   └── interpretation-to-policy-eval.md
│   └── requirement-graph/
│       └── requirement-dag.md
│
├── conformance/                      # Plane 2 — HOW we prove it (evolving)
│   ├── README.md
│   ├── traceability-matrix.md
│   ├── traceability-matrix.json
│   ├── resolution-map.json
│   ├── CTS-1.0/
│   │   ├── README.md
│   │   ├── tests/                    # (mapped to repo tests/)
│   │   └── reports/
│   ├── MRI-1.0/
│   │   ├── README.md
│   │   └── docs/
│   ├── compliance-profiles/
│   │   ├── C0.md … C6.md
│   ├── certification/
│   │   ├── process.md
│   │   └── criteria.md
│   ├── reproduction-harness/
│   │   └── R1-0.md
│   ├── founder-independence-audit/
│   │   └── FIA.md
│   ├── evidence-requirements/
│   │   └── evidence-schema.md
│   ├── evidence-ledger/
│   │   └── ledger.json               # schema stub / example entries
│   ├── merkle-spine/
│   │   └── spec.md
│   └── provenance-ledger/
│       └── spec.md
│
├── docs/
│   ├── public-diagrams/
│   ├── academic-paper/
│   ├── launch-kit/
│   │   └── website.html
│   ├── interoperability-spec/
│   └── K-infinity-axioms/
│
├── meta/
│   ├── version-history.md
│   ├── governance.md
│   ├── adr-template.md
│   ├── adrs/
│   └── RELEASE_NOTES_v1.0.md
│
├── src/                              # Runtime implementation (preview)
├── governance/                       # Python governance layer
├── nova-studio/                      # Unified IDE shell
├── tests/                            # CTS implementation anchors
└── tools/
    └── generators/
```

## Semantic boundary model

| Layer | Artifact types | Governed by |
|-------|----------------|-------------|
| Constitutional loop | Decision, Outcome, Evidence, Interpretation, Receipt | Transformation contracts + CA-1.0 |
| Provenance | Ledger entries, Merkle roots | PL-1.0, Merkle spine |
| Conformance | Test reports, FIA, certification | R-∞ resolution map |

## Plane separation rules

1. **Nothing normative** in `/conformance/` — only verification artifacts.
2. **Nothing executable** in `/specification/` — only declarations.
3. Every conformance artifact **must resolve** to ≥1 requirement (R-∞).
4. Every transformation **must declare** a contract in `/specification/transformation-contracts/`.

## Related

- [CONTINUITY_OS.md](../CONTINUITY_OS.md) — public overview
- [specification/README.md](../specification/README.md) — Plane 1 index
- [conformance/README.md](../conformance/README.md) — Plane 2 index
