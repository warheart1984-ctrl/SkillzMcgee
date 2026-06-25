"""Lawful LLM adapter — state-aware, history-aware cognition."""

from __future__ import annotations

import json
from typing import Any, Callable

from governance.constitution.contracts import Constitution
from governance.continuity_ledger import ContinuityLedger


class LawfulLLMAdapter:
    """Wrap LLM calls with constitutional context binding."""

    def __init__(
        self,
        llm: Callable[[str], str],
        ledger: ContinuityLedger,
        state: dict[str, Any],
        constitution: Constitution | None = None,
    ) -> None:
        self.llm = llm
        self.ledger = ledger
        self.state = state
        self.constitution = constitution or Constitution()

    def _slice_context(self, slice_id: str | None) -> dict[str, Any]:
        if not slice_id:
            return {}
        return self.state.get("slices", {}).get(slice_id, {})

    def _recent_receipts(self, n: int = 5) -> list[dict[str, Any]]:
        return self.ledger.entries[-n:]

    def build_prompt(self, prompt: str, slice_id: str | None = None) -> str:
        """C1: Context binding — state + history + task."""
        parts = ["You are operating inside a governed SkillzMcGee runtime.", ""]

        if self.constitution.llm.require_state_context:
            ctx = self._slice_context(slice_id)
            parts.append(f"State: {json.dumps(ctx, default=str)}")

        if self.constitution.llm.require_history_context:
            history = self._recent_receipts()
            parts.append(f"Recent Receipts: {json.dumps(history, default=str)}")

        parts.extend([
            "",
            f"Task: {prompt}",
            "",
            "Rules:",
            "- Do not contradict state.",
            "- Do not contradict receipts.",
            "- Output must be valid text as required.",
        ])
        return "\n".join(parts)

    def ask(self, prompt: str, slice_id: str | None = None) -> str:
        full_prompt = self.build_prompt(prompt, slice_id)
        return self.llm(full_prompt)

    def update_state(self, state: dict[str, Any]) -> None:
        self.state = state
