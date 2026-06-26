# Constitutional Contracts

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative

Four contracts form the executable law of the runtime. Every constitutional object must satisfy its contract.

## EvidenceContract

- Every OutcomeObject produces exactly one EvidenceObject.
- Evidence derived solely from the OutcomeObject.
- Evidence reproducible from inputs.
- All relevant fields exposed (K4).
- Evidence hash-stable.

**Requirements:** CRK1-R018, CRK1-R002

## GovernanceContract

- Every constitutional action produces a governance receipt.
- Receipts follow REC-HDR-1.0.
- Receipts include invariant, evidence, and traceability blocks.
- Receipts Merkle-anchored.
- No action bypasses governance.

**Requirements:** CRK1-R033, CRK1-R042

## RuntimeContract

- Decision → Outcome → Evidence → Interpretation always occurs.
- No step skipped or short-circuited.
- All objects replayable (K3).
- All objects satisfy invariants.
- All objects traceable (K6).

**Requirements:** CRK1-R040, CRK1-R001–R004

## SemanticContract

- Interpretations from multiple frames (K7).
- Interpretations reproducible (K8).
- Semantic drift measurable (K9).
- No founder knowledge in interpretations (K11).
- Interpretations hash-stable.

**Requirements:** CRK1-R020–R022, CRK1-R025
