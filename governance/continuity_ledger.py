"""Append-only Merkle-linked continuity ledger."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Iterator

from governance.merkle import merkle_hash, merkle_root


class ContinuityLedger:
    """Immutable, hashed, replayable continuity chain."""

    def __init__(self, path: str | None = None) -> None:
        self.path = path
        self.entries: list[dict[str, Any]] = []
        if path and os.path.exists(path):
            self._load()

    def _load(self) -> None:
        with open(self.path, encoding="utf-8") as f:
            data = json.load(f)
        self.entries = data if isinstance(data, list) else data.get("entries", [])

    def save(self) -> None:
        if not self.path:
            return
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump({"entries": self.entries, "merkle_root": self.root()}, f, indent=2)

    def all(self) -> Iterator[dict[str, Any]]:
        yield from self.entries

    def __len__(self) -> int:
        return len(self.entries)

    def last(self) -> dict[str, Any] | None:
        return self.entries[-1] if self.entries else None

    def root(self) -> str | None:
        ids = [e["id"] for e in self.entries if "id" in e]
        return merkle_root(ids)

    def hash(self, entry: dict[str, Any]) -> str:
        return merkle_hash(entry)

    def append(self, entry: dict[str, Any]) -> str:
        """Append receipt with parent linking and Merkle id."""
        parent = self.entries[-1]["id"] if self.entries else None
        entry["parent"] = parent
        entry_id = self.hash(entry)
        entry["id"] = entry_id
        entry["merkle"] = {"self": entry_id, "parent": parent}
        self.entries.append(entry)
        return entry_id

    def verify_chain(self) -> tuple[bool, list[str]]:
        """Verify append-only Merkle integrity."""
        errors: list[str] = []
        prev_id: str | None = None
        for i, entry in enumerate(self.entries):
            if entry.get("parent") != prev_id:
                errors.append(f"K1/K2: entry {i} parent mismatch")
            computed = self.hash({k: v for k, v in entry.items() if k not in ("id", "merkle")})
            if entry.get("id") != computed:
                errors.append(f"K2: entry {i} id does not match merkle hash")
            if entry.get("merkle", {}).get("self") != entry.get("id"):
                errors.append(f"K2: entry {i} merkle.self mismatch")
            prev_id = entry.get("id")
        return len(errors) == 0, errors
