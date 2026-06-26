"""Bridge Python runtime to JS federation tick (AS-Ω + substrations)."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any


def run_federation_tick(
    ledger_path: str | Path,
    cosmic_path: str | Path | None = None,
    repo_root: str | Path | None = None,
) -> dict[str, Any]:
    """Run AS-Ω fold + federationTick via Node CLI."""
    root = Path(repo_root) if repo_root else Path(__file__).resolve().parent.parent
    script = root / "scripts" / "federate_tick.mjs"
    ledger_path = Path(ledger_path)
    cosmic_path = Path(cosmic_path) if cosmic_path else ledger_path.parent / "skillz_cosmic.json"

    if not script.exists():
        return {"ok": False, "error": f"Missing script: {script}"}

    result = subprocess.run(
        ["node", str(script), str(ledger_path), str(cosmic_path)],
        cwd=str(root),
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode != 0:
        return {
            "ok": False,
            "error": result.stderr.strip() or result.stdout.strip(),
            "returncode": result.returncode,
        }

    try:
        summary = json.loads(result.stdout.strip().splitlines()[-1])
    except (json.JSONDecodeError, IndexError):
        summary = {"ok": True, "raw": result.stdout.strip()}

    if cosmic_path.exists():
        with open(cosmic_path, encoding="utf-8") as f:
            summary["cosmic"] = json.load(f)

    return summary
