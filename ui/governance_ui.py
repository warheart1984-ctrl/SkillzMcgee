"""Governance console — receipt chain, state, invariants."""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from governance.continuity_ledger import ContinuityLedger
from governance.diff import deep_diff


@dataclass
class UserRequest:
    slice: str
    input: Any
    actor: str = "skillz"


class GovernanceUI:
    """Minimal governance explorer (CLI stub)."""

    def __init__(self, ledger: ContinuityLedger, state: dict[str, Any]) -> None:
        self.ledger = ledger
        self.state = state
        self._prev_state: dict[str, Any] | None = None

    def get_user_request(self) -> UserRequest | None:
        raw = input("skillz> ").strip()
        if not raw or raw in ("quit", "exit", "q"):
            return None
        if raw.startswith("{"):
            data = json.loads(raw)
            return UserRequest(
                slice=data.get("slice", "slice_custom"),
                input=data.get("input", data),
                actor=data.get("actor", "skillz"),
            )
        parts = raw.split(maxsplit=1)
        slice_id = parts[0] if parts else "slice_custom"
        inp = parts[1] if len(parts) > 1 else raw
        return UserRequest(slice=slice_id, input=inp)

    def update(self, receipt: dict[str, Any], state: dict[str, Any]) -> None:
        self.state = state
        diff = deep_diff(self._prev_state or {}, state) if self._prev_state else {}

        print("\n=== RECEIPT ADDED ===")
        print(f"ID:     {receipt['id']}")
        print(f"Parent: {receipt.get('parent')}")
        print(f"Slice:  {receipt['slice']}")
        print(f"Status: {receipt['status']}")
        if receipt.get("invariants_passed"):
            print(f"Invariants: {receipt['invariants_passed']}")

        print("\n=== STATE ===")
        print(json.dumps(state, indent=2, default=str))

        if diff.get("changed") or diff.get("added"):
            print("\n=== STATE DIFF ===")
            print(json.dumps(diff, indent=2, default=str))

        print("\n=== LAST 5 RECEIPTS ===")
        for r in self.ledger.entries[-5:]:
            print(f"  - {r['id'][:16]}... ({r['slice']})")

        self._prev_state = dict(state)
