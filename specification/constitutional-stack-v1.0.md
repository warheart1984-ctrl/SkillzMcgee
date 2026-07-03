# Constitutional Stack v1.0

**Authority:** CRK-1 Specification v1.0
**Status:** Normative — consolidated layer contract
**Version:** 1.0

This document defines the **six-layer constitutional stack**: canonical truth, validation, measurement, analysis, governance, and communication. Each layer has a strict boundary. Downstream layers consume upstream outputs; upstream layers MUST NOT perform downstream responsibilities.

```
CAR-1.0 (Canonical)
    ↓
CAV-1.0 (Validation)
    ↓
COR-1.0 · CSR-1.0 · DRA-1.0 (Measurement)
    ↓
Proof Analysis (Analysis)
    ↓
Steward Council / Governance Engine (Governance)
    ↓
Public Documentation (Communication)

Repo Hygiene — operational prerequisite (runs before CAV; not a constitutional layer)
```

## Related artifacts

| Layer | Primary specs / tools |
|-------|----------------------|
| CAR-1.0 | [spec/CAR-1.0-Registry.md](../spec/CAR-1.0-Registry.md), [spec/car-1.0.schema.json](../spec/car-1.0.schema.json), `project-infi/cor-suite/car/car-1.0.json` |
| CAV-1.0 | [spec/CAV-1.0-Validation.md](../spec/CAV-1.0-Validation.md), [spec/cav-validation.schema.json](../spec/cav-validation.schema.json), `project-infi/cor-suite/src/car/validate.ts` |
| COR / CSR / DRA | [spec/COR-1.0-Contract.md](../spec/COR-1.0-Contract.md), [spec/maturity-vector.schema.json](../spec/maturity-vector.schema.json), `project-infi/cor-suite/src/cor/` |
| Proof Analysis | [spec/Proof-Analysis-Spec.md](../spec/Proof-Analysis-Spec.md), [spec/proof-analysis.schema.json](../spec/proof-analysis.schema.json) |
| Governance | [spec/Governance-Engine-Interface.md](../spec/Governance-Engine-Interface.md), [governance/charter/Founder-Independent-Governance-Charter.md](../governance/charter/Founder-Independent-Governance-Charter.md) |
| Communication | [spec/Public-Messaging.md](../spec/Public-Messaging.md) |
| Repo hygiene | [spec/Repo-Hygiene-and-Pipeline.md](../spec/Repo-Hygiene-and-Pipeline.md) |
| Cockpit (read-only) | `skillzmcgee/cor-client/`, Nova Studio `/nova/studio/cor` |

**Release criteria:** [../governance/release-criteria/v1.0.md](../governance/release-criteria/v1.0.md)

**RFC:** [RFC-COR-Suite-1.0.md](../spec/RFC-COR-Suite-1.0.md) (Proposed Standard) · **Consolidated spec:** [COR-Suite-Spec-1.0.md](../spec/COR-Suite-Spec-1.0.md)

---

## 1. Canonical Layer — CAR-1.0

### 1.1 Role

Defines **constitutional truth**. Every canonical object is explicitly registered.

### 1.2 Artifact

**CAR-1.0** — Canonical Artifact Registry (`car/car-1.0.json`).

### 1.3 Responsibility

Each entry includes: `id`, `namespace`, `kind`, `version`, `status`, `authority`, `schemaRef`, `path`, `hash`, lifecycle timestamps, and links (`supersedes`, `supersededBy`, `related`).

**Key property:** All downstream layers read **only from CAR-1.0**, not from ad-hoc repo scans.

### 1.4 Prohibitions

CAR MUST NOT be inferred, overwritten, or extended by measurement, analysis, governance, or communication tooling.

---

## 2. Validation Layer — CAV-1.0

### 2.1 Role

Verifies **canonical integrity** before any measurement.

### 2.2 Artifact

**CAV-1.0** validation report (`out/cav-validation.json`).

### 2.3 Responsibility

- Validate `car-1.0.json` against the CAR schema.
- Verify every registered artifact exists at `path` and matches `hash`.
- Detect duplicate IDs, conflicting lifecycle states, broken provenance links, schema violations.

### 2.4 Output classification

**Blocking:** invalid artifacts, broken provenance, missing required canonical entries, schema violations, hash mismatches.

**Advisory:** deprecated authorities with successors, non-critical verification gaps, high dependency-risk nodes (when paired with DRA), research/draft artifacts.

### 2.5 Prohibitions

CAV MUST NOT make governance decisions or mutate CAR.

Validation is **separate from measurement and governance**.

---

## 3. Measurement Layer — COR-1.0, CSR-1.0, DRA-1.0

### 3.1 Role

Computes **constitutional state** from canonical artifacts.

### 3.2 Inputs

- CAR-1.0 (required)
- CAV-1.0 status (MUST pass blocking checks before COR runs)

### 3.3 Artifacts

| ID | Output | Role |
|----|--------|------|
| **COR-1.0** | State vector | Requirements, specs, impls, verifications, evidence, maturity, structural integrity |
| **CSR-1.0** | Stewardship metrics | Role and governance-participation measurements from governance artifacts in CAR |
| **DRA-1.0** | Dependency-risk metrics | Readiness and dependency-risk from CAR + lineage |

### 3.4 COR-1.0 scope

Reports normative requirements, structural integrity (orphans, missing links, broken lineage), and a deterministic repository state vector — **derived by grouping CAR entries**, not by scanning for canonical paths.

### 3.5 Prohibitions

Measurement MUST NOT:

- infer policy or make decisions
- interpret CAV advisory findings as approve/reject
- score risk in COR (risk belongs in DRA)
- perform counterfactuals (belongs in Analysis)

Output: purely descriptive ledgers conforming to published schemas.

---

## 4. Analysis Layer — Proof Graph / Counterfactuals

### 4.1 Role

Explains **dependencies and counterfactuals** over measured state.

### 4.2 Inputs

CAR-1.0 + COR-1.0 + DRA-1.0 (read-only).

### 4.3 Artifacts

Proof-Analysis results: claims, dependency maps, regression reports, counterfactual scenarios.

### 4.4 Capabilities

- Counterfactual analysis (“what breaks if X disappears?”)
- Dependency impact and blast radius
- Regression detection (implementation, verification, evidence)
- Architectural consequence mapping

### 4.5 Prohibitions

Analysis MUST NOT modify repository state, mutate CAR/COR outputs, invent evidence, or make governance decisions.

---

## 5. Governance Layer — Steward Council

### 5.1 Role

Evaluates measured state against **published criteria** and records decisions.

### 5.2 Inputs

- CAV-1.0 findings (blocking and advisory)
- COR / CSR / DRA measurements
- Proof Analysis outputs
- Release criteria and invariants

### 5.3 Artifacts

**Governance receipts** — registered in CAR as `kind: "governance_receipt"`.

### 5.4 Decisions

Approve · Reject · Require fixes · Escalate · Freeze · Retire

### 5.5 Prohibitions

Governance MUST NOT:

- modify evidence or canonical state directly (only via governed CAR edits)
- perform analysis or infer missing artifacts
- declare correctness without evidence

---

## 6. Communication Layer — Public Documentation

### 6.1 Role

Generates **public documentation and reports** as derived artifacts.

### 6.2 Inputs

Validation, Measurement, Analysis, and Governance outputs.

### 6.3 Artifacts

Release notes, public reports, dashboards (e.g. skillzmcgee Nova COR dashboard), external docs.

### 6.4 Core philosophy

> The repository does not declare its own correctness.
> It exposes the evidence required for independent reviewers to determine it.

**“Don’t trust the repository — query it.”**

### 6.5 Prohibitions

Communication MUST reflect upstream results; it MUST NOT override or reinterpret governance decisions as fact.

---

## Layer dependency rule

If CAR is incomplete → CAV fails → measurement is invalid.
If CAV blocking findings exist → COR MUST NOT run.
If COR is nondeterministic → Analysis is unstable.
If Analysis is unstable → Governance is untrustworthy.
Communication describes the stack; it never alters it.

## Operational prerequisite: Repo Hygiene

Repo hygiene (deterministic artifacts, directory hygiene, canonical paths, CI integration) runs **before** CAV in the pipeline. See [Repo-Hygiene-and-Pipeline.md](../spec/Repo-Hygiene-and-Pipeline.md).
