# Auditor Report Template (v1.0)

**Auditor:** _organization / name_  
**Audit date:** _ISO 8601_  
**Canonical commit:** _`git rev-parse HEAD`_  
**Scope:** Continuity OS CRK-1 v1.0 conformance audit

## Executive summary

_One paragraph: pass / fail / conditional with primary gaps._

## A. Canonical integrity

| Check | Result | Notes |
|-------|--------|-------|
| CAV-1.0 | | |
| Catalog complete | | |
| Contracts T01–T12 | | |

## B. Derived reproducibility

| Artifact | Regenerated | Matches | Notes |
|----------|-------------|---------|-------|
| Proof graph | | | |
| CSR-1.0 | | | |
| COR-1.0 | | | |
| DRA-1.0 | | | |

## C. Proof closure (RCD-1.0)

_Attach `meta/RCD-1.0.json` output._

## D. Evidence spot checks

| Requirement | Verified? | Evidence | Receipt | Provenance | Reproduction |
|-------------|-----------|----------|---------|------------|--------------|
| | | | | | |

## E. Governance separation

- [ ] COR contains measurements only
- [ ] GLS ledger valid (`crk gls validate`)
- [ ] Steward decisions reference pinned commit

## F. Founder-independence

_Describe reconstruction without founder input._

## Deliverables attached

- [ ] Reproduction logs
- [ ] RCD evaluation JSON
- [ ] GLS audit_result entry draft

## Auditor signature

_Name, date, contact_
