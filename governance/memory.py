"""Persistent memory store for SkillzMcGee world state."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any


class MemoryStore:
    """Persist and reload reducer-derived state."""

    def __init__(self, path: str = "skillz_memory.json") -> None:
        self.path = path
        self.data: dict[str, Any] = self.load()

    def load(self) -> dict[str, Any]:
        if not os.path.exists(self.path):
            return {}
        with open(self.path, encoding="utf-8") as f:
            return json.load(f)

    def save(self, state: dict[str, Any]) -> None:
        self.data = state
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2, default=str)
