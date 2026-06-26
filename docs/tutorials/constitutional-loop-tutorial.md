# CRK-1 Constitutional Loop — Interactive Tutorial (Specification)

**Authority:** CRK-1 Public Documentation  
**Status:** Tutorial module spec  
**Interactive build:** [constitutional-loop-tutorial.html](./constitutional-loop-tutorial.html)  
**Runtime demo:** `npm run nova-studio` → http://localhost:8787

Step-by-step interactive walkthrough for the website or docs. Each module maps to transformation contracts T01–T12.

---

## Module 1 — Introduction

**Goal:** Understand the purpose of the constitutional loop.

**Interaction:** Click to reveal each of the twelve stages on a horizontal timeline.

**Explanation:**  
“The constitutional loop ensures every intelligent action is governed, traceable, and reproducible. Each stage produces exactly one semantic artifact (CA-1.0).”

---

## Module 2 — Stage 1: Decision (T01)

**User action:** Click **Generate Decision**

**System:** Creates a `DecisionObject` with `id`, `actor`, `payload`, `timestamp`.

**Explanation:** “Every action begins with a decision.”

**Contract:** [decision-to-outcome.md](../../specification/transformation-contracts/decision-to-outcome.md)

---

## Module 3 — Stage 2: Outcome (T02)

**User action:** Click **Produce Outcome**

**System:** Shows `OutcomeObject` linked via `decision_id`.

**Explanation:** “Decisions must produce outcomes — no silent actions (R001).”

---

## Module 4 — Stage 3: Evidence (T03)

**User action:** Click **Generate Evidence**

**System:** Shows `EvidenceObject` derived from outcome.

**Explanation:** “Outcomes must be evidenced (R002).”

---

## Module 5 — Stage 4: Interpretation (T04)

**User action:** Choose frames (e.g., safety, ethics, performance)

**System:** Shows `InterpretationObject` with `frames_used[]`.

**Explanation:** “Interpretations must be multi-frame (R020).”

---

## Module 6 — Stages 5–7: Policy & Governance (T05–T07)

**User action:** Step through **Policy Evaluation** → **Policy Outcome** → **Governance Decision**

**System:** Shows `PolicyEvaluationObject`, `PolicyOutcomeObject`, `GovernanceDecisionObject`.

**Explanation:** “Governance evaluates interpretations and issues explicit decisions (R042).”

---

## Module 7 — Stages 8–9: Execution (T08–T09)

**User action:** Click **Execute Plan**

**System:** Shows `ExecutionPlanObject` → `RuntimeStateTransitionObject`.

**Explanation:** “Governance decisions become deterministic actions (R040).”

---

## Module 8 — Stage 10: Receipt (T10)

**User action:** Click **Generate Receipt**

**System:** Shows `GovernanceReceipt` with `invariant_block`, `evidence_block`, `traceability_block`.

**Explanation:** “Every transition is cryptographically recorded (REC-HDR-1.0).”

---

## Module 9 — Stages 11–12: Provenance & Drift (T11–T12)

**User action:** Click **Update Provenance**

**System:** Shows `ProvenanceEntry`, `LineageNode`, `DriftEnvelopeUpdate` with CE/SE bars rising.

**Explanation:** “History is immutable (R030). Drift is monotonic (R041).”

---

## Module 10 — Replay

**User action:** Click **Replay Loop**

**System:** Reconstructs the entire artifact chain from ledger snapshot.

**Explanation:** “Continuity OS is fully reproducible (R004, R025).”

---

## Completion criteria

Learner has:

- [ ] Generated all twelve artifact types
- [ ] Selected at least two interpretation frames
- [ ] Viewed receipt blocks
- [ ] Observed drift monotonicity
- [ ] Completed one full replay

## Next steps

- [Steward curriculum](../../conformance/certification/steward-curriculum.md)
- [FAQ](../launch-kit/FAQ.md)
- [Launch deck](../launch-kit/LAUNCH_DECK.md)
