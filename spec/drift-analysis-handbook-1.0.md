# Version 1.0 Drift Analysis Handbook

| Field | Value |
|-------|-------|
| Status | Normative |
| Scope | Drift Semantics & Analysis |
| Stability | Frozen |
| Version | 1.0 |

**Index:** [CONSTITUTIONAL-INDEX.md](./CONSTITUTIONAL-INDEX.md)
**DRA specification:** [../conformance/observability/DRA-1.0/spec.md](../conformance/observability/DRA-1.0/spec.md)
**Semantic grammar:** [semantic-grammar-1.0.md](./semantic-grammar-1.0.md)
**Forensics guide:** [../docs/operator/forensics-guide-1.0.md](../docs/operator/forensics-guide-1.0.md)

---

## 1. Purpose

This handbook defines the semantics, procedures, and interpretation rules for drift analysis in Version 1.0.

Drift is a **constitutional signal** â€” not a bug.

---

## 2. Drift Types

### 2.1 Mechanical Drift

Caused by:

- implementation changes
- performance variance
- nondeterministic subsystems

### 2.2 Semantic Drift

Caused by:

- changes in meaning
- changes in interpretation
- changes in evidence relevance

### 2.3 Constitutional Drift

Caused by:

- invariant violations
- category drift
- proof graph corruption
- reproducibility failure

**Constitutional drift requires immediate escalation.**

---

## 3. Drift Envelope Semantics

A drift envelope defines:

- expected variance
- semantic tolerance
- constitutional boundaries

Envelopes must be:

- deterministic
- reproducible
- evidence-backed

**See also:** [../conformance/observability/DRA-1.0/spec.md](../conformance/observability/DRA-1.0/spec.md)

---

## 4. Drift Analysis Procedure

| Step | Action |
|------|--------|
| **Detect** | Identify deviation from envelope |
| **Classify** | Mechanical â†’ Semantic â†’ Constitutional |
| **Trace** | Use lineage to locate root cause |
| **Validate** | Confirm evidence and reproducibility |
| **Decide** | Governance decision if constitutional |
| **Document** | Produce drift report and receipts |

---

## 5. Drift Interpretation Rules

| Condition | Classification |
|-----------|----------------|
| Drift without lineage change | Mechanical |
| Drift with interpretation change | Semantic |
| Drift with invariant violation | Constitutional |
| Drift with reproducibility failure | Constitutional |
| Drift with missing evidence | Constitutional |

---

## 6. Status

This handbook is **normative** and **required** for certification.

All C2+ certification levels must demonstrate correct drift classification and envelope computation per this handbook.
