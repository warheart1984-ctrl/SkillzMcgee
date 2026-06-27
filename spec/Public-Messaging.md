# Public Messaging

**Layer:** Communication (Layer 6)
**RFC:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md)

## Core philosophy

> The repository does not declare its own correctness.
> It exposes the evidence required for independent reviewers to determine it.

## Messaging pillars

- **Evidence-first** â€” Claims are backed by artifacts registered in CAR, not authority.
- **Reproducibility as legitimacy** â€” Independent reproduction is the apex maturity state.
- **Deterministic observability** â€” COR reports the same state given the same CAR inputs.
- **Separation of concerns** â€” Canonical â‰  validation â‰  measurement â‰  analysis â‰  governance.
- **Governance as verification, not trust** â€” Stewards decide; they do not measure or validate.
- **â€œDonâ€™t trust the repository â€” query it.â€**

## External narrative

| Layer | What it is | What it is not |
|-------|------------|----------------|
| CAR-1.0 | Canonical registry of truth | Filesystem scan |
| CAV-1.0 | Integrity validation | Governance gate by itself |
| COR / CSR / DRA | Measurement | Decision engine |
| Proof Analysis | Reasoning over evidence | Governance |
| Governance | Decision with receipts | Inference engine |
| Communication | Derived public narrative | Source of truth |

## Output

A founder-independent narrative suitable for README, press kit, auditor onboarding, and public FAQ.

## Implementation (this repository)

- [../../../docs/public/dont-trust-query-it.md](../../../docs/public/dont-trust-query-it.md)
- [../../../conformance/certification/external-auditor-handbook-v1.0.md](../../../conformance/certification/external-auditor-handbook-v1.0.md)
- [../../../docs/launch-kit/](../../../docs/launch-kit/) (when present)

## Query commands (public-facing)

```bash
node tools/crk.mjs cor generate --out meta/COR-1.0.json
node tools/crk.mjs query coverage
node tools/crk.mjs validate closure
npm run spec:rebuild
```

Counterfactual and explain queries belong to **Proof Analysis**, not COR:

```bash
node tools/crk.mjs counterfactual remove NODE CRK1-R012
node tools/crk.mjs explain NODE CRK1-R012
```
