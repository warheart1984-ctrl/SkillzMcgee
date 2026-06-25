"""Schema validation for slice state."""

from __future__ import annotations

from typing import Any


def validate_state(state: dict[str, Any], schema: dict[str, type]) -> list[str]:
    """Validate state keys against declared schema types."""
    errors: list[str] = []
    for key, typ in schema.items():
        if key not in state:
            continue
        if not isinstance(state[key], typ):
            errors.append(f"schema: {key} expected {typ.__name__}, got {type(state[key]).__name__}")
    return errors


SLICE_SCHEMA_DEFAULT: dict[str, type] = {
    "last_output": str,
    "last_status": str,
}

SCHEMA_TYPE_MAP: dict[str, type] = {
    "str": str,
    "int": int,
    "float": float,
    "bool": bool,
    "list": list,
    "dict": dict,
}
