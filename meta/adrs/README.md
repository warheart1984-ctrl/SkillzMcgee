# ADRs (Architecture Decision Records)

Version 1.0 architectural decisions live here. Each ADR must link to normative requirements per [../adr-template.md](../adr-template.md).

| ADR | Title | Requirements |
|-----|-------|--------------|
| [ADR-001](./adrs/ADR-001-nova-studio-unified-shell.md) | Nova Studio unified shell | R040, R042, R004 |
| [ADR-002](./adrs/ADR-002-two-plane-repository.md) | Two-plane spec vs conformance | R012, R036, R037 |

## Create a new ADR

1. Copy [../adr-template.md](../adr-template.md) to `meta/adrs/ADR-XXX-title.md`
2. Fill linked requirements from [../specification/normative-requirements/](../specification/normative-requirements/)
3. Update [../conformance/traceability-matrix.json](../conformance/traceability-matrix.json) via generator if CTS/MRI mappings change
