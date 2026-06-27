# GOV-INV-1.0 - COR Suite Constitutional Invariants

**Version:** 1.0
**Status:** Normative
**Scope:** CAR, CAV, COR, PGI, DRA, Proof Analysis, Governance, Communication

---

## 1. Canonical Authority

**GOV-INV-1:** CAR-1.0 is the only source of constitutional truth.

No release decision may rely on unregistered canonical artifacts.

---

## 2. Validation Before Measurement

**GOV-INV-2:** CAV-1.0 validation MUST pass before COR, PGI, DRA, Proof Analysis, or Governance may be treated as release-grade.

Blocking CAV findings MUST stop release approval until a governance receipt records remediation or an explicit override.

---

## 3. Measurement Is Descriptive

**GOV-INV-3:** COR, CSR, and DRA MUST describe state. They MUST NOT issue decisions.

Measurement outputs may inform governance, but they cannot approve, reject, freeze, or retire artifacts.

---

## 4. Analysis Is Explanatory

**GOV-INV-4:** PGI and Proof Analysis MUST explain dependency structure, regressions, and counterfactuals. They MUST NOT mutate canonical state.

---

## 5. Governance Requires Receipts

**GOV-INV-5:** Every governance decision MUST produce a signed governance receipt.

Receipts MUST include:

- steward identity
- decision
- rationale
- evidence references
- invariants enforced
- timestamp
- signature

---

## 6. Communication Is Derivative

**GOV-INV-6:** Public documentation and dashboards MUST derive release posture from governance receipts and validated artifacts.

Communication MUST NOT override CAR, CAV, measurement, analysis, or governance outputs.

---

## 7. Lifecycle Integrity

**GOV-INV-7:** Artifact lifecycle transitions MUST be explicit.

Deprecated artifacts SHOULD identify successors. Retired artifacts MUST remain traceable through CAR links and governance receipts.

---

## 8. Release Approval

**GOV-INV-8:** A release may be approved only when:

- no unaddressed blocking CAV findings exist
- release criteria are satisfied
- critical requirements have implementation and verification coverage
- governance receipts are signed and registered

---

## 9. Investigation Mode

**GOV-INV-9:** Investigation Mode MUST be read-only unless a governed action explicitly creates a receipt.

Inspection may explain state. Mutation requires governance.
