"""DAR-Z cosmophysics reducer + invariants."""

from __future__ import annotations

from typing import Any

from crk1.integration import to_crk1_receipt


COSMIC_INVARIANTS = [
    "C0: Continuity of worldlines",
    "C1: Epoch ordering",
    "C2: Field consistency",
    "C3: Agent locality",
    "C4: Timeline integrity",
    "C5: CRK-1 compatibility",
]


def empty_cosmic_state() -> dict[str, Any]:
    return {
        "epochs": [],
        "worldlines": {},
        "fields": {},
        "agents": {},
    }


class CosmophysicsReducer:
    """cosmic_state' = cosmophysics_reducer(cosmic_state, cosmic_receipt)."""

    def reduce(self, cosmic_state: dict[str, Any], receipt: dict[str, Any]) -> dict[str, Any]:
        state = {
            "epochs": list(cosmic_state.get("epochs", [])),
            "worldlines": dict(cosmic_state.get("worldlines", {})),
            "fields": dict(cosmic_state.get("fields", {})),
            "agents": dict(cosmic_state.get("agents", {})),
        }

        epoch_id = receipt.get("epoch_id")
        worldline_id = receipt.get("worldline_id")
        event_type = receipt.get("event_type", "interaction")

        if epoch_id is not None:
            epochs = state["epochs"]
            if epochs and epoch_id <= epochs[-1]:
                raise ValueError("C1: retroactive epoch insertion forbidden")
            if not epochs or epoch_id > epochs[-1]:
                epochs.append(epoch_id)
            state["epochs"] = epochs

        if worldline_id:
            wl = state["worldlines"].setdefault(worldline_id, {"receipts": [], "merkle_chain": []})
            rid = receipt.get("id") or receipt.get("receipt_id")
            if rid:
                wl["receipts"].append(rid)
                wl["merkle_chain"].append(rid)

        fields_delta = receipt.get("fields_delta", {})
        for field_name, delta in fields_delta.items():
            state["fields"][field_name] = state["fields"].get(field_name, 0) + delta

        agents_delta = receipt.get("agents_delta", {})
        for agent_id, pos in agents_delta.items():
            if worldline_id and event_type == "transition":
                current = state["agents"].get(agent_id, {})
                if current.get("worldline") and current["worldline"] != worldline_id:
                    if not receipt.get("continuity_receipt"):
                        raise ValueError("C0: worldline branch/merge requires continuity receipt")
            state["agents"][agent_id] = {**state["agents"].get(agent_id, {}), **pos, "worldline": worldline_id}

        return state

    def fold_ledger(self, receipts: list[dict[str, Any]]) -> dict[str, Any]:
        state = empty_cosmic_state()
        for r in receipts:
            state = self.reduce(state, r)
        return state


class CosmophysicsValidator:
    """Enforce C0–C5 cosmophysics invariants."""

    def validate(self, receipt: dict[str, Any], cosmic_state: dict[str, Any]) -> tuple[bool, list[str]]:
        errors: list[str] = []

        if receipt.get("slice"):
            try:
                to_crk1_receipt(receipt)
            except KeyError as e:
                errors.append(f"C5: not CRK-1 compatible: {e}")

        worldline_id = receipt.get("worldline_id")
        agent_id = receipt.get("actor") or receipt.get("agent_id")
        if agent_id and worldline_id:
            agent = cosmic_state.get("agents", {}).get(agent_id, {})
            if agent.get("worldline") and agent["worldline"] != worldline_id:
                if not receipt.get("continuity_receipt"):
                    errors.append("C3: agent locality violation")

        return len(errors) == 0, errors
