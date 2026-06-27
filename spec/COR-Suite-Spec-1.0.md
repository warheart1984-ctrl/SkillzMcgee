# COR Suite - Consolidated Specification (v1.0)

**Constitutional Architecture for Evidence-First Governance**

| Field | Value |
|-------|-------|
| Version | 1.0 |
| RFC | [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md) |
| Status | Normative |

---

## 0. Purpose

The COR Suite defines the constitutional substrate for evidence-first software governance.

Version 1.0 establishes a six-layer architecture:

1. Canonical Layer - CAR-1.0
2. Validation Layer - CAV-1.0
3. Measurement Layer - COR-1.0, CSR-1.0, DRA-1.0
4. Analysis Layer - PGI-1.0, Proof Analysis, Counterfactuals
5. Governance Layer - Steward Council
6. Communication Layer - Public Documentation

Each layer has a single responsibility and MUST NOT assume the responsibilities of any other layer.

---

## 1. Canonical Layer - CAR-1.0

**Role:** Defines constitutional truth.
**Artifact:** CAR-1.0 (Canonical Artifact Registry).

### 1.1 Purpose

CAR-1.0 defines the authoritative inventory of all canonical artifacts. It is the single source of truth for requirements, specifications, implementations, verifications, evidence, schemas, registries, and governance receipts.

### 1.2 Canonical Artifact Types

- requirement
- specification
- implementation
- verification
- evidence
- governance_receipt
- schema
- registry

### 1.3 CAR-1.0 Requirements

CAR-1.0 MUST register every canonical artifact explicitly.

Each artifact MUST include:

- `id`
- `namespace`
- `kind`
- `version`
- `status`
- `path`
- `hash`

Each artifact SHOULD include:

- `authority`
- `schemaRef`
- lifecycle timestamps
- links: `supersedes`, `supersededBy`, `related`

All downstream layers MUST read canonical identity, artifact paths, and artifact hashes from CAR-1.0 only. They MUST NOT discover canonical artifacts through ad-hoc repository scans.

### 1.4 Prohibitions

CAR-1.0 MUST NOT:

- infer canonical artifacts from repository scans
- contain duplicate artifact IDs
- contain conflicting lifecycle states
- omit required canonical artifacts for a governed release

**Schema:** [car-1.0.schema.json](./car-1.0.schema.json)
**Contract:** [CAR-1.0-Registry.md](./CAR-1.0-Registry.md)

---

## 2. Validation Layer - CAV-1.0

**Role:** Verifies canonical integrity.
**Artifact:** CAV-1.0 validation report.

### 2.1 Purpose

CAV-1.0 validates the CAR registry before measurement, analysis, or governance occurs.

### 2.2 Validation Requirements

CAV-1.0 MUST:

- validate CAR-1.0 against the CAR schema
- verify every registered artifact exists at `path`
- verify every registered artifact matches `hash`
- detect duplicate IDs
- detect conflicting lifecycle states
- detect broken provenance chains
- classify findings as `blocking` or `advisory`

### 2.3 Blocking Findings

- invalid canonical artifacts
- broken provenance chains
- missing required canonical artifacts
- schema violations
- hash mismatches

### 2.4 Advisory Findings

- research claims
- high dependency-risk nodes
- non-critical verification gaps
- deprecated authorities with valid successors

### 2.5 Prohibitions

CAV-1.0 MUST NOT:

- perform measurement
- perform proof analysis
- issue governance decisions
- mutate CAR-1.0

**Schema:** [cav-validation.schema.json](./cav-validation.schema.json)
**Contract:** [CAV-1.0-Validation.md](./CAV-1.0-Validation.md)

---

## 3. Measurement Layer - COR-1.0, CSR-1.0, DRA-1.0

**Role:** Computes constitutional state from canonical artifacts.
**Artifacts:** COR-1.0 state vector, CSR-1.0 stewardship report, DRA-1.0 dependency-risk assessment.

### 3.1 Inputs

The measurement layer MUST consume:

- CAR-1.0
- CAV-1.0 status and findings

### 3.2 COR-1.0 Requirements

COR-1.0 MUST compute:

- requirements
- specifications
- implementations
- verifications
- evidence
- maturity levels
- structural integrity exceptions

### 3.3 CSR-1.0 Requirements

CSR-1.0 MUST compute:

- steward participation
- governance activity
- decision coverage
- role and responsibility metrics

### 3.4 DRA-1.0 Requirements

DRA-1.0 MUST compute:

- dependency depth
- fan-in and fan-out
- verification gaps
- deprecated dependencies
- dependency-risk score

### 3.5 Prohibitions

Measurement MUST NOT:

- interpret findings as decisions
- modify canonical state
- override CAV-1.0 findings
- scan the repository to discover canonical artifacts when CAR-1.0 exists

**COR Schema:** [cor-state-vector.schema.json](./cor-state-vector.schema.json)
**DRA Schema:** [dra-report.schema.json](./dra-report.schema.json)

---

## 4. Analysis Layer - PGI-1.0 and Proof Analysis

**Role:** Explains dependencies, lineage, regressions, and counterfactuals.
**Artifacts:** PGI-1.0 proof graph index, proof-analysis results, dependency maps, regression reports, counterfactual scenarios.

### 4.1 PGI-1.0 Requirements

PGI-1.0 MUST build a proof graph from CAR-1.0.

PGI-1.0 nodes MUST represent canonical artifacts. PGI-1.0 edges MUST represent proof relations such as:

- `implements`
- `verifies`
- `evidences`
- `supersedes`
- `related`

### 4.2 Proof Analysis Requirements

Proof Analysis MUST:

- compute dependency maps
- detect regressions
- perform counterfactual analysis
- produce derivation traces
- consume CAR-1.0, COR-1.0, PGI-1.0, and DRA-1.0 as inputs

### 4.3 Prohibitions

Analysis MUST NOT:

- mutate CAR-1.0
- mutate measurement outputs
- issue governance decisions

**PGI Schema:** [pgi.schema.json](./pgi.schema.json)
**Proof Analysis Schema:** [proof-analysis.schema.json](./proof-analysis.schema.json)

---

## 5. Governance Layer - Steward Council

**Role:** Evaluates measured state against published criteria and records decisions.
**Artifact:** Governance receipts registered in CAR-1.0 as `kind = "governance_receipt"`.

### 5.1 Inputs

Governance MUST consider:

- CAV-1.0 findings
- COR-1.0, CSR-1.0, and DRA-1.0 measurements
- PGI-1.0 and Proof Analysis outputs
- constitutional invariants
- release criteria

### 5.2 Decision Types

Governance MAY decide:

- approve
- reject
- require_fixes
- escalate
- freeze
- retire

### 5.3 Governance Receipts

Governance receipts MUST include:

- decision ID
- steward identity
- timestamp
- rationale
- evidence references
- invariants enforced
- signature

Governance receipts MUST be registered in CAR-1.0.

### 5.4 Release Criteria Template

Release criteria MUST classify inputs as blocking or advisory.

Blocking examples:

- invalid canonical artifacts
- broken provenance chains
- missing required canonical artifacts
- schema violations
- unresolved structural integrity failures
- unverified critical requirements
- unsigned governance receipts

Advisory examples:

- research claims
- high dependency-risk nodes
- deprecated authorities with successors
- non-critical verification gaps

### 5.5 Prohibitions

Governance MUST NOT:

- modify evidence directly
- modify canonical state directly
- reinterpret measurement as decision without a signed receipt

**Release criteria:** [../governance/release-criteria/v1.0.md](../governance/release-criteria/v1.0.md)
**Contract:** [Governance-Engine-Interface.md](./Governance-Engine-Interface.md)

---

## 6. Communication Layer - Public Documentation

**Role:** Generates public documentation and reports as derived artifacts.
**Artifacts:** Release notes, public reports, dashboards, external documentation.

Communication MUST:

- reflect canonical, validated, measured, analyzed, and governed state
- derive release posture from governance receipts
- remain strictly derivative

Communication MUST NOT:

- override CAR-1.0
- reinterpret CAV-1.0 findings as governance decisions
- publish release posture contrary to governance receipts

**Contract:** [Public-Messaging.md](./Public-Messaging.md)

---

## 7. Release Pipeline

The normative release pipeline is:

```text
CAR -> CAV -> COR -> PGI -> DRA -> Proof Analysis -> Maturity -> Governance -> Communication
```

CI and local validation SHOULD emit artifacts into `meta/cor-suite/`.

---

**END OF CONSOLIDATED SPEC**
