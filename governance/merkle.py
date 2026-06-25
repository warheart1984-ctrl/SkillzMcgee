"""Merkle hashing for SkillzMcGee continuity receipts."""

from __future__ import annotations

import hashlib
import json
from typing import Any


def hash_payload(data: dict[str, Any], exclude_keys: frozenset[str] | None = None) -> str:
    """Stable SHA-256 hash of a JSON-serializable payload."""
    exclude = exclude_keys or frozenset()
    payload = {k: v for k, v in data.items() if k not in exclude}
    encoded = json.dumps(payload, sort_keys=True, default=str).encode()
    return hashlib.sha256(encoded).hexdigest()


def merkle_hash(entry: dict[str, Any]) -> str:
    """Hash receipt fields excluding id and merkle metadata."""
    return hash_payload(entry, exclude_keys=frozenset({"id", "merkle"}))


def merkle_root(hashes: list[str]) -> str | None:
    """Compute Merkle root over a list of receipt hashes."""
    if not hashes:
        return None
    layer = list(hashes)
    while len(layer) > 1:
        next_layer: list[str] = []
        for i in range(0, len(layer), 2):
            left = layer[i]
            right = layer[i + 1] if i + 1 < len(layer) else left
            combined = hashlib.sha256(f"{left}{right}".encode()).hexdigest()
            next_layer.append(combined)
        layer = next_layer
    return layer[0]
