# Constitutional Observability Report (COR-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative conformance artifact  
**Schema:** [schema.json](./schema.json)  
**Invariant:** **PI-1** ([CRK1-R044](../../specification/normative-requirements/R044.md)) — every claim classified

## 1. Purpose

COR-1.0 answers:

- What is **implemented**?
- What is **verified**?
- What is **evidenced**?
- What is **reproduced**?
- What is **missing**?
- What is still **research**?

It is the constitutional equivalent of a health check — **instrumentation**, not narrative.

## 2. Inputs

| Input | Path |
|-------|------|
| Proof-Graph Index | `conformance/proof-graph/index.json` |
| Traceability Matrix | `conformance/traceability-matrix.json` |
| Transformation Records | `conformance/proof-graph/transformation-records/` |
| Evidence Ledger | `conformance/evidence-ledger/ledger.json` |
| Receipts | `.runtime/nova-studio/ledger.jsonl`, REC-HDR artifacts |
| Provenance Ledger | `conformance/provenance-ledger/schema.json` + runtime ledger |
| Reproduction Logs | `conformance/reproduction-harness/` |
| Claim Status Registry | `conformance/observability/CSR-1.0/registry.json` |

## 3. Per-requirement output

```json
{
  "requirement_id": "CRK1-R020",
  "authority_status": "present | missing",
  "specification_status": "present | missing",
  "implementation_status": "complete | partial | missing",
  "verification_status": "complete | partial | missing",
  "evidence_status": "complete | partial | missing",
  "receipt_status": "complete | missing",
  "provenance_status": "anchored | unanchored | missing",
  "reproduction_status": "reproduced | pending | missing",
  "claim_status": "normative | implemented | verified | reproduced | research",
  "exceptions": ["missing evidence", "receipt not anchored"]
}
```

## 4. Constitutional exceptions

COR-1.0 **must** list:

- orphaned requirements, specifications, implementations
- missing evidence, missing receipts
- unanchored receipts, broken provenance chains
- unreproduced claims, unresolved assumptions

**Principle:** Don't trust the repository — query it.

## 5. Maturity model

| Status | Meaning |
|--------|---------|
| **normative** | Required by specification only |
| **implemented** | At least one transformation record / MRI path exists |
| **verified** | CTS/MRI validation + evidence + receipt + anchored provenance |
| **reproduced** | Independently confirmed via R1-0 reproduction harness |
| **research** | Explicitly outside v1.0 guarantees |

No undocumented middle ground (PI-1 / R044).

## 6. Summary block

```json
{
  "orphaned_requirements": 0,
  "orphaned_specs": 0,
  "orphaned_implementations": 0,
  "missing_evidence": 0,
  "missing_receipts": 0,
  "unanchored_receipts": 0,
  "broken_provenance": 0,
  "unreproduced_claims": 0,
  "unresolved_assumptions": 0,
  "proof_closure": "pass | fail"
}
```

## 7. Release gate

Version 1.0 is complete only when COR-1.0 reports:

- [ ] No orphaned constitutional elements
- [ ] All claims have explicit CSR status
- [ ] All **normative** requirements have evidence (or are reclassified)
- [ ] All receipts anchor into provenance
- [ ] All provenance resolves back to authority
- [ ] All missing work visible and classified
- [ ] `proof_closure: pass`

## 8. Generator

See [generator-cli.md](./generator-cli.md) — `crk cor generate`.
