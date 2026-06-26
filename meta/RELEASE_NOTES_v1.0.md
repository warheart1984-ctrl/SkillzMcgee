# CRK-1 / Continuity OS — Version 1.0 Release Notes

**Release date:** 2026-06-26  
**Tag:** `v1.0.0-spec` (specification plane)  
**Scope:** CRK-1 kernel specification + Continuity OS v0.1 preview runtime

## 1. Summary

Version 1.0 delivers the **first complete constitutional specification** and **conformance proof catalog** for CRK-1 and Continuity OS, with a **preview** governed runtime (Nova Studio) demonstrating the constitutional loop.

This release separates:

- **Plane 1 (frozen):** What must be true — `specification/`
- **Plane 2 (evolving):** How we prove it — `conformance/`

## 2. Major additions

### 2.1 CRK-1 specification

- Kernel Codex (K0–K12)
- Object Model (COM-1.0)
- Constitutional Contracts (Evidence, Governance, Runtime, Semantic)
- Drift Envelope Specification (CE/SE)
- Formal Runtime Semantics
- **Normative Requirements Catalog (R001–R042)**
- UV1-DECL-1.0 architecture declaration
- Repository Invariant R-∞

### 2.2 Conformance ecosystem

- **Traceability matrix** (Requirement → CTS → MRI → Evidence → Receipt → Provenance)
- CTS-1.0 test catalog and repo test mapping
- MRI-1.0 implementation map
- Compliance Profiles C0–C6
- Certification program criteria
- Reproduction Harness R1-0 (Mission #006)
- Founder-Independence Audit (FIA) protocol
- Resolution map (machine-readable proof graph)

### 2.3 Governance infrastructure (spec + partial implementation)

- Governance Receipt Header REC-HDR-1.0 schema
- Merkle Spine specification
- Provenance Ledger PL-1.0 specification
- Live ledger: `.runtime/nova-studio/ledger.jsonl` (transitional receipt shape)

### 2.4 Continuity OS layer (preview)

- Nova Studio unified shell (`npm run nova-studio`)
- Governed pipeline, capabilities, specimen round-trip, federation constellation
- React scaffold (`src/nova-studio/`, `npm run nova-studio:react`)
- Public diagrams and launch kit

## 3. Stability guarantees (specification plane)

Version 1.0 specification is:

- Constitutionally frozen (STAB-1.0)
- Vocabulary-stable
- Traceability-complete at the document level
- Founder-independent at the documentation level

## 4. Conformance status (honest posture)

| Criterion | Status |
|-----------|--------|
| Specification R001–R042 published | ✅ Complete |
| Traceability matrix + resolution map | ✅ Complete |
| ADR template + sample ADRs | ✅ Complete |
| Nova Studio governed loop (preview) | ✅ 5/5 API tests |
| Full CTS-1.0 all series automated | 🔄 Partial (`npm test`, governance gate) |
| REC-HDR-1.0 on all receipts | 🔄 Transitional (studio ledger) |
| MRI-1.0 standalone extraction | 🔄 Mapped, not isolated package |
| R1-0 independent reproduction validated | 🔄 Protocol documented; D-3 seal pending |
| FIA founder-independence audit | 🔄 Protocol documented |
| C6 full compliance badge | 🔄 Criteria defined; not yet awarded |

**Seal D-3 (Reproduction-Ready)** is the target outcome of Mission #006 — not claimed in this tag until an independent steward completes R1-0 with matching receipts, Merkle roots, drift envelopes, and provenance.

## 5. Upgrade path

Version 2.0 exploration is permitted only within:

- V2-CHARTER-0.1 / V2-BOUND-0.1
- K-∞ axioms
- Constitutional Supremacy (K12)

CRK-1 kernel remains intact; V1 artifacts remain binding on V1 provenance.

## 6. Key links

- [CONTINUITY_OS.md](../CONTINUITY_OS.md) — public-facing overview
- [conformance/traceability-matrix.md](../conformance/traceability-matrix.md) — master audit matrix
- [specification/normative-requirements/](../specification/normative-requirements/) — R001–R042
