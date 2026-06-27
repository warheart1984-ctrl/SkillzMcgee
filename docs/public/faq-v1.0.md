# Continuity OS v1.0 — Public FAQ

**Audience:** Website visitors, press, auditors, prospective stewards
**Related:** [Expanded FAQ (v1.0)](./public-faq-expanded-v1.0.md) · [Architecture vs Evidence](./architecture-vs-evidence.md) · [Launch Narrative](./v1.0-launch-narrative.md) · [Extended FAQ](../launch-kit/FAQ.md)

---

## What is Continuity OS?

Continuity OS is a **constitutional runtime** for governed, inspectable, multi-model intelligence. It makes every transformation explainable, auditable, and backed by evidence.

It is infrastructure — not a single AI model. Models reason; Continuity OS ensures reasoning is consequence-bound, recorded, and verifiable.

---

## What makes Version 1.0 different?

Version 1.0 is the first release where:

- the constitutional architecture is **stable**,
- the proof graph is **complete**,
- every claim has a **maturity status** (CSR-1.0),
- the system is **self-auditing** (COR, DRA, query API),
- and all evidence is **publicly inspectable**.

v1.0 ships specification and measurement openly. Operational release approval is a **governance decision** recorded in the Governance Ledger — not an assertion in marketing copy.

---

## What does “constitutional runtime” mean?

It means the system operates under:

- explicit **authorities**,
- **transformation specifications** (T01–T12),
- **normative requirements** (CRK1-R001–R043),
- and **governed execution rules**.

Every transformation is authorized, specified, implemented, executed, and recorded.

---

## What is COR-1.0?

The **Constitutional Observability Report**. It measures the current constitutional state:

- what is implemented,
- what is verified,
- what evidence exists,
- what assumptions remain unresolved,
- what proof paths are incomplete.

COR-1.0 **does not** make governance decisions. It reports measured state. Stewards decide whether that state is acceptable.

```bash
node tools/crk.mjs query requirements --incomplete
cat meta/COR-1.0.json
```

---

## What is CSR-1.0?

The **Claim Status Registry**. It classifies every constitutional claim as:

| Status | Meaning |
|--------|---------|
| Normative | Required by spec |
| Implemented | Demonstrated by runtime |
| Verified | Validated by conformance |
| Reproduced | Independently confirmed |
| Research | Outside v1.0 guarantee |

There is **no undocumented middle ground**.

---

## What is the Proof Graph?

A complete, navigable graph showing:

- why every artifact exists,
- what authorizes it,
- what depends on it,
- what evidence supports it,
- and how it fits into the constitutional system.

```bash
node tools/crk.mjs explain NODE CRK1-R012
```

Index: `conformance/proof-graph/index.json`

---

## What is DRA-1.0?

The **Dependency-Risk Analyzer**. It identifies which missing or incomplete artifacts create the largest downstream impact on proof closure — a prioritization engine for engineering and governance, not a release decision.

```bash
node tools/crk.mjs dra top-blockers
```

---

## How do I verify claims myself?

You can:

- query the proof graph (`crk explain`, `crk query`),
- inspect evidence (`conformance/evidence-ledger/`),
- review receipts (runtime ledger),
- check provenance (`conformance/provenance-ledger/`),
- run reproduction tests (R1-0 harness),
- and regenerate COR from canonical state (`npm run spec:rebuild`).

Everything is open. See the [External Auditor Handbook](../conformance/certification/external-auditor-handbook-v1.0.md).

---

## What does “Don’t trust the repository — query it” mean?

Continuity OS doesn't ask for trust. It exposes evidence.

Every claim is inspectable.
Every guarantee is measurable.
Every result is reproducible.

[Full explainer →](./dont-trust-query-it.md)

---

## Is Version 1.0 complete?

Version 1.0 is **operationally complete** when:

- canonical artifacts are valid (CAV-1.0 passes),
- the proof graph is closed (`proof_closure: pass`),
- COR-1.0 shows no critical gaps per [RCD-1.0](../conformance/certification/RCD-1.0.md),
- and the Steward Council **approves** the release (GLS entry).

The repository does **not** assert completeness — it **demonstrates** it. Current measured state may report gaps honestly (e.g. unanchored receipts) until closed.

```bash
node tools/crk.mjs rcd evaluate
node tools/crk.mjs gls list
```

---

## Does Continuity OS replace AI models?

**No.** It provides the governed execution, evidence, provenance, and accountability layer that intelligent systems build upon.

---

## Is it open source?

Yes. Specification, conformance tooling, and measurement reports are in the public repository. Governance decisions are recorded in an append-only ledger.

---

## Who governs releases?

The **Steward Council** ([SCC-1.0](../governance/steward-council/SCC-1.0.md)) evaluates measured state against release criteria and votes per [SCVP-1.0](../conformance/certification/SCVP-1.0.md). Decisions are immutable records in the [Governance Ledger](../governance/governance-ledger/GLS-1.0.md).

---

## How do I become a steward?

See [Steward Onboarding Guide](../governance/steward-council/steward-onboarding-v1.0.md), complete the curriculum and exam, and take the steward oath.

---

## More questions?

- [Extended FAQ (technical)](../launch-kit/FAQ.md)
- [Press kit](../launch-kit/press-kit-v1.0.md)
- [Architecture overview](./architecture-overview-v1.0.txt)
