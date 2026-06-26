# External Auditor Handbook (Version 1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — independent verification guide  
**Related:** [FIA](../founder-independence-audit/FIA.md), [RCD-1.0](./RCD-1.0.md), [ORC-1.0](./ORC-1.0.md), [GLS-1.0](../../governance/governance-ledger/GLS-1.0.md)

## 1. Purpose

Enable external auditors to independently verify:

- constitutional completeness
- proof-graph closure
- evidence integrity
- reproduction
- governance separation
- founder-independence

## 2. What auditors must verify

### A. Canonical integrity

| Check | Tool |
|-------|------|
| All canonical artifacts present | [CAV-1.0](../validation/CAV-1.0/spec.md) + ORC A1 |
| CAV-1.0 passes | `crk validate canonical --fail-on-error` |
| No dangling references | CAV output |
| No circular authority chains | Manual + proof-graph review |
| All schemas valid | CAV + catalog review |

### B. Derived artifact reproducibility

Auditors **must** regenerate and diff:

```bash
git checkout <canonical_commit>
npm run spec:rebuild
```

| Artifact | Path |
|----------|------|
| Proof-Graph Index | `conformance/proof-graph/index.json` |
| CSR-1.0 | `conformance/observability/CSR-1.0/registry.json` |
| COR-1.0 | `meta/COR-1.0.json` |
| DRA-1.0 | `meta/DRA-1.0.json` |
| Release Manifest | `meta/RELEASE_MANIFEST_v1.0.md` (structure) |

Confirm: no manual edits; outputs match repository state at commit (timestamps/commit hash may differ).

### C. Proof-graph closure

Verify against [RCD-1.0](./RCD-1.0.md):

```bash
node tools/crk.mjs rcd evaluate
```

- no orphaned requirements / specs / implementations
- all receipts anchored (`summary.unanchored_receipts === 0`)
- provenance chains intact
- normative requirements ≥ Implemented
- critical requirements ≥ Verified

### D. Evidence integrity

For each **Verified** claim in CSR-1.0, confirm in COR-1.0:

- `evidence_status: complete`
- `receipt_status: complete`
- `provenance_status: anchored`
- `reproduction_status: complete` (or documented exception)

### E. Claim status validation

CSR-1.0 must:

- classify every requirement in catalog
- match canonical evidence (no aspirational Verified)
- document all `research` claims in release manifest

```bash
node tools/crk.mjs query requirements --verified
node tools/crk.mjs query requirements --incomplete
```

### F. Observability layer validation

| Engine | Command |
|--------|---------|
| Explain-This-Node | `crk explain NODE CRK1-R012` |
| Counterfactual | `crk counterfactual remove NODE CRK1-R012` |
| Dependency-Risk | `crk dra top-blockers` |

### G. Governance separation

Auditors must confirm:

- COR-1.0 reports **measured** state only (e.g. `proof_closure: fail` is valid)
- Release Manifest contains no authoritative PASS/FAIL assertions
- Governance Ledger contains **decisions**, not measurements ([GLS-1.0](../../governance/governance-ledger/GLS-1.0.md))

```bash
node tools/crk.mjs gls validate
```

## 3. Auditor tools

| Tool | Use |
|------|-----|
| DARP-1.0 | `npm run spec:rebuild` |
| Query API | `crk query requirements`, `crk query coverage` |
| ORC / RCD | `crk orc evaluate`, `crk rcd evaluate` |
| Counterfactual | Impact analysis before accepting steward rationale |
| Proof graph | `conformance/proof-graph/index.json` |

## 4. Auditor deliverables

| Deliverable | Format |
|-------------|--------|
| Auditor Report | Markdown + evidence hashes |
| Reproduction Logs | R1-0 harness output |
| Proof-Closure Confirmation | RCD evaluate JSON |
| Governance Ledger Entry | `decision_type: audit_result` in GLS |

Template: [auditor-report-template.md](./auditor-report-template.md)

## 5. Independence requirements

Auditors must:

- use only canonical artifacts and public generators
- regenerate all derived artifacts at pinned commit
- verify evidence independently
- avoid relying on founder knowledge

This is the operational expression of [founder-independence](../founder-independence-audit/FIA.md).

## 6. Recommended audit sequence

```
1. Pin canonical_commit
2. CAV validate canonical
3. DARP regenerate all
4. RCD + ORC evaluate
5. Spot-check Verified claims (evidence/receipt/provenance)
6. Test explain / counterfactual / DRA
7. GLS validate + review steward decisions
8. Publish audit_result entry
```
