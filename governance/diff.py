"""State diffing for rollback previews and UI."""

from __future__ import annotations

from typing import Any


def deep_diff(old: Any, new: Any, path: str = "") -> dict[str, Any]:
    """Return added, removed, and changed keys between two state dicts."""
    diff: dict[str, Any] = {"added": {}, "removed": {}, "changed": {}}
    if not isinstance(old, dict) or not isinstance(new, dict):
        if old != new:
            diff["changed"][path or "root"] = {"old": old, "new": new}
        return diff

    for key in old:
        full = f"{path}.{key}" if path else key
        if key not in new:
            diff["removed"][full] = old[key]
        elif old[key] != new[key]:
            if isinstance(old[key], dict) and isinstance(new[key], dict):
                nested = deep_diff(old[key], new[key], full)
                diff["added"].update(nested["added"])
                diff["removed"].update(nested["removed"])
                diff["changed"].update(nested["changed"])
            else:
                diff["changed"][full] = {"old": old[key], "new": new[key]}

    for key in new:
        if key not in old:
            full = f"{path}.{key}" if path else key
            diff["added"][full] = new[key]

    return diff
