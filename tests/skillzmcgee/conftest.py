"""Pytest fixtures for governance gate tests."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

import pytest

_REPO_ROOT = Path(__file__).resolve().parents[2]
_FIXTURE_RECEIPTS = _REPO_ROOT / "tests" / "fixtures" / "governance_gate_receipts.jsonl"


@pytest.fixture(scope="session", autouse=True)
def governance_gate_receipts() -> None:
    """Ensure gate fixture receipts exist and point iter_receipts at them."""
    seed_script = _REPO_ROOT / "scripts" / "seed_governance_gate.mjs"
    if seed_script.exists():
        subprocess.run(
            ["node", str(seed_script)],
            cwd=str(_REPO_ROOT),
            check=True,
            capture_output=True,
        )
    os.environ["SKILLZMCGEE_RECEIPTS_PATH"] = str(_FIXTURE_RECEIPTS)
    if str(_REPO_ROOT) not in sys.path:
        sys.path.insert(0, str(_REPO_ROOT))

    from skillzmcgee.substrations import registry as reg

    reg.reload_registry()
