# RFC-COR-SUITE-1.0

**Constitutional Observability, Validation, Measurement, Analysis, Governance, and Communication Architecture**

| Field | Value |
|-------|-------|
| Status | Proposed Standard |
| Version | 1.0 |
| Editors | Halstead, J. |
| Category | Standards Track |

---

## 1. Introduction

This RFC defines the COR Suite, a constitutional architecture for evidence-first software governance.

Version 1.0 introduces a stable six-layer model:

1. Canonical Layer (CAR-1.0)
2. Validation Layer (CAV-1.0)
3. Measurement Layer (COR-1.0, CSR-1.0, DRA-1.0)
4. Analysis Layer (Proof Analysis)
5. Governance Layer (Steward Council)
6. Communication Layer (Public Documentation)

This layering ensures that:

- canonical truth is explicitly declared
- validation verifies integrity
- measurement reports state
- analysis explains consequences
- governance makes decisions
- communication reflects results

The repository never declares itself correct. Correctness is demonstrated through reproducible evidence.

---

## 2. Terminology

**Canonical Artifact** - any requirement, specification, implementation, verification, evidence, schema, registry, or governance receipt registered in CAR-1.0.

**CAR-1.0** - Canonical Artifact Registry.

**CAV-1.0** - Canonical Artifact Validation.

**Measurement Artifacts** - COR-1.0, CSR-1.0, DRA-1.0.

**Proof Analysis** - reasoning layer producing derived claims.

**Steward Council** - governance authority.

**Blocking Finding** - a CAV finding that must be resolved before release.

**Advisory Finding** - a non-blocking finding relevant to governance.

---

## 3. Architectural Overview

The COR Suite defines six strictly separated layers:

1. Canonical Layer (CAR-1.0)
2. Validation Layer (CAV-1.0)
3. Measurement Layer (COR-1.0, CSR-1.0, DRA-1.0)
4. Analysis Layer (Proof Analysis)
5. Governance Layer (Steward Council)
6. Communication Layer (Public Documentation)

Each layer consumes the outputs of the layer below and MUST NOT assume responsibilities of any other layer.

---

## 4. Canonical Layer - CAR-1.0 (Normative)

### 4.1 Purpose

CAR-1.0 defines the authoritative inventory of all canonical artifacts.

### 4.2 Requirements

CAR-1.0 MUST:

- register every canonical artifact explicitly
- assign each artifact a stable ID, namespace, kind, version, status, authority, schemaRef, path, and hash
- record lifecycle timestamps: created, updated, deprecated, retired
- record links: supersedes, supersededBy, related
- serve as the single source of truth for all downstream layers

All downstream layers MUST read canonical identity, artifact paths, and artifact hashes from CAR-1.0 only, not from ad-hoc repository scans.

### 4.3 Prohibitions

CAR-1.0 MUST NOT:

- infer canonical artifacts from repository scans
- omit any artifact required by the constitutional specification
- contain duplicate IDs or conflicting lifecycle states

**Schema:** [car-1.0.schema.json](./car-1.0.schema.json)
**Contract:** [CAR-1.0-Registry.md](./CAR-1.0-Registry.md)

---

## 5. Validation Layer - CAV-1.0 (Normative)

### 5.1 Purpose

CAV-1.0 verifies the integrity of canonical state.

### 5.2 Requirements

CAV-1.0 MUST:

- validate CAR-1.0 against its schema
- verify that each artifact exists at its registered path
- verify that each artifact's hash matches its content
- detect duplicate IDs
- detect conflicting lifecycle states
- verify that required canonical artifacts are present
- verify that provenance chains are complete and unbroken
- classify findings as blocking or advisory

### 5.3 Findings Classification

Blocking findings MUST be resolved before release:

- invalid canonical artifacts
- broken provenance chains
- missing required canonical artifacts
- schema violations
- hash mismatches

Advisory findings MAY be resolved post-release:

- research claims
- high dependency-risk nodes
- non-critical verification gaps
- deprecated authorities with valid successors

### 5.4 Prohibitions

CAV-1.0 MUST NOT:

- perform measurement
- perform analysis
- issue governance decisions

**Schema:** [cav-validation.schema.json](./cav-validation.schema.json)
**Contract:** [CAV-1.0-Validation.md](./CAV-1.0-Validation.md)

---

## 6. Measurement Layer - COR-1.0, CSR-1.0, DRA-1.0 (Normative)

### 6.1 Purpose

The measurement layer computes descriptive constitutional state from canonical artifacts.

### 6.2 Inputs

- CAR-1.0
- CAV-1.0 status and findings

### 6.3 Components

#### COR-1.0 - Constitutional Observability

COR-1.0 MUST produce:

- requirements
- specifications
- implementations
- verifications
- evidence
- maturity levels
- structural integrity exceptions

#### CSR-1.0 - Constitutional Stewardship Report

CSR-1.0 MUST measure:

- steward participation
- governance activity
- decision coverage

#### DRA-1.0 - Dependency-Risk Assessment

DRA-1.0 MUST measure:

- dependency depth
- risk concentration
- readiness indicators

### 6.4 Prohibitions

Measurement MUST NOT:

- infer missing artifacts
- interpret findings as decisions
- modify canonical state
- scan the repository to discover canonical artifacts when CAR-1.0 is available

**Contract:** [COR-1.0-Contract.md](./COR-1.0-Contract.md)
**Schema:** [cor-state-vector.schema.json](./cor-state-vector.schema.json)

---

## 7. Analysis Layer - Proof Analysis (Normative)

### 7.1 Purpose

Proof Analysis explains the consequences of canonical and measured state.

### 7.2 Inputs

- CAR-1.0
- COR-1.0
- DRA-1.0

### 7.3 Requirements

Proof Analysis MUST:

- compute dependency maps
- detect regressions
- perform counterfactual analysis
- produce derivation traces

### 7.4 Prohibitions

Proof Analysis MUST NOT:

- modify CAR-1.0
- modify measurement outputs
- issue governance decisions

**Contract:** [Proof-Analysis-Spec.md](./Proof-Analysis-Spec.md)
**Schema:** [proof-analysis.schema.json](./proof-analysis.schema.json)

---

## 8. Governance Layer - Steward Council (Normative)

### 8.1 Purpose

The Steward Council evaluates validated and measured state against published criteria.

### 8.2 Inputs

- CAV-1.0 findings
- COR-1.0, CSR-1.0, DRA-1.0
- Proof Analysis
- constitutional invariants
- release criteria

### 8.3 Decisions

Governance MAY decide:

- approve
- reject
- require fixes
- escalate
- freeze
- retire

### 8.4 Governance Receipts

Governance receipts MUST include:

- decision ID
- steward identity
- timestamp
- rationale
- evidence references
- invariants enforced
- signature

Receipts MUST be registered in CAR-1.0 as canonical artifacts with `kind = "governance_receipt"`.

### 8.5 Prohibitions

Governance MUST NOT:

- modify evidence directly
- modify canonical artifacts directly
- override CAV-1.0 blocking findings without a governed decision and receipt
- reinterpret measurement outputs

Governance changes to canonical state MUST occur through governed CAR edits and resulting receipts.

**Contract:** [Governance-Engine-Interface.md](./Governance-Engine-Interface.md)
**Schema:** [governance-receipt.schema.json](./governance-receipt.schema.json)

---

## 9. Communication Layer - Public Documentation (Non-Normative)

### 9.1 Purpose

The Communication Layer generates public-facing documentation derived from validated, measured, analyzed, and governed state.

### 9.2 Inputs

- CAV-1.0 validation report
- COR-1.0, CSR-1.0, DRA-1.0 measurements
- Proof Analysis
- Governance receipts

### 9.3 Requirements

Communication MUST:

- reflect canonical, validated, measured, and governed state
- remain strictly derivative
- derive from governance outputs when describing decisions or release posture

Communication MUST NOT:

- introduce new canonical artifacts
- override governance decisions
- reinterpret CAV-1.0 findings as governance decisions
- publish release posture contrary to governance receipts

**Contract:** [Public-Messaging.md](./Public-Messaging.md)

---

## 10. Security Considerations

- CAR-1.0 MUST be tamper-evident.
- CAV-1.0 MUST detect unauthorized modifications.
- Governance receipts MUST be signed.
- All measurement artifacts MUST be reproducible.

---

## 11. Reproducibility Considerations

- All canonical artifacts MUST be reproducible.
- All validation MUST be independently verifiable.
- All measurement MUST be deterministic.
- All analysis MUST be traceable.
- All governance decisions MUST reference reproducible evidence.

---

## 12. Change Control and Stewardship

- Changes to CAR-1.0 MUST be governed.
- Amendments to this RFC MUST follow the Steward Council process.
- Deprecations MUST include supersession links.
- Retirements MUST preserve historical lineage.

**Charter:** [../governance/charter/Founder-Independent-Governance-Charter.md](../governance/charter/Founder-Independent-Governance-Charter.md)

---

## 13. Appendix A: Rationale

The introduction of CAR-1.0 and CAV-1.0 formalizes the separation between:

- canonical truth
- validation of truth
- measurement of state
- analysis of consequences
- governance decisions
- public communication

This separation prevents a repository from declaring itself correct. It must instead expose the evidence required for independent reviewers to determine correctness.
