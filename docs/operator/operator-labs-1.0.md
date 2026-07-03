# Version 1.0 Operator Labs

| Field | Value |
|-------|-------|
| Status | Informative |
| Audience | Operators-in-training |
| Version | 1.0 |

**Prerequisites:** [operator-quickstart-1.0.md](./operator-quickstart-1.0.md) · [IM-OH-1.0.md](./IM-OH-1.0.md)

---

## Purpose

Hands-on exercises for Investigation Mode. Each lab is read-only against constitutional state — operators inspect; they do not amend the baseline.

**Runtime:** `npm run nova-studio` → `/nova/studio/investigation-mode`

---

## Lab 1 — Receipt lineage

**Goal:** Trace a decision from receipt to proof-graph node.

1. Open Investigation Mode and load the latest governance receipt.
2. Follow lineage to its parent artifact and transformation contract.
3. Record: artifact category, contract ID, and whether provenance is complete.

**Pass:** Full chain to a CAR-1.0 canonical artifact with no orphaned edges.

---

## Lab 2 — Drift classification

**Goal:** Classify drift using the constitutional signal model.

1. Open the drift panel (or continuity strip) for the active epoch.
2. Identify mechanical vs semantic vs constitutional drift per [drift-analysis-handbook-1.0.md](../../spec/drift-analysis-handbook-1.0.md).
3. Compare composite drift to the active envelope threshold.

**Pass:** Correct classification with handbook citation; no false constitutional alerts.

---

## Lab 3 — Communication canon inspection

**Goal:** Verify COMM-CANON state and ledger alignment.

1. Open the Communication Canon viewer.
2. Note `canon_state` (LIVING vs FROZEN) and `canon_version`.
3. Cross-check the latest ledger tick for matching `canon_state` / `canon_version` fields.

**Pass:** UI state matches ledger metadata; if FROZEN, regeneration controls are disabled.

---

## Lab 4 — Forensic replay

**Goal:** Reconstruct an operator scenario from evidence.

1. Pick one scenario from [operator-scenarios-1.0.md](./operator-scenarios-1.0.md).
2. Using [forensics-guide-1.0.md](./forensics-guide-1.0.md), replay the evidence chain without modifying state.
3. Document gaps (missing receipts, broken provenance).

**Pass:** Written forensics summary with artifact IDs and gap list.

---

## Lab 5 — Steward gate (observation only)

**Goal:** Understand what stewards may change vs what operators may only inspect.

1. Read [steward-handbook-1.0.md](../../spec/steward-handbook-1.0.md) § operator boundary.
2. List three actions that require steward council vs operator read access.

**Pass:** Correct boundary list; no attempted constitutional mutation during labs.

---

## Certification path

Complete all five labs, then sit the [Steward Certification Exam](../../conformance/certification/steward-exam.md) if pursuing steward credentials.
