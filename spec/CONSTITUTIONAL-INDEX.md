# Constitutional Specification Index â€” Version 1.0

| Field | Value |
|-------|-------|
| Status | Normative |
| Scope | CRK-1 Core |
| Stability | Frozen |
| Version | 1.0 |

---

## 1. Purpose

This index provides the authoritative map of all constitutional-layer documents that define the Version 1.0 Continuity OS platform.

It identifies the normative specifications, their relationships, and their roles within the constitutional baseline.

This index is the **entry point** for all implementers, auditors, and future version stewards.

**Suite overview:** [README.md](./README.md)
**Master bundle:** [../docs/bundles/master-pdf-textbundle-v1.0.txt](../docs/bundles/master-pdf-textbundle-v1.0.txt)

---

## 2. Constitutional Baseline Documents (Frozen)

These documents define the immutable core of Version 1.0:

| Document | Purpose |
|----------|---------|
| [constitutional-baseline-1.0.md](./constitutional-baseline-1.0.md) | Defines the immutable constitutional baseline |
| [constitutional-compatibility-1.0.md](./constitutional-compatibility-1.0.md) | Defines compatibility rules for future implementations |
| [constitutional-evolution-guidelines.md](./constitutional-evolution-guidelines.md) | Governs how the platform evolves post-1.0 |
| [constitutional-stability-principle-1.0.md](./constitutional-stability-principle-1.0.md) | Final governing rule â€” semantics frozen, implementations free |
| [version-1.0-freeze-declaration.md](./version-1.0-freeze-declaration.md) | Formal freeze declaration (2026-06-26) |
| [what-we-froze-and-why-v1.0.md](./what-we-froze-and-why-v1.0.md) | Historical retrospective of the freeze |
| [certification-profile-1.0.md](./certification-profile-1.0.md) | Defines C0â€“C3 certification levels and test requirements |
| [certification-checklist-1.0.md](./certification-checklist-1.0.md) | Authoritative certification checklist for auditors |
| [governance-charter-1.0.md](./governance-charter-1.0.md) | Governance model for baseline stewardship and evolution |
| [stewardship-mandate-1.0.md](./stewardship-mandate-1.0.md) | Steward responsibilities and obligations |
| [steward-oath-1.0.md](./steward-oath-1.0.md) | Normative oath for constitutional stewards |
| [migration-guide-1.0.md](./migration-guide-1.0.md) | Migration path for pre-1.0 implementations |
| [steward-handbook-1.0.md](./steward-handbook-1.0.md) | Steward responsibilities, processes, and conduct |
| [steward-training-deck-1.0.txt](./steward-training-deck-1.0.txt) | Steward onboarding training deck (text-mode) |
| [steward-training-curriculum-1.0.md](./steward-training-curriculum-1.0.md) | Four-module steward certification curriculum |
| [amendment-procedure-1.0.md](./amendment-procedure-1.0.md) | Formal procedure for constitutional amendments (â†’ 2.0) |
| [amendment-gatekeeping-rules-1.0.md](./amendment-gatekeeping-rules-1.0.md) | Justification requirements for Version 2.0 amendments |
| [constitutional-commentary-v1.0.md](./constitutional-commentary-v1.0.md) | Philosophical justification (Federalist-style) |
| [glossary-1.0.md](./glossary-1.0.md) | Normative glossary of constitutional terms |
| [RFC-COR-Suite-1.0.md](./RFC-COR-Suite-1.0.md) | Canonical runtime specification for COR, CAV, CSR, DRA, PGI |
| [../docs/architecture/crk-wms-equivalence-table.md](../docs/architecture/crk-wms-equivalence-table.md) | Semantic mapping between CRK-1 and WMS |
| [../docs/architecture/crk-wms-cross-plane-dependencies.txt](../docs/architecture/crk-wms-cross-plane-dependencies.txt) | Cross-plane dependency graph |

These documents collectively define the **constitutional identity** of the platform.

---

## 3. Specification Layer Documents (Normative)

| Document | Purpose |
|----------|---------|
| [CAR-1.0-Registry.md](./CAR-1.0-Registry.md) | Canonical Artifact Model (CAR-1.0) |
| [../specification/README.md](../specification/README.md) | CRK-1 Specification â€” invariants, object model, required behaviors |
| [../specification/constitutional-stack-v1.0.md](../specification/constitutional-stack-v1.0.md) | Six-layer stack contract (Authority â†’ Communication) |
| [../specification/semantic-artifact-types.md](../specification/semantic-artifact-types.md) | Semantic artifact categories and boundaries |
| [Proof-Analysis-Spec.md](./Proof-Analysis-Spec.md) | Proof graph analysis layer |
| [../conformance/proof-graph/README.md](../conformance/proof-graph/README.md) | Proof graph model â€” lineage, provenance, monotonicity |
| [../conformance/evidence-ledger/README.md](../conformance/evidence-ledger/README.md) | Evidence model â€” categories and canonical fields |
| [../conformance/provenance-ledger/spec.md](../conformance/provenance-ledger/spec.md) | Provenance model â€” cryptographic anchoring and reproducibility |
| [COR-Suite-Spec-1.0.md](./COR-Suite-Spec-1.0.md) | Consolidated COR Suite specification |
| [semantic-grammar-1.0.md](./semantic-grammar-1.0.md) | Semantic categories, invariants, and transformation rules |
| [glossary-1.0.md](./glossary-1.0.md) | Normative glossary of constitutional terms |
| [drift-analysis-handbook-1.0.md](./drift-analysis-handbook-1.0.md) | Drift semantics, classification, and analysis procedures |

These documents define the **semantic grammar** of the constitutional system.

---

## 4. Conformance Layer Documents (Normative)

| Document | Purpose |
|----------|---------|
| [../conformance/CTS-1.0/README.md](../conformance/CTS-1.0/README.md) | Conformance Test Suite (CTS-1.0) |
| [../conformance/MRI-1.0/README.md](../conformance/MRI-1.0/README.md) | Minimal Reference Implementation (MRI-1.0) |
| [../conformance/proof-graph/index.schema.json](../conformance/proof-graph/index.schema.json) | Provenance Graph Interface (PGI) â€” schema |
| [pgi.schema.json](./pgi.schema.json) | PGI specification schema |
| [../conformance/observability/DRA-1.0/spec.md](../conformance/observability/DRA-1.0/spec.md) | Drift Analysis Engine (DRA) specification |
| [../conformance/evidence-ledger/README.md](../conformance/evidence-ledger/README.md) | Evidence ledger â€” canonical evidence storage |
| [CAV-1.0-Validation.md](./CAV-1.0-Validation.md) | Canonical artifact validation |
| [../conformance/cor-suite/IMPLEMENTATION.md](../conformance/cor-suite/IMPLEMENTATION.md) | Reference implementation and pipeline integration |
| [conformance-test-matrix-1.0.md](./conformance-test-matrix-1.0.md) | CTS-1.0 coverage matrix â€” requirement â†’ test ID â†’ evidence |
| [semantic-test-suite-1.0.md](./semantic-test-suite-1.0.md) | Semantic correctness validation (SEM-* tests) |

These documents define how constitutional behavior is **verified**.

---

## 5. Operator Layer Documents (Informative)

| Document | Purpose |
|----------|---------|
| [../docs/operator/operator-quickstart-1.0.md](../docs/operator/operator-quickstart-1.0.md) | Operator quickstart â€” Investigation Mode essentials |
| [../docs/operator/IM-OH-1.0.md](../docs/operator/IM-OH-1.0.md) | Investigation Mode Operator Handbook |
| [../docs/operator/operator-scenarios-1.0.md](../docs/operator/operator-scenarios-1.0.md) | Five real-world operator scenarios |
| [../docs/operator/operator-labs-1.0.md](../docs/operator/operator-labs-1.0.md) | Hands-on Investigation Mode labs |
| [../docs/operator/semantic-drift-casebook-1.0.md](../docs/operator/semantic-drift-casebook-1.0.md) | Worked semantic drift cases |
| [../docs/operator/drift-diagnostic-flowchart-1.0.txt](../docs/operator/drift-diagnostic-flowchart-1.0.txt) | Drift diagnostic decision flowchart |
| [../docs/operator/forensics-guide-1.0.md](../docs/operator/forensics-guide-1.0.md) | Constitutional forensics procedures |
| [../conformance/certification/steward-exam.md](../conformance/certification/steward-exam.md) | Steward certification exam (operator track) |
| [../conformance/certification/auditor-handbook-internal-v1.0.md](../conformance/certification/auditor-handbook-internal-v1.0.md) | Internal auditor protocols |
| [../conformance/certification/external-auditor-handbook-v1.0.md](../conformance/certification/external-auditor-handbook-v1.0.md) | External auditor protocols |
| [../docs/deepdives/architecture-deep-dive-v1.0.md](../docs/deepdives/architecture-deep-dive-v1.0.md) | Long-form architecture deep dive |
| [../docs/architecture/architecture-poster-v1.0.txt](../docs/architecture/architecture-poster-v1.0.txt) | High-level architecture poster (text-mode) |

These documents define how operators **interact** with constitutional state.

---

## 6. Public Layer Documents (Informative)

| Document | Purpose |
|----------|---------|
| [../docs/public/landing-page-v1.0.md](../docs/public/landing-page-v1.0.md) | Public website landing page |
| [../docs/public/public-faq-expanded-v1.0.md](../docs/public/public-faq-expanded-v1.0.md) | Expanded public FAQ (10 questions) |
| [../docs/public/founders-letter-v1.0.md](../docs/public/founders-letter-v1.0.md) | Founders' letter on the Version 1.0 freeze |
| [../docs/public/founders-log-entry-001.md](../docs/public/founders-log-entry-001.md) | Founder's Log â€” Entry #001 (2026-06-26) |
| [../docs/public/version-1.0-press-bundle.txt](../docs/public/version-1.0-press-bundle.txt) | Press-ready summary bundle |
| [../docs/public/civilization-scale-builder/definition.md](../docs/public/civilization-scale-builder/definition.md) | Civilization-Scale Builder definition |
| [../docs/public/civilization-scale-builder/manifesto.md](../docs/public/civilization-scale-builder/manifesto.md) | Civilization-Scale Builders manifesto |
| [../docs/public/civilization-scale-builder/classification-framework.md](../docs/public/civilization-scale-builder/classification-framework.md) | Operational taxonomy |
| [../docs/public/civilization-scale-builder/criteria.md](../docs/public/civilization-scale-builder/criteria.md) | Pass/fail designation checklist |
| [../docs/public/civilization-scale-builder/essay.md](../docs/public/civilization-scale-builder/essay.md) | Publishable narrative essay |
| [../docs/whitepaper/continuity-os-v1.0.md](../docs/whitepaper/continuity-os-v1.0.md) | Public operator and architecture narrative |

These documents define how the platform is **communicated** to the public. They must remain downstream from canonical state.

---

## 7. Evolution and Planning Documents

| Document | Purpose |
|----------|---------|
| [rfc-zero-v1.1.md](./rfc-zero-v1.1.md) | RFC-0 â€” Version 1.1 direction setting (draft) |
| [version-1.1-planning-skeleton.md](./version-1.1-planning-skeleton.md) | Planning framework for post-1.0 capability expansion |
| [version-1.0-to-1.1-transition-brief.md](./version-1.0-to-1.1-transition-brief.md) | Guidance for post-freeze evolution to 1.1 |

These documents govern **capability expansion** without constitutional amendment.

---

## 8. Document Relationships

```
CONSTITUTIONAL-INDEX.md (this document)
        â”‚
        â”œâ”€â”€ Baseline (Â§2) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ platform identity, frozen
        â”‚       â””â”€â”€ stability Â· freeze Â· compatibility Â· charter Â· stewardship
        â”‚
        â”œâ”€â”€ Specification (Â§3) â”€â”€â”€â”€ semantic grammar (CAR, CRK-1, proof graph)
        â”‚
        â”œâ”€â”€ Conformance (Â§4) â”€â”€â”€â”€â”€â”€ verification (CTS, MRI, PGI, DRA, SEM)
        â”‚
        â”œâ”€â”€ Operator (Â§5) â”€â”€â”€â”€â”€â”€â”€â”€â”€ inspection, forensics, scenarios
        â”‚
        â”œâ”€â”€ Public (Â§6) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ messaging, FAQ, founders, press
        â”‚
        â””â”€â”€ Evolution (Â§7) â”€â”€â”€â”€â”€â”€â”€â”€ RFC-0, 1.1 planning, transition brief
```

**Cross-plane bridge:** [crk-wms-equivalence-table.md](../docs/architecture/crk-wms-equivalence-table.md) unifies runtime (CRK-1) and workflow (WMS-1.0) semantics.

---

## 9. Status

This index is **frozen** for Version 1.0.

All future versions must maintain a clear mapping to this index or declare a **new constitutional lineage**.

**Effective freeze date:** 2026-06-26 â€” [version-1.0-freeze-declaration.md](./version-1.0-freeze-declaration.md)
