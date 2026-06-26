# CRK-1 Constitutional Amendment CA-1.1: Four-Layer Provenance

**Authority:** CRK-1 Specification v1.0  
**Status:** Constitutional layer (additive amendment)  
**Version:** 1.1  
**Builds on:** [CA-1.0](./CA-1.0-one-artifact-per-stage.md)

## Amendment text

### CA-1.1 — Four-Layer Provenance Model

1. Every semantic transformation **SHALL** be attributable across four layers: **Authority**, **Specification**, **Implementation**, and **Execution**.
2. Every provenance entry for a transformation **SHALL** declare: `authority_id`, `transformation_spec_id`, `implementation_id`, `assumptions`, `input_artifact_id`, `output_artifact_id`, and `receipt_id` (PL-1.1).
3. Every transformation contract **SHALL** declare: `AuthorizedBy`, `SpecificationID`, `ImplementationID`, and an `Assumptions` block.
4. **Invariant P-1:** Every semantic transformation SHALL declare its authority, specification, implementation, assumptions, input artifact, output artifact, and receipt.
5. Implementations **MAY** claim conformance to a `SpecificationID` only when CTS and MRI evidence demonstrates binding.
6. Execution **SHALL NOT** occur under assumptions not authorized by the active `authority_id`.

## Rationale

Dar-z refinement: separates **what is allowed** (authority), **what is meant** (specification), **how it is built** (implementation), and **what happened** (execution). This is required for multi-vendor, multi-runtime ecosystems.

## Layer responsibilities

| Layer | Governs |
|-------|---------|
| Authority | Valid specs, policies, stewards |
| Specification | Transformation meaning and contracts |
| Implementation | Code realization and conformance claims |
| Execution | Runtime artifacts, receipts, ledger |

See [four-layer-provenance-model.md](../four-layer-provenance-model.md).

## Verification

- **CRK1-R043** — Transformation Provenance Completeness
- CTS-G3 (provenance), CTS-S3 (traceability)
- Federation F3 (provenance sync with full context)
- R1-0 reproduction with assumption matching

## Relationship to CA-1.0

CA-1.0 governs **one artifact per stage**. CA-1.1 governs **full provenance attribution per transformation**. Both are binding.

## Version governance

Adopted under Steward Council **Conformance Proposal (CFP)** — 2/3 approval. Does not modify K0–K12 text.
