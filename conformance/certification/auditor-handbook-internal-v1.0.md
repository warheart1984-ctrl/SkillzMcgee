# Auditor Handbook (Internal Edition) — v1.0

Technical guide for independent verification of Continuity OS / CRK-1 constitutional state.

## Responsibilities

Auditors must independently:

1. Regenerate COR-1.0, CSR-1.0, DRA-1.0
2. Rebuild the proof graph
3. Validate governance ledger signatures and continuity (GL-1.0 / GLS-1.0)
4. Verify receipt lineage and continuity substrate
5. Run counterfactual scenarios (CAV-1.0)
6. Check drift thresholds and nondeterminism where runtime evidence exists

## Tools

| Tool | Purpose |
|------|---------|
| `npm run audit -- cor generate` | Fresh COR-1.0 |
| `npm run audit -- cor diff <old> <new>` | Compare COR versions |
| `npm run audit -- cor explain <claim>` | Explain claim status |
| `npm run audit -- csr generate` | Rebuild CSR-1.0 |
| `npm run audit -- dra analyze` | Dependency-risk analysis |
| `npm run audit -- cav run <node>` | Counterfactual |
| `npm run audit -- ledger verify` | GLV-1.0 governance ledger |
| `npm run audit -- continuity replay` | Continuity substrate replay |
| `npm run audit -- proof build` | Proof graph |
| `npm run audit -- pgql 'SELECT claims WHERE evidence = missing'` | PGQL queries |
| `npm run crk` | Legacy CRK dispatcher (ORC, RCD, GLS) |

Nova Studio modes: `/nova/studio/audit`, `/nova/studio/steward`, `/nova/studio/proof-graph`

## Workflow

### Step 1 — Canonical integrity

```bash
npm run audit -- proof build
npm run crk validate canonical
```

### Step 2 — Derived layer

```bash
npm run spec:cor
npm run spec:csr
npm run spec:dra
```

Artifacts:

- `conformance/cor/cor-1.0.json`
- `conformance/csr/csr-1.0.json`
- `conformance/dra/dra-1.0.json`
- `conformance/proof-graph/graph.json`

### Step 3 — Governance ledger

```bash
npm run audit -- ledger verify
```

Ledger: `governance/ledger/ledger.jsonl` (GL-1.0). Legacy: `governance/governance-ledger/ledger.jsonl` (GLS-1.0).

### Step 4 — Counterfactuals

```bash
npm run audit -- cav run IMP-42
npm run crk counterfactual remove NODE CRK1-R012
```

### Step 5 — Certification gate

Release may be certified only when:

- Regenerated COR matches published COR (or differences explained)
- CSR has no unclassified claims
- DRA risk is acceptable per steward policy
- GLV reports OK
- Continuity chain is monotonic
- No auditor red flags remain

## Red flags

- Missing receipts or broken lineage
- Non-monotonic continuity checkpoints
- Unverifiable governance signatures
- Contradictory claim statuses in CSR
- `proof_closure: fail` in COR without documented deferral
- Drift anomalies above CRK-2 thresholds

## Evidence paths

See `conformance/proof-graph/canonical-derived-registry.json` for canonical vs derived mapping.

Public companion: `conformance/certification/external-auditor-handbook-v1.0.md`
