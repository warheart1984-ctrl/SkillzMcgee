# Architecture vs Evidence

Continuity OS Version 1.0 is built on a simple principle:

**Architecture describes what the system must guarantee.**  
**Evidence demonstrates what the system actually guarantees.**

We don't ask you to trust the architecture.  
We show you the evidence.

---

## Architecture (canonical layer)

The architecture defines:

- the constitutional model,
- the transformation specifications,
- the normative requirements,
- the governance rules.

These documents live in `/specification/` and describe what Continuity OS is **designed** to provide. They are canonical — hand-edited only through governed amendment.

## Evidence (operational layer)

The evidence shows:

- what has been **implemented**,
- what has been **verified**,
- what has been **reproduced**,
- what remains **research**.

This is measured automatically by COR-1.0, CSR-1.0, DRA-1.0, and the proof graph. Derived reports in `/meta/` and `/conformance/` are **regenerated** from canonical state — never authoritative on their own.

## Inspectability

Every claim in the repository is classified as one of:

| Status | Meaning |
|--------|---------|
| **Normative** | Required by the specification |
| **Implemented** | Demonstrated by a runtime |
| **Verified** | Validated by the conformance ecosystem |
| **Reproduced** | Independently confirmed |
| **Research** | Intentionally outside Version 1.0 guarantees |

There is no undocumented middle ground.

## Don't trust the repository — query it

Continuity OS doesn't ask for trust. It exposes evidence.

You can query:

- which requirements are implemented,
- which claims are verified,
- which evidence is missing,
- which receipts are unanchored,
- which provenance chains are incomplete,
- which claims remain research.

```bash
npm run spec:rebuild
node tools/crk.mjs query requirements --implemented
node tools/crk.mjs query requirements --verified
node tools/crk.mjs dra top-blockers
node tools/crk.mjs explain NODE CRK1-R012
node tools/crk.mjs orc evaluate
node tools/crk.mjs rcd evaluate
```

Everything is inspectable.  
Everything is reproducible.  
Everything is evidence-driven.

**Version 1.0 is not a promise — it is a measurement.**

---

## Related

- [Don't Trust the Repository — Query It](./dont-trust-query-it.md)
- [ORC-1.0](../../conformance/certification/ORC-1.0.md) — operational readiness
- [RCD-1.0](../../conformance/certification/RCD-1.0.md) — release criteria
- [GLS-1.0](../../governance/governance-ledger/GLS-1.0.md) — governance ledger
- [v1.0 Launch Narrative](./v1.0-launch-narrative.md) — public overview
- [SGDF-1.0](../../conformance/certification/SGDF-1.0.md) — steward governance framework
