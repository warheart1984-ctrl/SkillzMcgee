"""Constitutional contracts for slices and LLM."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class LLMContract:
    require_state_context: bool = True
    require_history_context: bool = True
    forbid_contradictions: bool = True
    log_all_outputs: bool = True
    deterministic_mode: bool = False
    max_output_length: int = 5000


@dataclass
class SliceContract:
    deterministic: bool = False
    schema: dict[str, type] = field(default_factory=dict)
    allowed_transitions: list[str] = field(default_factory=list)


@dataclass
class Constitution:
    invariants: list[str] = field(default_factory=list)
    llm: LLMContract = field(default_factory=LLMContract)
    slices: dict[str, SliceContract] = field(default_factory=dict)

    @classmethod
    def from_config(cls, config: dict[str, Any]) -> "Constitution":
        from governance.constitution.schemas import SCHEMA_TYPE_MAP

        const = config.get("constitution", config)
        llm_raw = const.get("llm", {})
        llm = LLMContract(
            require_state_context=llm_raw.get("require_state_context", True),
            require_history_context=llm_raw.get("require_history_context", True),
            forbid_contradictions=llm_raw.get("forbid_contradictions", True),
            log_all_outputs=llm_raw.get("log_all_outputs", True),
            deterministic_mode=llm_raw.get("deterministic_mode", False),
        )
        slices: dict[str, SliceContract] = {}
        for slice_id, sc in const.get("slices", {}).items():
            schema: dict[str, type] = {}
            for key, typ_name in sc.get("schema", {}).items():
                schema[key] = SCHEMA_TYPE_MAP.get(typ_name, str)
            slices[slice_id] = SliceContract(
                deterministic=sc.get("deterministic", False),
                schema=schema,
            )
        return cls(
            invariants=const.get("invariants", []),
            llm=llm,
            slices=slices,
        )
