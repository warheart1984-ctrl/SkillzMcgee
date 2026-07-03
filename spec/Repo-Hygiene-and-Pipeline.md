# Repo Hygiene and COR Pipeline

**Role:** Operational prerequisite (runs before CAV-1.0)
**RFC:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md)
**Schema:** [repo-hygiene-status.schema.json](./repo-hygiene-status.schema.json)

## Identity

The substrate ensuring the repository is always CAR/COR-compatible.

## Normative pipeline order

```
1. Repo hygiene
2. CAV-1.0 validate (CAR-1.0)
3. COR-1.0 / CSR-1.0 / DRA-1.0 measure
4. Proof Analysis
5. Maturity vector
6. Governance (+ receipt → CAR)
7. Communication / dashboards
```

Reference: `project-infi/cor-suite` → `npm run pipeline`

## Requirements

### A. Deterministic artifacts

- No environment-dependent builds affecting CAR hashes
- No nondeterministic outputs in canonical paths
- No hidden state affecting registry integrity

### B. Directory hygiene

- No stale `node_modules` committed
- No stale venvs committed
- No broken `dist/` artifacts tracked
- CAR registry and schemas present at canonical paths

### C. Canonical paths

- All constitutional objects registered in CAR-1.0
- No shadow copies outside the registry
- No ambiguous lineage

### D. Reproducible builds

- Build → verify → reproduce must be identical across machines

### E. CI/CD integration

- CAV-1.0 validation (blocking)
- COR-1.0 generation (from CAR)
- Proof Analysis execution
- Governance gates
- CI gate on CAV + hygiene + critical claims + reject/freeze

## Output

Status report conforming to `repo-hygiene-status.schema.json`.

## Implementation

- **project-infi:** `cor-suite/src/hygiene/`, `.github/workflows/cor-suite.yml`
- **skillzmcgee:** `.gitignore` for build artifacts; `npm run test:v1` for cockpit verification

## Known determinism gap (legacy)

Legacy skillzmcgee COR generation read `.runtime/nova-studio/ledger.jsonl`. The CAR-first pipeline in project-infi does not use this path for canonical measurement.
