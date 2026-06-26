"""Substration registry — loads live map from Node runtime."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any

_REPO_ROOT = Path(__file__).resolve().parents[2]

_REGISTRY_CACHE: dict[str, Any] | None = None


def reload_registry() -> dict[str, Any]:
    """Reload full registry export from Node (clears cache)."""
    global _REGISTRY_CACHE
    script = _REPO_ROOT / "scripts" / "export_substrations.mjs"
    if not script.exists():
        _REGISTRY_CACHE = {"byObjective": {}, "byId": {}}
        return _REGISTRY_CACHE

    result = subprocess.run(
        ["node", str(script)],
        cwd=str(_REPO_ROOT),
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "export_substrations.mjs failed")

    _REGISTRY_CACHE = json.loads(result.stdout.strip())
    return _REGISTRY_CACHE


def _get_registry() -> dict[str, Any]:
    global _REGISTRY_CACHE
    if _REGISTRY_CACHE is None:
        reload_registry()
    return _REGISTRY_CACHE or {"byObjective": {}, "byId": {}}


def _get_substrations_by_objective() -> dict[str, list[dict[str, Any]]]:
    return _get_registry().get("byObjective", {})


def _get_substrations_by_id() -> dict[str, dict[str, Any]]:
    return _get_registry().get("byId", {})


class _SubstrationsByObjectiveView:
    """Lazy dict view for SUBSTRATIONS_BY_OBJECTIVE."""

    def items(self):
        return _get_substrations_by_objective().items()

    def get(self, key: str, default=None):
        return _get_substrations_by_objective().get(key, default)

    def __getitem__(self, key: str):
        return _get_substrations_by_objective()[key]

    def __iter__(self):
        return iter(_get_substrations_by_objective())

    def keys(self):
        return _get_substrations_by_objective().keys()

    def values(self):
        return _get_substrations_by_objective().values()


class _SubstrationsByIdView:
    """Lazy dict view for SUBSTRATIONS_BY_ID."""

    def items(self):
        return _get_substrations_by_id().items()

    def get(self, key: str, default=None):
        return _get_substrations_by_id().get(key, default)

    def __getitem__(self, key: str):
        return _get_substrations_by_id()[key]

    def __iter__(self):
        return iter(_get_substrations_by_id())

    def keys(self):
        return _get_substrations_by_id().keys()

    def values(self):
        return _get_substrations_by_id().values()

    def __len__(self) -> int:
        return len(_get_substrations_by_id())


SUBSTRATIONS_BY_OBJECTIVE = _SubstrationsByObjectiveView()
SUBSTRATIONS_BY_ID = _SubstrationsByIdView()


def get_substrations_for_objective(objective_id: str) -> list[dict[str, Any]]:
    return _get_substrations_by_objective().get(objective_id, [])


def get_substration_by_id(substration_id: str) -> dict[str, Any] | None:
    return _get_substrations_by_id().get(substration_id)
