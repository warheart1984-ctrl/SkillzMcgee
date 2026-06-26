# Repository Invariant R-∞ (Verification Resolution Invariant)

**Requirement ID:** CRK1-R-INFINITY  
**Authority:** CRK-1 Specification v1.0  
**Rationale:** Prevents orphan verification artifacts and ensures the repository is a formal proof system, not a document pile.  
**Verification Method:** Traceability audit; CI governance gate  
**Evidence Required:** Requirement → test mapping in `conformance/CTS-1.0/`  
**Traceability Links:** R-∞ → `tests/skillzmcgee/test_traceability.py` → governance gate  
**Version:** 1.0  
**Status:** Normative

## Formal statement

For any verification artifact **V**:

```
∃ R ∈ Requirements : resolves(V, R)
```

Where:

- **V** ∈ {tests, receipts, audits, certifications, provenance entries, drift checks, reproduction results}
- **R** ∈ {normative requirements in `specification/normative-requirements/`}

## Implications

1. No test exists without a requirement.
2. No receipt schema exists without a requirement.
3. No audit protocol exists without a requirement.
4. No certification badge exists without a requirement.
5. No provenance entry type exists without a requirement.

## Architectural effect

The repository becomes:

> A constitutional specification + a complete, evidence-backed conformance proof.

Plane 1 (`specification/`) is timeless.  
Plane 2 (`conformance/`) is evolvable.  
R-∞ binds them.

## Four-layer provenance (CA-1.1)

Verification artifacts MUST also declare layer binding where applicable:

- **Authority** — who authorized the artifact
- **Specification** — which normative contract applies
- **Implementation** — which code module realizes it
- **Execution** — runtime evidence and ledger entries

See [four-layer-provenance-model.md](./four-layer-provenance-model.md) and **CRK1-R043**.
