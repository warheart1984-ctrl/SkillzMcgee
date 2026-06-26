"""Governance console — receipt chain, state, invariants, cosmic timeline."""

from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from pathlib import Path
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

    def __init__(
        self,
        ledger: ContinuityLedger,
        state: dict[str, Any],
        cosmic_path: str | Path | None = None,
    ) -> None:
        self.ledger = ledger
        self.state = state
        self._prev_state: dict[str, Any] | None = None
        self.cosmic_path = Path(cosmic_path) if cosmic_path else Path("skillz_cosmic.json")

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

        self.render_cosmic_timeline()

        self._prev_state = dict(state)

    def render_cosmic_timeline(self) -> None:
        """Cosmic timeline panel — read-model from federation tick output."""
        if not self.cosmic_path.exists():
            return

        try:
            with open(self.cosmic_path, encoding="utf-8") as f:
                cosmic = json.load(f)
        except (json.JSONDecodeError, OSError):
            return

        timeline = cosmic.get("timeline") or []
        tick = cosmic.get("tickResult") or {}

        print("\n=== COSMIC TIMELINE ===")
        if tick:
            print(f"Needs: {tick.get('needCount', 0)} | Tasks: {tick.get('taskCount', 0)}")
            fold = cosmic.get("fold") or {}
            if fold.get("fingerprint"):
                print(f"AS-Ω fingerprint: {fold['fingerprint'][:24]}...")
            if "globalRootValid" in fold:
                print(f"Global continuity valid: {fold['globalRootValid']}")

        if not timeline:
            print("  (no cosmic events yet)")
            return

        for line in timeline[-12:]:
            print(f"  · {line}")

    def render_organism_layers(self, repo_root: str | Path | None = None) -> None:
        """Organism layer diagram — includes LAW / GOVERNANCE binding substrate."""
        root = Path(repo_root) if repo_root else Path(__file__).resolve().parent.parent
        script = root / "scripts" / "print_layers.mjs"
        if not script.exists():
            return
        result = subprocess.run(
            ["node", str(script)],
            cwd=str(root),
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode == 0 and result.stdout.strip():
            print(result.stdout)
