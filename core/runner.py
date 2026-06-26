"""SkillzMcGee v1.0 — Unified constitutional runtime loop."""

from __future__ import annotations

from typing import Any, Callable

from core.adapters.llm_adapter import LawfulLLMAdapter
from core.adapters.slice_adapter import SliceAdapter
from core.config import load_config
from core.federation_bridge import run_federation_tick
from core.receipts import build_receipt
from governance.continuity_ledger import ContinuityLedger
from governance.diff import deep_diff
from governance.memory import MemoryStore
from governance.reducer import ReducerV3
from governance.validator import ConstitutionalValidator
from ui.governance_ui import GovernanceUI, UserRequest


def stub_llm(prompt: str) -> str:
    return f"[stub-llm] {prompt[:120]}..."


class SkillzRuntime:
    """Constitutional runtime — ledger, validator, reducer, memory, LLM, UI."""

    def __init__(self, config: dict[str, Any] | None = None) -> None:
        self.config = config or load_config()
        ledger_path = self.config.get("ledger_path", "skillz_ledger.json")
        memory_path = self.config.get("memory_path", "skillz_memory.json")

        self.ledger = ContinuityLedger(ledger_path)
        self.constitution = self.config["constitution"]
        self.validator = ConstitutionalValidator(self.constitution)
        self.reducer = ReducerV3()
        self.state = self.reducer.reduce(self.ledger)
        self.memory = MemoryStore(memory_path)
        self.memory.save(self.state)

        llm_fn: Callable[[str], str] = self.config.get("llm_fn", stub_llm)
        self.llm_adapter = LawfulLLMAdapter(
            llm=llm_fn,
            ledger=self.ledger,
            state=self.state,
            constitution=self.constitution,
        )
        self.slice_adapter = SliceAdapter()
        cosmic_path = self.config.get("cosmic_path", "skillz_cosmic.json")
        self.ui = GovernanceUI(self.ledger, self.state, cosmic_path=cosmic_path)
        self.federation_enabled = self.config.get("federation", {}).get("enabled", True)

    def process_request(self, request: UserRequest) -> dict[str, Any]:
        """Single iteration of the constitutional loop."""
        output = self.slice_adapter.run(request.slice, request.input)

        receipt = build_receipt(
            slice_id=request.slice,
            input_data=request.input,
            output=output,
            actor=request.actor,
            node_id=self.config.get("node_id"),
        )

        ok, errors = self.validator.validate(receipt, self.state, self.ledger, committed=False)
        if not ok:
            receipt["status"] = "error"
            receipt["output"] = {"errors": errors}

        # Predict post-reduction state for diff (without mutating ledger yet)
        preview_ledger = ContinuityLedger()
        preview_ledger.entries = list(self.ledger.entries)
        preview_payload = dict(receipt)
        preview_ledger.append(preview_payload)
        new_state = self.reducer.reduce(preview_ledger)
        diff = deep_diff(self.state, new_state)
        receipt["diff"] = diff

        receipt_id = self.ledger.append(receipt)
        self.state = self.reducer.reduce(self.ledger)

        self.memory.save(self.state)
        self.llm_adapter.update_state(self.state)
        self.ui.state = self.state
        self.ledger.save()

        if self.federation_enabled and self.ledger.path:
            tick = run_federation_tick(self.ledger.path, cosmic_path=self.ui.cosmic_path)
            if not tick.get("ok"):
                receipt["federation_tick"] = {"ok": False, "error": tick.get("error")}

        return receipt

    def runtime_loop(self) -> None:
        """Canonical SkillzMcGee main loop."""
        print("SkillzMcGee v1.0 — Constitutional Runtime")
        print("Enter: <slice> <input>  or  JSON  or  quit")
        print(f"Slices: {', '.join(self.slice_adapter.list_slices())}")
        self.ui.render_organism_layers()

        while True:
            request = self.ui.get_user_request()
            if request is None:
                print("Goodbye.")
                break
            try:
                receipt = self.process_request(request)
                self.ui.update(receipt, self.state)
            except Exception as exc:
                print(f"Error: {exc}")


def runtime_loop(config: dict[str, Any] | None = None) -> None:
    SkillzRuntime(config).runtime_loop()
