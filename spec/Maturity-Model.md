# Maturity Model

**Layer:** Measurement (COR-derived)
**RFC:** [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md)
**Schema:** [maturity-vector.schema.json](./maturity-vector.schema.json)

## Identity

A monotonic, auditable ladder of constitutional integrity, computed from CAR groupings in COR-1.0.

## Levels

1. **Normative** â€” Requirement exists and has authority.
2. **Implemented** â€” Implementation artifact exists and is linked.
3. **Verified** â€” Verification evidence demonstrates conformance.
4. **Reproduced** â€” Independent reviewer reproduces verification.

## Properties

- Strictly implies previous levels (reproduced â†’ verified â†’ implemented â†’ normative)
- Fully evidence-driven
- No subjective interpretation
- Reproducibility as apex state
- Aligns with CSR-1.0 claim registry and CTS/MRI culture

## Output

A maturity vector for each requirement and the system as a whole, conforming to `maturity-vector.schema.json`.

## CSR mapping

| Maturity level | CSR `claim_status` |
|----------------|-------------------|
| Normative | `normative` |
| Implemented | `implemented` |
| Verified | `verified` |
| Reproduced | `reproduced` |

Research claims (`research`) are explicitly outside the v1.0 guarantee boundary and do not participate in proof closure.

## Implementation (this repository)

- Registry: `conformance/observability/CSR-1.0/registry.json`
- Spec: [../../observability/CSR-1.0/spec.md](../../observability/CSR-1.0/spec.md)
- COR cross-check: CRK1-R044 / PI-1
