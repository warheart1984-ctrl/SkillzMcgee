"""Slice execution adapter."""

from __future__ import annotations

from typing import Any, Callable

from slices import SLICE_REGISTRY


class SliceAdapter:
    """Route requests to registered slice handlers."""

    def __init__(self, registry: dict[str, Callable[[Any], Any]] | None = None) -> None:
        self.registry = registry or SLICE_REGISTRY

    def run(self, slice_id: str, input_data: Any) -> Any:
        handler = self.registry.get(slice_id)
        if handler is None:
            raise ValueError(f"Unknown slice: {slice_id}")
        return handler(input_data)

    def list_slices(self) -> list[str]:
        return list(self.registry.keys())
