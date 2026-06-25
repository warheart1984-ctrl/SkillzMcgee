"""In-memory state accumulator (v0.2 foundation)."""

from __future__ import annotations

from typing import Any


class StateAccumulator:
    """Apply receipts to live in-memory slice state."""

    def __init__(self) -> None:
        self.state: dict[str, dict[str, Any]] = {}

    def apply(self, entry: dict[str, Any]) -> dict[str, Any]:
        slice_id = entry["slice"]
        if slice_id not in self.state:
            self.state[slice_id] = {}
        self.state[slice_id]["last_output"] = entry["output"]
        self.state[slice_id]["last_status"] = entry["status"]
        return self.state[slice_id]

    def get(self, slice_id: str) -> dict[str, Any]:
        return self.state.get(slice_id, {})
