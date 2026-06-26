# Don't Trust the Repository — Query It

Continuity OS doesn't ask for trust.  
It exposes evidence.

Every constitutional claim in Version 1.0 is:

- **Normative** — defined in the specification,
- **Implemented** — demonstrated by a runtime,
- **Verified** — validated by the conformance ecosystem,
- **Reproduced** — independently confirmed, or
- **Research** — explicitly outside the guarantee boundary.

There is no undocumented middle ground.

## Query the repository

The repository is fully introspectable:

- Which requirements are implemented?
- Which claims are verified?
- Which evidence is missing?
- Which receipts are unanchored?
- Which provenance chains are incomplete?
- Which claims remain research?

You don't have to trust the architecture.  
You don't have to trust the authors.  
You don't have to guess what's complete.

**Just query the repository.**

```bash
node tools/crk.mjs cor generate --out meta/COR-1.0.json
node tools/crk.mjs explain NODE CRK1-R012
node tools/crk.mjs counterfactual remove NODE CRK1-R012
node tools/crk.mjs query coverage
node tools/crk.mjs validate closure
npm run spec:cor
```

Reports:

- [COR-1.0 schema](../../conformance/observability/COR-1.0/schema.json) — constitutional health check
- [CSR-1.0 registry](../../conformance/observability/CSR-1.0/registry.json) — claim maturity states
- [Traceability matrix](../../conformance/traceability-matrix.json) — requirement → evidence chain

---

Continuity OS is not only open source —  
it is **open evidence**.
