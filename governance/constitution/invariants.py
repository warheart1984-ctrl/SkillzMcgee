"""Constitutional invariants K0–K7."""

from __future__ import annotations

from typing import Any

REQUIRED_RECEIPT_FIELDS = frozenset(
    {"timestamp", "slice", "input", "output", "status"}
)

REQUIRED_COMMITTED_FIELDS = REQUIRED_RECEIPT_FIELDS | frozenset({"id", "parent", "merkle"})


def check_k0_receipt_validity(receipt: dict[str, Any], committed: bool = False) -> list[str]:
    """K0: Every receipt must contain required fields."""
    errors: list[str] = []
    required = REQUIRED_COMMITTED_FIELDS if committed else REQUIRED_RECEIPT_FIELDS
    missing = required - set(receipt.keys())
    if missing:
        errors.append(f"K0: missing fields {sorted(missing)}")
    if committed and receipt.get("merkle", {}).get("self") != receipt.get("id"):
        errors.append("K0: merkle.self must match id")
    return errors


def check_k3_reducible(state: dict[str, Any], ledger_entries: list[dict[str, Any]]) -> list[str]:
    """K3: State must be derivable from ledger (structural check)."""
    errors: list[str] = []
    if ledger_entries and state.get("system", {}).get("run_count", 0) != len(ledger_entries):
        errors.append("K3: run_count does not match ledger length")
    return errors


def check_k4_determinism(
    receipt: dict[str, Any],
    slice_config: dict[str, Any],
    prior_same_input: dict[str, Any] | None,
) -> list[str]:
    """K4: Deterministic slices must not vary for same input."""
    if not slice_config.get("deterministic"):
        return []
    if prior_same_input is None:
        return []
    if prior_same_input.get("output") != receipt.get("output"):
        return ["K4: deterministic slice produced different output for same input"]
    return []


def check_k6_no_contradiction(
    old_slice_state: dict[str, Any],
    new_slice_state: dict[str, Any],
    schema: dict[str, type],
) -> list[str]:
    """K6: No contradictory state transitions."""
    errors: list[str] = []
    for key, typ in schema.items():
        val = new_slice_state.get(key)
        if val is not None and not isinstance(val, typ):
            errors.append(f"K6: {key} expected {typ.__name__}, got {type(val).__name__}")
    return errors
