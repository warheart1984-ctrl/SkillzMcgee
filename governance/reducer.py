"""Reducer v3 — multi-slice, multi-agent world model."""

from __future__ import annotations

from typing import Any, Callable

from governance.continuity_ledger import ContinuityLedger


SliceReducer = Callable[[dict[str, Any], dict[str, Any]], dict[str, Any]]


class ReducerV3:
    """Deterministic state = reduce(ledger)."""

    def __init__(self) -> None:
        self.slice_reducers: dict[str, SliceReducer] = {
            "slice_math": self.reduce_math,
            "slice_research": self.reduce_research,
            "slice_system": self.reduce_system,
        }

    def reduce(self, ledger: ContinuityLedger) -> dict[str, Any]:
        state: dict[str, Any] = {
            "slices": {},
            "agents": {},
            "system": {"run_count": 0, "last_receipt": None},
        }

        for entry in ledger.all():
            slice_id = entry["slice"]
            agent = entry.get("actor", "skillz")

            reducer = self.slice_reducers.get(slice_id, self.default_reducer)
            state["slices"][slice_id] = reducer(
                state["slices"].get(slice_id, {}),
                entry,
            )

            state["agents"][agent] = {
                "last_action": entry["id"],
                "last_slice": slice_id,
            }

            state["system"]["run_count"] += 1
            state["system"]["last_receipt"] = entry["id"]

        return state

    def default_reducer(self, prev: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any]:
        prev = dict(prev)
        prev["last_output"] = entry["output"]
        prev["last_status"] = entry["status"]
        return prev

    def reduce_math(self, prev: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any]:
        prev = dict(prev)
        prev["last_output"] = entry["output"]
        prev["last_status"] = entry["status"]
        prev["valid"] = isinstance(entry["output"], (int, float))
        return prev

    def reduce_research(self, prev: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any]:
        prev = dict(prev)
        prev["last_output"] = entry["output"]
        prev["last_status"] = entry["status"]
        history = list(prev.get("history", []))
        history.append(entry["id"])
        prev["history"] = history
        return prev

    def reduce_system(self, prev: dict[str, Any], entry: dict[str, Any]) -> dict[str, Any]:
        prev = dict(prev)
        output = entry["output"]
        if isinstance(output, dict):
            prev["health"] = output.get("health", "ok")
            prev["last_run"] = entry.get("id")
        else:
            prev["health"] = str(output)
        return prev
