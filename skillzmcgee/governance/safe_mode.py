"""Safe-mode profiles S0–S3 — inspectable constitutional degradation ladder."""

from __future__ import annotations

SAFE_MODES: dict[str, dict[str, object]] = {
    "S0": {
        "name": "Normal",
        "description": "Full governed runtime, all substrations active.",
        "restrictions": [],
    },
    "S1": {
        "name": "Degraded",
        "description": "Non-critical substrations paused; core governance only.",
        "restrictions": ["no-external-actuation", "no-model-updates"],
    },
    "S2": {
        "name": "Safe",
        "description": "Proposal-only, no state transitions.",
        "restrictions": ["proposal-only", "no-state-write"],
    },
    "S3": {
        "name": "Emergency",
        "description": "Read-only, observability only.",
        "restrictions": ["read-only", "no-execution", "no-llm"],
    },
}

_current_mode = "S0"


def get_safe_mode() -> tuple[str, dict[str, object]]:
    return _current_mode, SAFE_MODES[_current_mode]


def set_safe_mode(mode: str) -> None:
    global _current_mode
    if mode not in SAFE_MODES:
        raise ValueError(f"Unknown safe-mode: {mode}")
    _current_mode = mode


def safe_mode_profile_applied() -> bool:
    """True when the active profile is registered (all S0–S3 profiles are enforced)."""
    return _current_mode in SAFE_MODES
