# Version 1.0 Semantic Drift Casebook

| Field | Value |
|-------|-------|
| Status | Informative |
| Audience | Operators, auditors, researchers |
| Version | 1.0 |

**Normative reference:** [drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md)
**Forensics:** [forensics-guide-1.0.md](./forensics-guide-1.0.md)

---

## Purpose

Worked cases illustrating how semantic drift appears in Version 1.0 systems. Each case maps drift signals to operator action — not to ad-hoc fixes.

---

## Case A — Interpretation shift without code change

**Signal:** Semantic drift vector rises; mechanical drift flat.

**Scenario:** An interpretation artifact's category fields remain valid CAR-1.0, but downstream policy evaluation changes outcome class.

**Diagnosis:**

1. Compare interpretation artifact hash across epochs.
2. Verify transformation contract `T03/evidence-to-interpretation` unchanged.
3. Check whether evidence bundle composition changed (new evidence ID).

**Operator action:** Escalate to steward review if constitutional drift envelope exceeded; otherwise document in forensics log.

**Lesson:** Semantic drift can originate in evidence composition, not only in code.

---

## Case B — Lane merge under frozen canon

**Signal:** Communication topology mutation blocked; governance tick records `guardCanonMutation`.

**Scenario:** Operator attempts lane merge while COMM-CANON is FROZEN.

**Diagnosis:**

1. Confirm `canon_state: FROZEN` on latest communication tick.
2. Identify required amendment path (`AAIS-COMM-Λ-003` or successor).

**Operator action:** Do not bypass guard. File amendment proposal; use read-only topology view.

**Lesson:** Frozen substrate blocks structural communication changes by design.

---

## Case C — Composite drift within envelope

**Signal:** Composite drift 0.04–0.12; all sub-vectors below strict thresholds.

**Scenario:** Normal epoch variance after implementation patch (mechanical + minor semantic noise).

**Diagnosis:**

1. Classify sub-vectors per handbook §2.
2. Confirm DRA report marks epoch as **within envelope**.

**Operator action:** Monitor; no governance escalation. Log for trend analysis.

**Lesson:** Not all drift is actionable — envelopes encode expected variance.

---

## Case D — Constitutional drift (critical)

**Signal:** Invariant violation or proof-graph cycle detected; DRA severity **critical**.

**Scenario:** Receipt references transformation not declared in specification plane.

**Diagnosis:**

1. Run proof-graph acyclicity check.
2. Map receipt transformation ID to [specification/transformation-contracts/](../../specification/transformation-contracts/).
3. Identify orphaned requirement in traceability matrix.

**Operator action:** Halt dependent capabilities; notify steward council; preserve ledger for reproduction.

**Lesson:** Constitutional drift is a stop signal, not a tuning exercise.

---

## Case E — False alarm from stale baseline

**Signal:** High diff against canon markdown; ledger shows version mismatch.

**Scenario:** Local `.runtime/` canon JSON out of sync with sealed `COMM-CANON.md`.

**Diagnosis:**

1. Compare `canon_version` in runtime JSON vs governance artifact.
2. Re-run canon regeneration only if canon is LIVING (never if FROZEN).

**Operator action:** Resync from governance source; do not treat diff as semantic drift until versions align.

**Lesson:** Always verify canon version before interpreting drift diffs.

---

## Using this casebook

| Step | Document |
|------|----------|
| Classify drift type | [drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md) |
| Walk decision tree | [drift-diagnostic-flowchart-1.0.txt](./drift-diagnostic-flowchart-1.0.txt) |
| Hands-on practice | [operator-labs-1.0.md](./operator-labs-1.0.md) |
