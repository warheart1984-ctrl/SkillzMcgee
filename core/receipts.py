"""Receipt construction for SkillzMcGee."""

from __future__ import annotations

import time
from typing import Any

from governance.merkle import merkle_hash


def build_receipt(
    *,
    slice_id: str,
    input_data: Any,
    output: Any,
    status: str = "ok",
    actor: str = "skillz",
    node_id: str | None = None,
    federated_parent_id: str | None = None,
    invariants_passed: list[str] | None = None,
    diff: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build a receipt payload before ledger append (id assigned by ledger)."""
    receipt: dict[str, Any] = {
        "timestamp": time.time(),
        "slice": slice_id,
        "actor": actor,
        "input": input_data,
        "output": output,
        "status": status,
    }
    if node_id is not None:
        receipt["node_id"] = node_id
    if federated_parent_id is not None:
        receipt["federated_parent_id"] = federated_parent_id
    if invariants_passed is not None:
        receipt["invariants_passed"] = invariants_passed
    if diff is not None:
        receipt["diff"] = diff
    return receipt


def finalize_receipt_id(receipt: dict[str, Any]) -> str:
    """Compute deterministic receipt id from payload (excluding id/parent/merkle)."""
    return merkle_hash(receipt)
