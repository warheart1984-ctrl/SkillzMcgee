# Continuity OS v0.1 — Public FAQ (Extended)

**Authority:** CRK-1 Specification v1.0  
**Status:** Public-facing  
**Audience:** Website visitors, auditors, prospective stewards

---

## What is Continuity OS?

Continuity OS is a **constitutional runtime** designed for governed, traceable, and reproducible intelligent systems. It enforces a twelve-stage loop where every action produces evidence, receipts, and provenance.

---

## Does Continuity OS replace AI models?

**No.**

Continuity OS is **infrastructure**, not an application. It provides the governed execution, evidence, provenance, and accountability layer that intelligent systems build upon. Models still reason; Continuity OS ensures that reasoning is consequence-bound and auditable.

---

## What problems does Continuity OS solve?

It prevents:

- **hidden state** — all state transitions are explicit (R008)
- **silent failures** — refusal receipts on invariant breach
- **semantic collapse** — multi-frame interpretation (R020)
- **governance bypass** — every action produces a receipt (R042)
- **provenance rewriting** — append-only ledger (R030)
- **founder dependence** — reproduction harness and FIA (R031)

---

## How does Continuity OS ensure traceability?

Every action passes through the [12-stage constitutional loop](../../specification/constitutional-loop-v1.0.md), producing:

- evidence
- interpretations
- governance receipts
- provenance entries
- drift updates

Nothing is lost. Nothing is hidden. See [CA-1.0](../../specification/constitutional-amendments/CA-1.0-one-artifact-per-stage.md).

---

## What is the CRK-1 kernel?

CRK-1 is the constitutional core of Continuity OS. It defines:

- invariants (K0–K12)
- constitutional contracts
- object model (COM-1.0 + governance extensions)
- drift envelopes (CE/SE)
- formal semantics
- twelve transformation contracts

See [specification/README.md](../../specification/README.md).

---

## What is the “one artifact per stage” rule?

Each stage of the constitutional loop:

- accepts exactly **one** semantic artifact
- produces exactly **one** new artifact
- records evidence
- updates provenance

This ensures linear, unbroken continuity. Formalized in [CA-1.0](../../specification/constitutional-amendments/CA-1.0-one-artifact-per-stage.md).

---

## Is Continuity OS open source?

**Yes.**

Version 1.0 is open, reproducible, and auditable under MIT license. The specification plane is frozen; the conformance plane evolves with engineering while resolving to requirements (R-∞).

---

## How do I verify a Continuity OS implementation?

Use the conformance ecosystem:

| Tool | Purpose |
|------|---------|
| [CTS-1.0](../../conformance/CTS-1.0/README.md) | Constitutional test suite |
| [MRI-1.0](../../conformance/MRI-1.0/README.md) | Reference implementation map |
| [R1-0](../../conformance/reproduction-harness/R1-0.md) | Independent reproduction harness |
| Provenance ledger | PL-1.0 hash-chain validation |
| Drift envelope inspector | CE/SE monotonicity checks |

```bash
npm test
npm run test:nova-studio
```

---

## Can multiple runtimes interoperate?

**Yes.**

Continuity OS includes a federation protocol for cross-runtime continuity:

- receipt exchange
- provenance synchronization
- semantic federation
- drift reconciliation
- [arbitration engine](../../conformance/federation/ARBITRATION_ENGINE.md)

See [federation test suite](../../conformance/federation/TEST_SUITE.md).

---

## Who maintains Continuity OS?

**Stewards** — individuals who uphold the constitutional specification and maintain continuity across versions. Stewards are certified via the [steward exam](../../conformance/certification/steward-exam.md) and take the [Version 1.0 Steward Oath](../../meta/steward-oath.md).

---

## Is Continuity OS an agent?

No — it is governed **substrate** for agents and intelligent applications.

---

## Does it restrict model capabilities?

No — it restricts **unaccountable** capabilities. Models can still be powerful; they cannot act without traceable consequences.

---

## Quick links

- [CONTINUITY_OS.md](../../CONTINUITY_OS.md)
- [Whitepaper](../whitepaper/CONTINUITY_OS_v0.1_WHITEPAPER.md)
- [Animation script](./constitutional-loop-animation-script.md)
- [Traceability matrix](../../conformance/traceability-matrix.md)
