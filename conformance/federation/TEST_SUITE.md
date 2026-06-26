# Multi-Runtime Federation Test Suite

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative test catalog  
**Scope:** Cross-runtime continuity verification

Official test suite for verifying that independent Continuity OS runtimes maintain hash-consistent, drift-monotonic, semantically diverse federation.

## Test categories

### F1 — Merkle Root Consistency

Two runtimes must:

- exchange Merkle roots
- validate hash continuity
- detect forks

**Pass:** Roots reconcile or fork is detected and reported within one federation tick.

### F2 — Receipt Exchange

Runtimes must:

- exchange governance receipts (REC-HDR-1.0)
- validate `invariant_block`
- validate `traceability_block`

**Pass:** All exchanged receipts validate against schema and constitutional checks.

### F3 — Provenance Synchronization

Runtimes must:

- exchange ledger entries (PL-1.0)
- detect missing entries
- detect reordering
- detect tampering

**Pass:** Ledgers are identical or divergence is detected with entry-level diff.

### F4 — Semantic Federation

Runtimes must:

- exchange InterpretationObjects
- validate frame diversity (`|frames_used| ≥ 1`, multiplicity when required)
- detect semantic collapse

**Pass:** No dominant-frame collapse; interpretations remain reproducible across runtimes.

### F5 — Drift Reconciliation

Runtimes must:

- exchange drift envelopes (CE/SE)
- ensure monotonicity
- detect regressions

**Pass:** `CEₜ₊₁ ≥ CEₜ` and `SEₜ₊₁ ≥ SEₜ` on both runtimes after reconciliation.

### F6 — Arbitration

Runtimes must:

- detect divergence
- apply arbitration rules (constitutional supremacy K12)
- converge to a unified state

**Pass:** Post-arbitration state is identical on both runtimes.

## Pass condition (federation badge)

A runtime pair passes federation when:

- no undetected forks
- no drift regressions
- no semantic collapse
- no missing receipts
- no provenance inconsistencies
- arbitration converges

## Implementation anchors (this repo)

| Test | Code pointer |
|------|----------------|
| F1–F2 | `nova-studio/server/runtime/federation.mjs`, `/api/federation/*` |
| F3 | `governance/continuity_ledger.py`, `.runtime/nova-studio/ledger.jsonl` |
| F4 | `src/crk1/`, semantic replay hooks |
| F5 | drift envelope specs in `specification/drift-envelopes.md` |
| F6 | `src/federation/` |

## Running (preview)

```bash
npm run nova-studio          # runtime A
npm run test:nova-studio     # partial F2 coverage
npm test                     # governance + federation unit tests
```

Full F1–F6 automation is a C5/C6 conformance target — catalog defined here; CI harness pending.

## Related

- [ARBITRATION_ENGINE.md](./ARBITRATION_ENGINE.md) — formal arbitration specification
- [../CTS-1.0/README.md](../CTS-1.0/README.md)
- [../../specification/constitutional-proof.md](../../specification/constitutional-proof.md)
