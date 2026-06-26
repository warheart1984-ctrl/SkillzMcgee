# Conformance Resolution Map

**Authority:** CRK-1 Conformance v1.0  
**Machine-readable:** [resolution-map.json](./resolution-map.json)

## CTS → Requirements

| CTS Test | Requirements |
|----------|----------------|
| CTS-M1 | R001, R005, R009, R040 |
| CTS-M2 | R002, R006, R018 |
| CTS-M3 | R003, R007 |
| CTS-M4 | R004, R025 |
| CTS-M5 | R008 |
| CTS-S1 | R010, R013–R017 |
| CTS-S2 | R011, R018, R019, R027 |
| CTS-S5 | R012, R036, R037 |
| CTS-E1 | R020, R029 |
| CTS-E2 | R021, R025 |
| CTS-E3 | R022, R026, R028 |
| CTS-G1 | R035, R042 |
| CTS-G2 | R011, R033 |
| CTS-G3 | R030, R034 |
| CTS-G4 | R032, R039 |
| CTS-D1–D3 | R041, R022 |

## MRI → Requirements

| MRI Component | Requirements |
|---------------|----------------|
| MRI-Decision | R001, R014 |
| MRI-Outcome | R002, R005, R015 |
| MRI-Evidence | R003, R006, R016, R018 |
| MRI-Interpretation | R003, R007, R017, R020–R022 |
| MRI-Loop | R009, R019, R040 |
| MRI-Drift | R041 |
| MRI-Receipt | R033, R034, R042 |

## Receipts → Requirements

| Receipt field | Requirements |
|---------------|--------------|
| `invariant_block` | R001–R004, R010–R012, R020–R022, R030–R032 |
| `traceability_block` | R012, R036, R037 |
| `merkle_root` | R030, R034 |
| `evidence_block` | R002, R018 |

## Certification badges → Requirements

| Badge | Scope |
|-------|-------|
| C0 | Declaration only |
| C1 | R010–R017 (structural) |
| C2 | R011, R018, R019, R027 (contracts) |
| C3 | R030, R033, R034, R042 (governance) |
| C4 | R020–R025 (semantic) |
| C5 | R041 (drift) |
| C6 | R001–R042 (full) |
