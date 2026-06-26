"""Substration receipt JSONL — shared with Node runtime."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Iterator

DEFAULT_LEDGER_PATH = Path(".runtime") / "skillzmcgee" / "receipts.jsonl"


def receipts_path() -> Path:
    env = os.environ.get("SKILLZMCGEE_RECEIPTS_PATH")
    return Path(env) if env else DEFAULT_LEDGER_PATH


def iter_receipts(path: Path | None = None) -> Iterator[dict[str, Any]]:
    """Yield substration receipts from JSONL ledger."""
    ledger_path = path or receipts_path()
    if not ledger_path.exists():
        return
    with ledger_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            yield json.loads(line)
