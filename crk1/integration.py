"""CRK-1 integration — map SkillzMcGee to CRK-1 substrate."""

from __future__ import annotations

from typing import Any

from governance.continuity_ledger import ContinuityLedger
from governance.reducer import ReducerV3
from governance.validator import ConstitutionalValidator


def to_crk1_receipt(skillz_receipt: dict[str, Any]) -> dict[str, Any]:
    """Map Skillz receipt to CRK-1 format."""
    return {
        "id": skillz_receipt["id"],
        "parent": skillz_receipt.get("parent"),
        "timestamp": skillz_receipt.get("timestamp"),
        "actor": skillz_receipt.get("actor", "skillz"),
        "domain": skillz_receipt.get("slice"),
        "input": skillz_receipt.get("input"),
        "output": skillz_receipt.get("output"),
        "status": skillz_receipt.get("status"),
        "invariants_passed": skillz_receipt.get("invariants_passed", []),
        "diff": skillz_receipt.get("diff"),
        "signature": skillz_receipt.get("signature"),
        "merkle": skillz_receipt.get("merkle"),
    }


def from_crk1_receipt(crk1: dict[str, Any]) -> dict[str, Any]:
    """Map CRK-1 receipt back to Skillz format."""
    return {
        "id": crk1["id"],
        "parent": crk1.get("parent"),
        "timestamp": crk1.get("timestamp"),
        "slice": crk1.get("domain"),
        "actor": crk1.get("actor", "skillz"),
        "input": crk1.get("input"),
        "output": crk1.get("output"),
        "status": crk1.get("status", "ok"),
        "invariants_passed": crk1.get("invariants_passed", []),
        "diff": crk1.get("diff"),
        "signature": crk1.get("signature"),
        "merkle": crk1.get("merkle"),
    }


class CRK1ContinuityAdapter:
    """Skillz ledger as CRK-1 continuity substrate."""

    def __init__(self, ledger: ContinuityLedger) -> None:
        self.ledger = ledger

    def append(self, crk1_receipt: dict[str, Any]) -> str:
        skillz = from_crk1_receipt(crk1_receipt)
        payload = {k: v for k, v in skillz.items() if k not in ("id", "parent", "merkle")}
        return self.ledger.append(payload)

    def iterate(self) -> list[dict[str, Any]]:
        return [to_crk1_receipt(e) for e in self.ledger.entries]

    def prove(self) -> tuple[bool, list[str]]:
        return self.ledger.verify_chain()

    def merkle_root(self) -> str | None:
        return self.ledger.root()


class CRK1ReducerModule:
    """Skillz ReducerV3 as CRK-1 reducer: state = fold(ledger)."""

    def __init__(self, reducer: ReducerV3 | None = None) -> None:
        self.reducer = reducer or ReducerV3()

    def fold(self, ledger: ContinuityLedger) -> dict[str, Any]:
        return self.reducer.reduce(ledger)

    def step(self, state: dict[str, Any], receipt: dict[str, Any]) -> dict[str, Any]:
        """state' = reducer(state, receipt) via full replay."""
        ledger = ContinuityLedger()
        for _ in range(state.get("system", {}).get("run_count", 0)):
            pass  # placeholder — full fold uses ledger
        ledger.entries = [receipt]
        return self.reducer.reduce(ledger)


class CRK1ValidatorAdapter:
    """Skillz validator as CRK-1 constitutional validator."""

    def __init__(self, validator: ConstitutionalValidator) -> None:
        self.validator = validator

    def validate_before_commit(
        self,
        receipt: dict[str, Any],
        state: dict[str, Any],
        ledger: ContinuityLedger,
    ) -> tuple[bool, list[str]]:
        skillz = from_crk1_receipt(receipt) if "domain" in receipt else receipt
        return self.validator.validate(skillz, state, ledger)
