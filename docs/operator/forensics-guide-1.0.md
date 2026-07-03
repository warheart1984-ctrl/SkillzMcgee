# Version 1.0 Forensics Guide

| Field | Value |
|-------|-------|
| Status | Informative |
| Audience | Operators, Investigators |
| Version | 1.0 |

**Quickstart:** [operator-quickstart-1.0.md](./operator-quickstart-1.0.md)
**Scenarios:** [operator-scenarios-1.0.md](./operator-scenarios-1.0.md)
**Drift handbook:** [../../spec/drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md)
**Index:** [../../spec/CONSTITUTIONAL-INDEX.md](../../spec/CONSTITUTIONAL-INDEX.md)

---

## 1. Purpose

This guide teaches operators how to perform constitutional forensics — the investigation of lineage, drift, evidence, and reproducibility.

---

## 2. Forensic Principles

1. Nothing is trusted without evidence
2. Lineage is the ground truth
3. Canonical artifacts are the source of authority
4. Reproducibility is the final arbiter
5. Hidden state is unconstitutional

---

## 3. Forensic Tools

### 3.1 Lineage Explorer

- Trace upstream/downstream dependencies
- Identify semantic breakpoints
- Detect orphan nodes

**See:** [../../conformance/proof-graph/README.md](../../conformance/proof-graph/README.md)

### 3.2 Drift Map

- Visualize drift envelopes
- Detect semantic vs mechanical drift

**See:** [../../spec/drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md)

### 3.3 Evidence Ledger

- Inspect evidence completeness
- Validate provenance

**See:** [../../conformance/evidence-ledger/README.md](../../conformance/evidence-ledger/README.md)

### 3.4 Counterfactual Engine

- Test alternative interpretations
- Validate governance decisions

---

## 4. Forensic Procedures

### 4.1 Lineage Reconstruction

1. Identify corrupted or suspicious artifact
2. Trace lineage backward
3. Validate each transformation
4. Reconstruct canonical state

### 4.2 Drift Diagnosis

1. Identify drift spike
2. Compare envelope vs actual
3. Determine semantic vs mechanical drift
4. Document findings

**Reference:** [../../spec/drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md) §4

### 4.3 Governance Audit

1. Inspect decision lineage
2. Validate evidence
3. Confirm reproducibility
4. Approve or escalate

---

## 5. Forensic Anti-Patterns

Operators must **not**:

- trust unanchored artifacts
- accept unexplained drift
- rely on intuition
- bypass lineage
- modify canonical state

---

## 6. Status

This guide is **informative** and supplements the Investigation Mode Operator Handbook.
