# Operational Readiness Checklist (ORC-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — pre-release steward checklist  
**Related:** [RCD-1.0](./RCD-1.0.md), [SCVP-1.0](./SCVP-1.0.md), [SGDF-1.0](./SGDF-1.0.md)

## Purpose

A pre-release checklist used by stewards to confirm the repository is ready for **governance evaluation** (not release approval — that is SCVP-1.0).

## Automated evaluation

```bash
node tools/crk.mjs orc evaluate [--out meta/ORC-1.0.json]
npm run spec:orc
```

Produces machine-readable pass/fail/pending/manual per item.

---

## A. Canonical Integrity

| ID | Item | Auto |
|----|------|------|
| A1 | All canonical artifacts present (Authorities, Specs, Requirements, Contracts, Implementations, Transformation Records, Evidence, Receipts, Provenance) | partial |
| A2 | Canonical Artifact Validator (CAV-1.0) passes | yes |
| A3 | No dangling references | yes |
| A4 | No circular authority chains | manual |
| A5 | All timestamps monotonic | manual |
| A6 | All canonical schemas validated | partial |

## B. Derived Artifact Regeneration

| ID | Item | Auto |
|----|------|------|
| B1 | Proof-Graph Index regenerated | yes |
| B2 | CSR-1.0 regenerated | yes |
| B3 | COR-1.0 regenerated | yes |
| B4 | Coverage Reports regenerated | partial |
| B5 | Release Manifest regenerated | partial |
| B6 | Dashboards regenerated | manual |
| B7 | No derived artifact manually edited | partial |

## C. Observability Completeness

| ID | Item | Auto |
|----|------|------|
| C1 | COR-1.0 includes all requirements | yes |
| C2 | CSR-1.0 classifies all claims | yes |
| C3 | Dependency-Risk Analyzer (DRA-1.0) executed | yes |
| C4 | Explain-This-Node engine functional | yes |
| C5 | Counterfactual engine functional | yes |

## D. Proof-Graph Closure Conditions

| ID | Item | Auto |
|----|------|------|
| D1 | No orphaned requirements | yes |
| D2 | No orphaned specifications | yes |
| D3 | No orphaned implementations | yes |
| D4 | All receipts anchored in provenance | yes |
| D5 | All provenance chains intact | yes |
| D6 | All normative requirements ≥ Implemented | yes |
| D7 | All critical requirements ≥ Verified | yes |

## E. Reproduction

| ID | Item | Auto |
|----|------|------|
| E1 | All Verified claims have at least one reproduction | yes |
| E2 | All reproduction logs present and valid | manual |

## F. Governance Inputs Prepared

| ID | Item | Auto |
|----|------|------|
| F1 | COR-1.0 delivered to Steward Council | manual |
| F2 | CSR-1.0 delivered | manual |
| F3 | DRA-1.0 delivered | manual |
| F4 | Release Manifest delivered | manual |
| F5 | No PASS/FAIL assertions in derived artifacts (measurement only) | yes |

---

## Readiness gate

ORC **ready for governance evaluation** when:

- All **auto** items in sections A–E are `pass` or explicitly waived with steward record
- Section F completed by observability team before SCVP-1.0 vote

ORC does **not** imply release approval. See [SCVP-1.0](./SCVP-1.0.md).
