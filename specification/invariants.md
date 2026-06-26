# Kernel Codex — Invariants K0–K12

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative — immutable for V1

| ID | Layer | Invariant | Requirement |
|----|-------|-----------|-------------|
| K0 | Mechanical | Consequence Continuity | Every DecisionObject produces an OutcomeObject |
| K1 | Mechanical | Evidence Completeness | Every OutcomeObject produces an EvidenceObject |
| K2 | Mechanical | Interpretive Exposure | Every EvidenceObject produces an InterpretationObject |
| K3 | Mechanical | Replayability | All objects reconstructible from prior state |
| K4 | Structural | Structural Transparency | No hidden fields or implicit semantics |
| K5 | Structural | Contractual Binding | All objects satisfy their contracts |
| K6 | Structural | Traceability Preservation | Complete traceability chain, no breaks |
| K7 | Semantic | Semantic Multiplicity | Interpretations from multiple frames |
| K8 | Semantic | Semantic Reproducibility | Interpretations reproducible from evidence |
| K9 | Semantic | Semantic Drift Visibility | Semantic drift measurable and exposed |
| K10 | Historical | Provenance Immutability | Append-only, hash-chained history |
| K11 | Historical | Founder Independence | No founder-specific assumptions |
| K12 | Historical | Constitutional Supremacy | Kernel overrides all subsystem behavior |

## Normative mapping

Each invariant maps to normative requirements in [normative-requirements/](./normative-requirements/README.md).

## Enforcement

Invariants are enforced by:

- Constitutional contracts (see [contracts.md](./contracts.md))
- Governance Enforcement Layer (GEL-1) — see `/conformance/`
- CTS-1.0 test suite — see `/conformance/CTS-1.0/`
