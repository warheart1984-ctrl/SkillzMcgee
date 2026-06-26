# Founder-Independence Audit (FIA)

**Resolves to:** CRK1-R031, R038

## Audit domains

| Domain | Checks |
|--------|--------|
| Documentation | No implicit assumptions; V1 vocabulary only |
| Code | No hidden constants; deterministic logic |
| Semantics | No privileged frames; replayable |
| Governance | No bypass paths; anchored receipts |
| Provenance | No gaps; hash-stable history |

## Procedure

1. Independent reconstruction from `/specification/` only
2. CTS-1.0 execution
3. Semantic replay (SRE-1.0)
4. Merkle verification
5. Provenance verification
6. Drift verification

## Pass condition

Auditor reconstructs runtime, passes CTS, matches receipts/spine/semantics **without founder input**.
