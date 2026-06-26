"""Substration registry bridge."""

from .registry import (
    SUBSTRATIONS_BY_OBJECTIVE,
    get_substrations_for_objective,
    reload_substrations_by_objective,
)

__all__ = [
    "SUBSTRATIONS_BY_OBJECTIVE",
    "get_substrations_for_objective",
    "reload_substrations_by_objective",
]
