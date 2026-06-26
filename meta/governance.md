# Repository Governance

## Amendment process (V1 frozen)

1. Proposal with evidence
2. Governance evaluation (G2P lineage)
3. Architectural translation
4. CTS + R1-0 verification
5. Provenance logging

V1 specification changes require Version 2.0 adoption per STAB-1.0.

## Conformance changes

Conformance plane may evolve if:

- Every new test maps to a requirement (R-∞)
- resolution-map.json updated
- CTS reports regenerated

## PR requirements

- Traceability block in description (requirement → ADR → implementation → CTS)
- Governance receipt for merges (when CI gate enabled)

See `SUBSTRATION_ENGINE_BLUEPRINT.md` governance gate section.
