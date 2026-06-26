# Steward Council Onboarding Guide (v1.0)

**Authority:** SCC-1.0  
**Audience:** New and prospective stewards  
**Related:** [SCC-1.0](./SCC-1.0.md), [steward-curriculum.md](../../conformance/certification/steward-curriculum.md), [steward-exam.md](../../conformance/certification/steward-exam.md), [steward-oath.md](../../meta/steward-oath.md)

---

## 1. Purpose of the Steward Council

The Steward Council governs the constitutional evolution of Continuity OS.  
It does **not** measure evidence — it **evaluates** evidence.

Stewards ensure:

- constitutional integrity,
- founder-independence,
- evidence-driven releases,
- and transparent governance.

---

## 2. What stewards govern

Stewards have authority over:

| Domain | `decision_type` (GLS) |
|--------|------------------------|
| Release approvals | `release_vote` |
| Specification authorization | `spec_authorization` |
| Governance policy updates | `policy_update` |
| Steward appointments | `role_assignment` |

Stewards do **not**:

- modify canonical artifacts directly,
- override COR-1.0 or CSR-1.0,
- assert PASS/FAIL independent of evidence.

---

## 3. What stewards must understand

### A. Canonical layer

| Artifact | Location |
|----------|----------|
| Authorities | Steward Council decisions, CA-1.0/1.1 |
| Specifications | T01–T12 transformation specs |
| Normative requirements | `specification/normative-requirements/` |
| Contracts | `specification/transformation-contracts/` |
| Implementations | MRI, governance, runtime |
| Evidence, receipts, provenance | conformance + runtime ledgers |

**Governance Ledger** (`governance/governance-ledger/`) is canonical — it records **decisions**, not measurements.

### B. Derived layer

| Instrument | Path |
|------------|------|
| Proof-Graph Index | `conformance/proof-graph/index.json` |
| CSR-1.0 | `conformance/observability/CSR-1.0/` |
| COR-1.0 | `meta/COR-1.0.json` |
| DRA-1.0 | `meta/DRA-1.0.json` |
| Counterfactual engine | `crk counterfactual` |

Regenerate via `npm run spec:rebuild` (DARP-1.0). Never hand-edit derived files.

### C. Governance layer

| Document | Purpose |
|----------|---------|
| [SCC-1.0](./SCC-1.0.md) | Council charter |
| [GLS-1.0](../governance-ledger/GLS-1.0.md) | Decision ledger |
| [RCD-1.0](../../conformance/certification/RCD-1.0.md) | Release criteria |
| [SCVP-1.0](../../conformance/certification/SCVP-1.0.md) | Voting protocol |
| [ORC-1.0](../../conformance/certification/ORC-1.0.md) | Pre-vote readiness |

---

## 4. Steward responsibilities

Stewards must:

- review COR-1.0, CSR-1.0, DRA-1.0, CAV-1.0 before any release vote
- evaluate release readiness against [RCD-1.0](../../conformance/certification/RCD-1.0.md)
- ensure no governance decision contradicts canonical evidence
- record decisions in the [Governance Ledger](../governance-ledger/ledger.jsonl)
- maintain independence from implementation teams

---

## 5. Governance workflow

```
1. Observability delivers COR, CSR, DRA (+ ORC evaluation)
2. Stewards receive materials (no interpretation in presentation)
3. Stewards request explain / counterfactual / DRA queries as needed
4. Compare measured state to RCD-1.0
5. Deliberate (SCVP-1.0)
6. Vote: approve | reject | defer (⅔ supermajority to approve)
7. Record in Governance Ledger:

   node tools/crk.mjs gls append --file <entry.json>
   node tools/crk.mjs gls validate
```

---

## 6. Steward ethics

Stewards must:

- prioritize **evidence over narrative**
- avoid conflicts of interest (recuse when implementing the vote subject)
- maintain transparency (all votes and rationale in GLS)
- uphold founder-independence ([FIA](../../conformance/founder-independence-audit/FIA.md))
- ensure decisions are reproducible from `inputs.canonical_commit`

---

## 7. Onboarding checklist

- [ ] Read SCC-1.0 and [stewardship charter](../../meta/stewardship-charter.md)
- [ ] Complete [steward curriculum](../../conformance/certification/steward-curriculum.md)
- [ ] Pass [steward exam](../../conformance/certification/steward-exam.md)
- [ ] Take [steward oath](../../meta/steward-oath.md)
- [ ] Run `npm run spec:rebuild` and review COR/CSR/DRA locally
- [ ] Practice `crk explain`, `crk counterfactual`, `crk dra what-unblocks`
- [ ] Review existing [governance ledger](../governance-ledger/ledger.jsonl) entries
- [ ] Attend first council session as observer (if applicable)

---

## 8. Quick reference commands

```bash
npm run spec:rebuild
node tools/crk.mjs orc evaluate
node tools/crk.mjs rcd evaluate
node tools/crk.mjs validate canonical
node tools/crk.mjs dra top-blockers
node tools/crk.mjs gls list
```
