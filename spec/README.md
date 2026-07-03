# Continuity OS Specification Suite — Version 1.0

| Field | Value |
|-------|-------|
| Status | Normative |
| Scope | Full Specification Layer |
| Stability | Stable |
| Version | 1.0 |

**Entry point:** [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md)

---

## 1. Overview

The Continuity OS Specification Suite defines the constitutional, semantic, and conformance foundations of the platform.

It is organized into six planes:

1. **Constitutional Baseline**
2. **Specification Layer**
3. **Conformance Layer**
4. **Operator Layer**
5. **Public Layer**
6. **Evolution and Planning**

This README provides a structured overview of the entire suite.

**Master bundle:** [../docs/bundles/master-pdf-textbundle-v1.0.txt](../docs/bundles/master-pdf-textbundle-v1.0.txt)

---

## 2. Constitutional Baseline (Frozen)

These documents define the immutable identity of Version 1.0:

| Document | Role |
|----------|------|
| [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md) | Authoritative map of all constitutional documents |
| [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md) | Immutable CRK-1 core semantics |
| [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md) | Observable-behavior compatibility criteria |
| [constitutional-evolution-guidelines.md](./constitutional-evolution-guidelines.md) | Post-1.0 evolution and amendment governance |
| [constitutional-stability-principle-1.0.md](./constitutional-stability-principle-1.0.md) | Semantics frozen; implementations free |
| [version-1.0-freeze-declaration.md](./version-1.0-freeze-declaration.md) | Formal freeze declaration (2026-06-26) |
| [what-we-froze-and-why-v1.0.md](./what-we-froze-and-why-v1.0.md) | Historical retrospective of the freeze |
| [certification-profile-1.0.md](./certification-profile-1.0.md) | C0–C3 certification levels |
| [certification-checklist-1.0.md](./certification-checklist-1.0.md) | Authoritative certification checklist |
| [governance-charter-1.0.md](./governance-charter-1.0.md) | Governance model and processes |
| [stewardship-mandate-1.0.md](./stewardship-mandate-1.0.md) | Steward responsibilities and obligations |
| [steward-oath-1.0.md](./steward-oath-1.0.md) | Normative steward oath |
| [steward-training-curriculum-1.0.md](./steward-training-curriculum-1.0.md) | Four-module steward curriculum |
| [constitutional-commentary-v1.0.md](./constitutional-commentary-v1.0.md) | Philosophical justification |
| [migration-guide-1.0.md](./migration-guide-1.0.md) | Pre-1.0 migration guide |
| [version-1.1-planning-skeleton.md](./version-1.1-planning-skeleton.md) | Version 1.1 planning framework (draft) |
| [steward-handbook-1.0.md](./steward-handbook-1.0.md) | Steward responsibilities and processes |
| [steward-training-deck-1.0.txt](./steward-training-deck-1.0.txt) | Steward onboarding training deck (text-mode) |
| [amendment-procedure-1.0.md](./amendment-procedure-1.0.md) | Constitutional amendment procedure (→ 2.0) |
| [amendment-gatekeeping-rules-1.0.md](./amendment-gatekeeping-rules-1.0.md) | Amendment justification requirements |
| [glossary-1.0.md](./glossary-1.0.md) | Normative glossary of constitutional terms |
| [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) | Semantic categories and transformation rules |
| [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md) | CTS-1.0 conformance test matrix |
| [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md) | COR Suite standards-track architecture |
| [../docs/architecture/crk-wms-equivalence-table.md](../docs/architecture/crk-wms-equivalence-table.md) | CRK-1 × WMS semantic mapping |
| [../docs/architecture/crk-wms-cross-plane-dependencies.txt](../docs/architecture/crk-wms-cross-plane-dependencies.txt) | Cross-plane dependency graph |

No changes may be made to these documents without creating a **new constitutional version**.

---

## 3. Specification Layer (Normative)

Defines the semantic grammar of the platform:

| Component | Document |
|-----------|----------|
| Canonical Artifact Model (CAR-1.0) | [CAR-1.0-Registry.md](./CAR-1.0-Registry.md) |
| CRK-1 Specification | [../specification/README.md](../specification/README.md) |
| Six-layer stack | [../specification/constitutional-stack-v1.0.md](../specification/constitutional-stack-v1.0.md) |
| Object model & invariants | [../specification/semantic-artifact-types.md](../specification/semantic-artifact-types.md) |
| Proof graph model | [../conformance/proof-graph/README.md](../conformance/proof-graph/README.md) |
| Evidence model | [../conformance/evidence-ledger/README.md](../conformance/evidence-ledger/README.md) |
| Provenance model | [../conformance/provenance-ledger/spec.md](../conformance/provenance-ledger/spec.md) |
| Consolidated COR Suite | [COR-Suite-Spec-1.0.md](./COR-Suite-Spec-1.0.md) |
| Semantic grammar | [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) |
| Constitutional glossary | [glossary-1.0.md](./glossary-1.0.md) |
| Drift analysis handbook | [drift-analysis-handbook-1.0.md](./drift-analysis-handbook-1.0.md) |

These documents define **what the system is**.

### Six constitutional layers

| # | Layer | Document |
|---|-------|----------|
| 1 | Canonical (CAR-1.0) | [CAR-1.0-Registry.md](./CAR-1.0-Registry.md) |
| 2 | Validation (CAV-1.0) | [CAV-1.0-Validation.md](./CAV-1.0-Validation.md) |
| 3 | Measurement | [COR-1.0-Contract.md](./COR-1.0-Contract.md) (+ CSR, DRA) |
| 4 | Analysis | [Proof-Analysis-Spec.md](./Proof-Analysis-Spec.md) |
| 5 | Governance | [Governance-Engine-Interface.md](./Governance-Engine-Interface.md) |
| 6 | Communication | [Public-Messaging.md](./Public-Messaging.md) |

---

## 4. Conformance Layer (Normative)

Defines how correctness is verified:

| Component | Document |
|-----------|----------|
| CTS-1.0 | [../conformance/CTS-1.0/README.md](../conformance/CTS-1.0/README.md) |
| MRI-1.0 | [../conformance/MRI-1.0/README.md](../conformance/MRI-1.0/README.md) |
| PGI | [pgi.schema.json](./pgi.schema.json), [../conformance/proof-graph/](../conformance/proof-graph/) |
| DRA | [../conformance/observability/DRA-1.0/spec.md](../conformance/observability/DRA-1.0/spec.md) |
| Evidence ledger | [../conformance/evidence-ledger/README.md](../conformance/evidence-ledger/README.md) |
| Implementation guide | [../conformance/cor-suite/IMPLEMENTATION.md](../conformance/cor-suite/IMPLEMENTATION.md) |
| Conformance test matrix | [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md) |
| Semantic test suite | [semantic-test-suite-1.0.md](./semantic-test-suite-1.0.md) |

These documents define **how the system is validated**.

---

## 5. Operator Layer (Informative)

Defines how operators interact with constitutional state:

| Document | Role |
|----------|------|
| [../docs/operator/operator-quickstart-1.0.md](../docs/operator/operator-quickstart-1.0.md) | Operator quickstart — Investigation Mode essentials |
| [../docs/operator/IM-OH-1.0.md](../docs/operator/IM-OH-1.0.md) | Investigation Mode Operator Handbook |
| [../docs/operator/operator-scenarios-1.0.md](../docs/operator/operator-scenarios-1.0.md) | Five real-world operator scenarios |
| [../docs/operator/forensics-guide-1.0.md](../docs/operator/forensics-guide-1.0.md) | Constitutional forensics procedures |
| [../docs/deepdives/architecture-deep-dive-v1.0.md](../docs/deepdives/architecture-deep-dive-v1.0.md) | Long-form architecture deep dive |
| [../conformance/certification/auditor-handbook-internal-v1.0.md](../conformance/certification/auditor-handbook-internal-v1.0.md) | Internal auditor protocols |
| [../conformance/certification/external-auditor-handbook-v1.0.md](../conformance/certification/external-auditor-handbook-v1.0.md) | External auditor protocols |
| [../docs/architecture/architecture-poster-v1.0.txt](../docs/architecture/architecture-poster-v1.0.txt) | Architecture poster (text-mode) |
| [steward-handbook-1.0.md](./steward-handbook-1.0.md) | Steward operational handbook |

These documents define **how the system is used** and **who maintains it**.

---

## 6. Public Layer (Informative)

| Document | Role |
|----------|------|
| [../docs/public/landing-page-v1.0.md](../docs/public/landing-page-v1.0.md) | Public website landing page |
| [../docs/public/public-faq-expanded-v1.0.md](../docs/public/public-faq-expanded-v1.0.md) | Expanded public FAQ |
| [../docs/public/founders-letter-v1.0.md](../docs/public/founders-letter-v1.0.md) | Founders' letter |
| [../docs/public/founders-log-entry-001.md](../docs/public/founders-log-entry-001.md) | Founder's Log — Entry #001 |
| [../docs/public/version-1.0-press-bundle.txt](../docs/public/version-1.0-press-bundle.txt) | Press-ready bundle |
| [../docs/public/civilization-scale-builder/](../docs/public/civilization-scale-builder/) | Civilization-Scale Builder deliverables |
| [../docs/whitepaper/continuity-os-v1.0.md](../docs/whitepaper/continuity-os-v1.0.md) | Public v1.0 narrative |

These documents define **how the platform is communicated**. They must remain downstream from canonical state.

---

## 7. Evolution and Planning

| Document | Role |
|----------|------|
| [rfc-zero-v1.1.md](./rfc-zero-v1.1.md) | RFC-0 — Version 1.1 direction (draft) |
| [version-1.1-planning-skeleton.md](./version-1.1-planning-skeleton.md) | Version 1.1 planning framework |
| [version-1.0-to-1.1-transition-brief.md](./version-1.0-to-1.1-transition-brief.md) | Post-freeze transition guidance |

---

## 8. Versioning and Governance

Version 1.0 is the first constitutional freeze.

All future versions must follow:

- [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md)
- [constitutional-evolution-guidelines.md](./constitutional-evolution-guidelines.md)
- [governance-charter-1.0.md](./governance-charter-1.0.md)

Implementations may evolve freely as long as constitutional semantics remain intact.

**Release criteria:** [../governance/release-criteria/v1.0.md](../governance/release-criteria/v1.0.md)

---

## 7. JSON Schemas

- [car-1.0.schema.json](./car-1.0.schema.json)
- [cav-validation.schema.json](./cav-validation.schema.json)
- [cor-state-vector.schema.json](./cor-state-vector.schema.json)
- [proof-analysis.schema.json](./proof-analysis.schema.json)
- [governance-receipt.schema.json](./governance-receipt.schema.json)
- [pgi.schema.json](./pgi.schema.json)
- [dra-report.schema.json](./dra-report.schema.json)
- [maturity-vector.schema.json](./maturity-vector.schema.json)
- [repo-hygiene-status.schema.json](./repo-hygiene-status.schema.json)

---

## 10. Workflow Modeling Canvas (CMS-1.0)

Evidence-chain consulting methodology — separate from COR Suite constitutional stack, bridged via CRK-1 × WMS equivalence.

| Document | Description |
|----------|-------------|
| [../workflow-modeling/README.md](../workflow-modeling/README.md) | WMS-1.0 top-level suite |
| [workflow-modeling-canvas/README.md](./workflow-modeling-canvas/README.md) | Canvas v1.0 index |
| [workflow-modeling-canvas/CMS-1.0.md](./workflow-modeling-canvas/CMS-1.0.md) | Consulting Methodology Specification |

---

## 11. Implementation

| Repository / path | Role |
|-------------------|------|
| **project-infi/cor-suite** | CAR, CAV, COR, governance pipeline |
| **skillzmcgee/cor-client** | Read-only cockpit + Nova dashboard |
| **skillzmcgee/** (this repo) | MRI-1.0 reference, conformance, Nova Studio |

See [../conformance/cor-suite/IMPLEMENTATION.md](../conformance/cor-suite/IMPLEMENTATION.md).

**Operational:** [Repo-Hygiene-and-Pipeline.md](./Repo-Hygiene-and-Pipeline.md)

---

## 12. Status

This README is **normative** and **stable** for Version 1.0.
