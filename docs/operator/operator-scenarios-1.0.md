# Version 1.0 Operator Scenarios

| Field | Value |
|-------|-------|
| Status | Informative |
| Audience | Operators, Analysts |
| Version | 1.0 |

**Quickstart:** [operator-quickstart-1.0.md](./operator-quickstart-1.0.md)
**Full handbook:** [IM-OH-1.0.md](./IM-OH-1.0.md)
**Forensics guide:** [forensics-guide-1.0.md](./forensics-guide-1.0.md)
**Drift handbook:** [../../spec/drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md)

---

## 1. Purpose

These scenarios teach operators how to use Investigation Mode to inspect, validate, and govern constitutional state in real-world situations.

**Nova Studio route:** `/nova/studio/investigation-mode`

---

## 2. Scenario 1 — Unexpected Drift Spike

**Situation:**
A subsystem shows a sudden increase in drift.

**Operator Actions:**

1. Open Drift Map
2. Inspect envelope deviation
3. Trace lineage to source artifact
4. Review evidence for upstream changes
5. Validate reproducibility
6. Escalate governance decision if deviation is constitutional

**Success Condition:**
Operator identifies whether drift is semantic, mechanical, or constitutional.

**Reference:** [../../spec/drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md) §5

---

## 3. Scenario 2 — Conflicting Interpretations

**Situation:**
Two analysis artifacts disagree.

**Operator Actions:**

1. Compare evidence inputs
2. Inspect interpretation logic
3. Validate canonical state
4. Run counterfactuals
5. Determine which interpretation is semantically correct
6. Document finding and escalate

**Success Condition:**
Operator resolves semantic conflict using evidence.

---

## 4. Scenario 3 — Governance Decision Review

**Situation:**
A governance decision appears inconsistent.

**Operator Actions:**

1. Inspect decision lineage
2. Validate analysis inputs
3. Confirm evidence completeness
4. Check for hidden state
5. Reproduce decision
6. Approve or escalate

**Success Condition:**
Operator confirms decision is evidence-backed and reproducible.

---

## 5. Scenario 4 — Canonical Artifact Corruption

**Situation:**
A canonical artifact fails validation.

**Operator Actions:**

1. Run CAV
2. Inspect provenance anchors
3. Compare against CAR-1.0 schema
4. Identify corruption source
5. Reconstruct from lineage
6. Document incident

**Success Condition:**
Operator restores canonical state without semantic loss.

**Reference:** [../../spec/CAV-1.0-Validation.md](../../spec/CAV-1.0-Validation.md)

---

## 6. Scenario 5 — Counterfactual Governance Simulation

**Situation:**
Stakeholders request "what if" analysis.

**Operator Actions:**

1. Open Counterfactuals
2. Modify evidence or interpretation
3. Observe downstream effects
4. Validate semantic consistency
5. Export findings to governance

**Success Condition:**
Operator produces a traceable, evidence-backed counterfactual.

---

## 7. Status

These scenarios are **informative** and supplement the operator quickstart and Investigation Mode handbook.
