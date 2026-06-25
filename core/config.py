"""Configuration loader."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from governance.constitution.contracts import Constitution


def load_yaml(path: str | Path) -> dict[str, Any]:
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def load_config(config_dir: str | Path | None = None) -> dict[str, Any]:
    base = Path(config_dir) if config_dir else Path(__file__).resolve().parent.parent / "config"
    settings = load_yaml(base / "settings.yaml")
    constitution_raw = load_yaml(base / "constitution.yaml")
    return {
        **settings,
        "constitution": Constitution.from_config(constitution_raw),
        "constitution_raw": constitution_raw,
    }
