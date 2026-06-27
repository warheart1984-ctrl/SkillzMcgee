# AAIS-COMM-Λ-002 — Amendment: Continuity Budgets & Spec Lanes

**Document ID:** AAIS-COMM-Λ-002
**Version:** 1.0.0
**Classification:** Amendment to AAIS-COMM-Λ-001
**Status:** PENDING OPERATOR RATIFICATION
**Scope:** Communication Governance Layer
**Author:** Jon Halstead

## §0 — PURPOSE

This amendment introduces:

- **Continuity Budgets** — bounded drift-spend per lane
- **Spec Lanes** — lanes restricted to categories A/B/C only
- **Automatic Rerouting** — human/implementation messages auto-redirected
- **Budget Enforcement** — session-level drift containment
- **Version Binding** — lanes must declare which constitution version they bind to

## §1 — CONTINUITY BUDGETS

Each lane MUST declare `continuity_budget` with `max_composite`, `session_budget`, `session_spent`, and `reset_policy`.

**Invariant B-1:** If `drift_vector.composite > max_composite` → Immediate Containment Epoch. If `session_spent > session_budget` → Containment Epoch. All budget updates MUST be anchored as `communicationBudgetTick`.

## §2 — SPEC LANES

**Invariant S-1:** Spec lanes declare `human_bandwidth: "none"` and categories normative/architectural/methodological only.

**Invariant S-2:** Out-of-corridor messages MUST reroute to sibling lane with `communicationRerouteTick`.

## §3 — DRIFT-AWARE REPLY GENERATION

**Invariant R-1/R-2:** Project composite drift before reply generation; block if thresholds exceeded.

## §4 — VERSION BINDING

Each lane declares `comm_constitution_version`. MAJOR changes require recertification and `communicationRecertificationTick`.

## §5 — RATIFICATION

Upon Operator approval, AAIS-COMM-Λ-002 becomes binding for all lanes declaring version ≥ 1.0.0.

**Runtime:** `nova-studio/server/runtime/communicationEnforcement.mjs`
