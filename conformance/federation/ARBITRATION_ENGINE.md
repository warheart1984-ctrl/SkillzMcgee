# CRK-1 Multi-Runtime Arbitration Engine Specification

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative  
**Scope:** Cross-runtime divergence resolution  
**Related:** [TEST_SUITE.md](./TEST_SUITE.md) · [constitutional-proof.md](../../specification/constitutional-proof.md)

## I. Purpose

The Arbitration Engine ensures that multiple CRK-1-compliant runtimes:

- maintain continuity
- resolve divergence
- preserve provenance
- uphold semantic diversity
- prevent drift regression

When federation detects inconsistency (F1–F6), arbitration produces a unified constitutional state without forking history, collapsing semantics, or hiding governance.

## II. Inputs

Each participating runtime **R** provides a state summary **Σ(R)**:

| Field | Type | Source |
|-------|------|--------|
| Merkle root | `Hash` | Merkle spine |
| Receipt set | `GovernanceReceipt[]` | REC-HDR-1.0 |
| Provenance entries | `ProvenanceEntry[]` | PL-1.0 |
| Drift envelopes | `(CE, SE)` | DriftEnvelopeUpdate chain |
| Interpretations | `InterpretationObject[]` | Semantic layer |
| Lineage nodes | `LineageNode[]` | Lineage graph |

## III. Arbitration triggers

Arbitration **MUST** initiate when any of the following hold between runtimes R₁ and R₂:

| Trigger | Detection |
|---------|-----------|
| Merkle root mismatch | `root(R₁) ≠ root(R₂)` at same ledger height |
| Provenance fork | Two valid chains with divergent `parent_hash` |
| Missing receipts | Receipt in Σ(R₁) absent from Σ(R₂) |
| Drift regression | `CE` or `SE` decreases without constitutional amendment |
| Semantic collapse | `|frames_used| = 1` where multiplicity required |
| Lineage divergence | Incompatible `lineage_hash` for same `provenance_entry_id` |

## IV. Arbitration rules

Rules apply in order; later rules break ties only when earlier rules are inconclusive.

### Rule A — Provenance Supremacy

The **longest valid hash chain** prevails.

```
winner = argmax_R length(valid_chain(R))
```

Invalid entries (hash mismatch, reordering, tampering) are discarded.

### Rule B — Drift Supremacy

When provenance chains are equal length, the runtime with **higher CE/SE** is preferred:

```
prefer R where CE(R) ≥ CE(R') and SE(R) ≥ SE(R')
```

Strict regression on either envelope is a constitutional violation (R041).

### Rule C — Semantic Supremacy

When drift is equal, the runtime with **greater frame diversity** prevails:

```
prefer R where |unique_frames(R)| > |unique_frames(R')|
```

Ties require both interpretation sets to be replay-verified (R021).

### Rule D — Governance Supremacy

Receipts with **valid Merkle anchors** override unanchored claims.

```
anchored(R) > unanchored(R')
```

Constitutional supremacy (K12) overrides local policy when rules conflict.

## V. Arbitration procedure

```
1. Exchange State Summaries     Σ(R₁), Σ(R₂), …
2. Identify Divergence          triggers III
3. Apply Arbitration Rules      A → B → C → D
4. Reconcile Provenance         merge to longest valid chain
5. Reconcile Drift              max(CE), max(SE); reject regressions
6. Reconcile Interpretations    union frames; replay-verify
7. Rebuild Lineage              from reconciled provenance
8. Emit Arbitration Receipt     REC-HDR-1.0 + entry:arbitration
```

Each step produces traceable evidence. Step 8 is transformation **T09-equivalent** for federation scope.

## VI. Outputs

| Output | Description |
|--------|-------------|
| Unified provenance chain | Single append-only PL-1.0 chain |
| Unified drift envelope | `(CE*, SE*)` monotonic |
| Unified interpretation set | Frame-diverse, replayable |
| Arbitration receipt | REC-HDR-1.0 with `arbitration_block` |
| Updated lineage | Rebuilt LineageNode graph |

## VII. Correctness guarantees

If arbitration completes successfully:

| Guarantee | Mechanism |
|-----------|-----------|
| No runtime can fork history | Rule A + hash chaining |
| No runtime can collapse semantics | Rule C + R020 |
| No runtime can hide governance | Rule D + receipt validation |
| No runtime can regress drift | Rule B + R041 |

These extend the global correctness proof in [constitutional-proof.md](../../specification/constitutional-proof.md) to multi-runtime settings.

## VIII. Verification

| Test | Arbitration coverage |
|------|---------------------|
| F1 | Merkle root exchange |
| F2 | Receipt validation |
| F3 | Provenance sync |
| F4 | Semantic federation |
| F5 | Drift reconciliation |
| F6 | Full arbitration convergence |

**Pass:** Post-arbitration `Σ(R₁) ≡ Σ(R₂)` on roots, drift, and provenance tip.

## IX. Implementation pointers (preview)

| Component | Location |
|-----------|----------|
| Federation API | `nova-studio/server/runtime/federation.mjs` |
| Receipt validation | `src/governance/receipts.js` |
| Lineage rebuild | `src/singularity/lineage.js` |
| Merkle | `governance/merkle.py`, `src/singularity/merkle.js` |

Full arbitration automation is a C5/C6 conformance target.

## X. Version

1.0
