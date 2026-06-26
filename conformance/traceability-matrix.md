# CRK-1 Requirement → Test → Evidence Traceability Matrix

**Authority:** CRK-1 Specification v1.0  
**Status:** Master audit artifact (R-∞ proof spine)  
**Machine-readable:** [traceability-matrix.json](./traceability-matrix.json)

This matrix links every normative requirement to:

- **CTS tests** that verify it
- **MRI behaviors** that implement it
- **Evidence artifacts** that prove it
- **Receipts** and **provenance entries** that record it

## Traceability chain (canonical)

`Requirement → ADR → Implementation → CTS → Evidence → Receipt → Provenance`

## Repository tests (implementation anchors)

| Test path | Requirements |
|-----------|----------------|
| `tests/skillzmcgee/test_traceability.py` | CRK1-R012, CRK1-R036, CRK1-R037 |
| `tests/skillzmcgee/test_dependencies.py` | CRK1-R011, CRK1-R032 |
| `tests/skillzmcgee/test_fitness.py` | CRK1-R042, CRK1-R002 |
| `tests/governance.test.js` | CRK1-R011, CRK1-R042 |
| `tests/nova_studio.test.js` | CRK1-R004, CRK1-R040, CRK1-R042 |
| `tests/invariant_evaluator.test.js` | CRK1-R011, CRK1-R032 |

## A1. Mechanical Requirements (R001–R009)

| Requirement | CTS Tests | MRI Component | Evidence | Receipts | Provenance |
|-------------|-----------|---------------|----------|----------|------------|
| **CRK1-R001** — Consequence Continuity | CTS-M1 | decision→outcome | OutcomeObject | invariant_block | entry:decision/outcome |
| **CRK1-R002** — Evidence Completeness | CTS-M2 | outcome→evidence | EvidenceObject | evidence_block | entry:evidence |
| **CRK1-R003** — Interpretive Exposure | CTS-M3 | evidence→interpretation | InterpretationObject | traceability_block | entry:interpretation |
| **CRK1-R004** — Replayability | CTS-M4 | replay engine | Replay logs | N/A | entry:replay |
| **CRK1-R005** — No Dropped Outcomes | CTS-M1 | MRI-Outcome | OutcomeObject chain, receipt | invariant_block | entry:governance |
| **CRK1-R006** — No Suppressed Evidence | CTS-M2 | MRI-Evidence | EvidenceObject, audit log | invariant_block | entry:governance |
| **CRK1-R007** — No Blocked Interpretation | CTS-M3 | MRI-Interpretation | InterpretationObject, frame log | invariant_block | entry:governance |
| **CRK1-R008** — No Hidden State | CTS-M5 | MRI-Loop | State dump, replay diff | invariant_block | entry:governance |
| **CRK1-R009** — Consequence Loop Totality | CTS-M1 | MRI-Loop | Loop trace, receipts | invariant_block | entry:governance |

## A2. Structural Requirements (R010–R019)

| Requirement | CTS Tests | MRI Component | Evidence | Receipts | Provenance |
|-------------|-----------|---------------|----------|----------|------------|
| **CRK1-R010** — Structural Transparency | CTS-S1, CTS-S3 | object schemas | Object dumps | invariant_block | entry:object |
| **CRK1-R011** — Contractual Binding | CTS-S2, CTS-G2 | contract enforcement | Contract logs | invariant_block | entry:contract |
| **CRK1-R012** — Traceability Preservation | CTS-S5 | traceability builder | TraceabilityBlock | traceability_block | entry:trace |
| **CRK1-R013** — IdentityObject Schema | CTS-S1 | object schemas | IdentityObject instance | invariant_block | entry:governance |
| **CRK1-R014** — DecisionObject Schema | CTS-S1 | MRI-Decision | DecisionObject instance | invariant_block | entry:governance |
| **CRK1-R015** — OutcomeObject Schema | CTS-S1 | MRI-Outcome | OutcomeObject instance | invariant_block | entry:governance |
| **CRK1-R016** — EvidenceObject Schema | CTS-S1 | MRI-Evidence | EvidenceObject instance | invariant_block | entry:governance |
| **CRK1-R017** — InterpretationObject Schema | CTS-S1 | MRI-Interpretation | InterpretationObject instance | invariant_block | entry:governance |
| **CRK1-R018** — EvidenceContract Enforcement | CTS-M2, CTS-S2 | MRI-Evidence | Contract check receipt | invariant_block | entry:governance |
| **CRK1-R019** — RuntimeContract Enforcement | CTS-S2 | MRI-Loop | Loop validation receipt | invariant_block | entry:governance |

## A3. Semantic Requirements (R020–R029)

| Requirement | CTS Tests | MRI Component | Evidence | Receipts | Provenance |
|-------------|-----------|---------------|----------|----------|------------|
| **CRK1-R020** — Semantic Multiplicity | CTS-E1 | frame set | Frame list | invariant_block | entry:frames |
| **CRK1-R021** — Semantic Reproducibility | CTS-E2 | SRE | Replay logs | N/A | entry:replay |
| **CRK1-R022** — Semantic Drift Visibility | CTS-E3, CTS-D3 | drift calculator | Drift deltas | drift_update | entry:drift |
| **CRK1-R023** — No Dominant Frame | CTS-E4 | SRE | Frame diversity metrics | invariant_block | entry:governance |
| **CRK1-R024** — No Unfalsifiable Interpretations | CTS-E5 | SRE | Falsification test log | invariant_block | entry:governance |
| **CRK1-R025** — Semantic Replay Determinism | CTS-M4, CTS-E2 | SRE | Dual replay comparison | invariant_block | entry:governance |
| **CRK1-R026** — Frame Evolution Auditability | CTS-E3 | SRE | Frame evolution log | invariant_block | entry:governance |
| **CRK1-R027** — SemanticContract Enforcement | CTS-S2 | SRE | Semantic contract receipt | invariant_block | entry:governance |
| **CRK1-R028** — Semantic Drift Auditor | CTS-E3 | SRE | Drift audit report | invariant_block | entry:governance |
| **CRK1-R029** — Interpretive Lineage Tree | CTS-E1 | SRE | Lineage tree export | invariant_block | entry:governance |

## A4. Historical Requirements (R030–R039)

| Requirement | CTS Tests | MRI Component | Evidence | Receipts | Provenance |
|-------------|-----------|---------------|----------|----------|------------|
| **CRK1-R030** — Provenance Immutability | CTS-G3 | ledger | Ledger hashes | merkle_root | entry:hash |
| **CRK1-R031** — Founder Independence | — | MRI, SRE | FIA report | N/A | entry:audit |
| **CRK1-R032** — Constitutional Supremacy | CTS-G4 | all | All | invariant_block | entry:all |
| **CRK1-R033** — Governance Receipt Header Compliance | CTS-G2 | MRI-Receipt | Receipt JSON, schema validation | invariant_block | entry:governance |
| **CRK1-R034** — Merkle Spine Anchoring | CTS-G3 | MRI-Receipt | merkle_root field, spine proof | invariant_block | entry:governance |
| **CRK1-R035** — Receipt-Anchored Provenance | CTS-G1 | ledger | receipt_ref in ledger entry | invariant_block | entry:governance |
| **CRK1-R036** — Requirement-to-ADR Traceability | CTS-S5 | ledger | traceability_block.requirement, adr | invariant_block | entry:governance |
| **CRK1-R037** — Implementation-to-CTS Traceability | CTS-S5 | ledger | traceability_block.implementation, cts | invariant_block | entry:governance |
| **CRK1-R038** — Documentation Completeness | — | ledger | FIA audit report | invariant_block | entry:governance |
| **CRK1-R039** — Governance Bypass Prohibition | CTS-G4 | ledger | GEL audit log | invariant_block | entry:governance |
| **CRK1-R043** — Transformation Provenance Completeness | — | ledger | PL-1.1 ProvenanceEntry with full binding fields | invariant_block | entry:governance |

## A5. Behavioral Requirements (R040–R042)

| Requirement | CTS Tests | MRI Component | Evidence | Receipts | Provenance |
|-------------|-----------|---------------|----------|----------|------------|
| **CRK1-R040** — Constitutional Loop Completeness | CTS-M1 | loop engine | All objects | invariant_block | entry:loop |
| **CRK1-R041** — Drift Monotonicity | CTS-D1, CTS-D2, CTS-D3 | drift engine | Drift deltas | drift_update | entry:drift |
| **CRK1-R042** — Governance Visibility | CTS-G1 | GEL-1 | Receipts | receipt | entry:receipt |

## Regenerate

```bash
node tools/generators/traceability-matrix.mjs
```
