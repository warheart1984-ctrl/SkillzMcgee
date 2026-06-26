# CRK-1 Normative Requirements Catalog

**Authority:** CRK-1 Specification v1.0  
**Count:** 42 requirements (R001–R042)  
**Status:** Normative — frozen for V1

Each requirement carries the standardized metadata block (Dar-z pattern).

## Repository Invariant R-∞

For any verification artifact V: ∃R ∈ Requirements such that resolves(V, R).

## Series index


### M-Series — Mechanical (K0–K3)

| ID | Title | Invariant |
|----|-------|----------|
| [R001](./R001.md) | Consequence Continuity | K0 |
| [R002](./R002.md) | Evidence Completeness | K1 |
| [R003](./R003.md) | Interpretive Exposure | K2 |
| [R004](./R004.md) | Replayability | K3 |
| [R005](./R005.md) | No Dropped Outcomes | K0 |
| [R006](./R006.md) | No Suppressed Evidence | K1 |
| [R007](./R007.md) | No Blocked Interpretation | K2 |
| [R008](./R008.md) | No Hidden State | K3 |
| [R009](./R009.md) | Consequence Loop Totality | K0-K3 |

### S-Series — Structural (K4–K6, COM, Contracts)

| ID | Title | Invariant |
|----|-------|----------|
| [R010](./R010.md) | Structural Transparency | K4 |
| [R011](./R011.md) | Contractual Binding | K5 |
| [R012](./R012.md) | Traceability Preservation | K6 |
| [R013](./R013.md) | IdentityObject Schema | K4 |
| [R014](./R014.md) | DecisionObject Schema | K4,K0 |
| [R015](./R015.md) | OutcomeObject Schema | K4,K1 |
| [R016](./R016.md) | EvidenceObject Schema | K4,K2 |
| [R017](./R017.md) | InterpretationObject Schema | K4,K7 |
| [R018](./R018.md) | EvidenceContract Enforcement | K5 |
| [R019](./R019.md) | RuntimeContract Enforcement | K5 |

### E-Series — Semantic (K7–K9, SRE)

| ID | Title | Invariant |
|----|-------|----------|
| [R020](./R020.md) | Semantic Multiplicity | K7 |
| [R021](./R021.md) | Semantic Reproducibility | K8 |
| [R022](./R022.md) | Semantic Drift Visibility | K9 |
| [R023](./R023.md) | No Dominant Frame | K7 |
| [R024](./R024.md) | No Unfalsifiable Interpretations | K8 |
| [R025](./R025.md) | Semantic Replay Determinism | K3,K8 |
| [R026](./R026.md) | Frame Evolution Auditability | K7,K9 |
| [R027](./R027.md) | SemanticContract Enforcement | K5 |
| [R028](./R028.md) | Semantic Drift Auditor | K9 |
| [R029](./R029.md) | Interpretive Lineage Tree | K7 |

### H-Series — Historical (K10–K12, Provenance)

| ID | Title | Invariant |
|----|-------|----------|
| [R030](./R030.md) | Provenance Immutability | K10 |
| [R031](./R031.md) | Founder Independence | K11 |
| [R032](./R032.md) | Constitutional Supremacy | K12 |
| [R033](./R033.md) | Governance Receipt Header Compliance | K10 |
| [R034](./R034.md) | Merkle Spine Anchoring | K10 |
| [R035](./R035.md) | Receipt-Anchored Provenance | K10 |
| [R036](./R036.md) | Requirement-to-ADR Traceability | K6 |
| [R037](./R037.md) | Implementation-to-CTS Traceability | K6 |
| [R038](./R038.md) | Documentation Completeness | K11 |
| [R039](./R039.md) | Governance Bypass Prohibition | K12 |

### B-Series — Behavioral (Loop, Drift, Visibility)

| ID | Title | Invariant |
|----|-------|----------|
| [R040](./R040.md) | Constitutional Loop Completeness | K0-K3 |
| [R041](./R041.md) | Drift Monotonicity | K9,K10 |
| [R042](./R042.md) | Governance Visibility | K5,K10 |

## Machine-readable catalog

[catalog.json](./catalog.json)

## Regenerate files

```bash
node tools/generators/requirements-catalog.mjs
```
