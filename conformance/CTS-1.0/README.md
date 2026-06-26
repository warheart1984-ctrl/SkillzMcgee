# CTS-1.0 — Constitutional Test Suite

**Resolves to:** CRK1-R001–R042 via [resolution-map.json](../resolution-map.json)

## Test categories

| Series | Tests | Domain |
|--------|-------|--------|
| M | M1–M5 | Mechanical — consequence loop |
| S | S1–S5 | Structural — schemas, contracts |
| E | E1–E5 | Semantic — multiplicity, replay |
| G | G1–G5 | Governance — receipts, Merkle |
| D | D1–D5 | Drift — CE/SE monotonicity |

## Pass condition

All M-, S-, E-, G-, and D-series tests pass with zero exceptions.

## Repo mapping (partial)

| CTS | Implementation |
|-----|----------------|
| G1/G2 | `tests/skillzmcgee/test_traceability.py` |
| S2/G4 | `tests/governance.test.js`, `tests/invariant_evaluator.test.js` |
| M4/R040 | `tests/nova_studio.test.js` |

## Reports

Place CTS run reports in `reports/`.
