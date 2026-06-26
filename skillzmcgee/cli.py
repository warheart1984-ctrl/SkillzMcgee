"""SkillzMcGee CLI — inspect governance map, receipts, and federation graph."""

from __future__ import annotations

from skillzmcgee.governance.continuity_ledger import iter_receipts
from skillzmcgee.governance.objectives import GOVERNANCE_OBJECTIVES
from skillzmcgee.governance.safe_mode import get_safe_mode
from skillzmcgee.substrations.registry import SUBSTRATIONS_BY_OBJECTIVE


def cli_objectives() -> None:
    print("Governance Objectives:\n")
    for oid, obj in GOVERNANCE_OBJECTIVES.items():
        print(f"{oid}: {obj['name']}")
        print(f"  {obj['description']}\n")


def cli_substrations() -> None:
    print("Substrations by Governance Objective:\n")
    for oid, subs in SUBSTRATIONS_BY_OBJECTIVE.items():
        if not subs:
            continue
        print(f"{oid}:")
        for s in subs:
            runtime_id = s.get("runtime", {}).get("id", "?")
            print(f"  - {runtime_id}")
        print()


def cli_graph() -> None:
    print("Federation Graph (Objectives → Substrations):\n")
    for oid, subs in SUBSTRATIONS_BY_OBJECTIVE.items():
        if not subs:
            continue
        name = GOVERNANCE_OBJECTIVES[oid]["name"]
        print(f"{oid} ({name})")
        for s in subs:
            runtime_id = s.get("runtime", {}).get("id", "?")
            print(f"    └─ {runtime_id}")
        print()


def cli_receipts() -> None:
    print("Substration Receipts:\n")
    found = False
    for r in iter_receipts():
        found = True
        print(f"{r.get('timestamp')} {r.get('substationId', r.get('substrationId'))} {r.get('governanceObjectiveId')}")
        print(f"  policyOutcome: {r.get('policyOutcome')}")
        print(f"  state: {r.get('stateTransitionSummary')}\n")
    if not found:
        print("(no receipts — run a federation tick or constitutional execution first)\n")


def cli_safe_mode() -> None:
    mode, info = get_safe_mode()
    print(f"Current Safe-Mode: {mode} — {info['name']}")
    print(f"  {info['description']}")
    restrictions = info.get("restrictions") or []
    if restrictions:
        print("  Restrictions:")
        for r in restrictions:
            print(f"    - {r}")
    print()
