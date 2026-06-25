"""Constitutional validator — CRK-lite."""

from __future__ import annotations

from typing import Any

from governance.continuity_ledger import ContinuityLedger
from governance.constitution.contracts import Constitution
from governance.constitution.invariants import (
    check_k0_receipt_validity,
    check_k3_reducible,
    check_k4_determinism,
)
from governance.constitution.schemas import validate_state
from governance.merkle import merkle_hash


class ConstitutionalValidator:
    """Enforce K0–K7 before ledger commit."""

    def __init__(self, constitution: Constitution | None = None) -> None:
        self.constitution = constitution or Constitution()
        self._input_cache: dict[tuple[str, str], dict[str, Any]] = {}

    def validate(self, receipt: dict[str, Any], state: dict[str, Any], ledger: ContinuityLedger | None = None, *, committed: bool = False) -> tuple[bool, list[str]]:
        """Validate receipt against constitution and current state."""
        errors: list[str] = list(check_k0_receipt_validity(receipt, committed=committed))

        slice_id = receipt.get("slice", "")
        slice_contract = self.constitution.slices.get(slice_id)

        if slice_contract and slice_contract.schema:
            slice_state = state.get("slices", {}).get(slice_id, {})
            errors.extend(validate_state(slice_state, slice_contract.schema))

        if slice_contract:
            cache_key = (slice_id, str(receipt.get("input")))
            prior = self._input_cache.get(cache_key)
            errors.extend(check_k4_determinism(receipt, {"deterministic": slice_contract.deterministic}, prior))
            if receipt.get("status") == "ok":
                self._input_cache[cache_key] = receipt

        if ledger is not None:
            entries = list(ledger.all())
            errors.extend(check_k3_reducible(state, entries))

        passed = [k for k in ("K0", "K1", "K2", "K3", "K4", "K5", "K6", "K7") if not any(k in e for e in errors)]
        receipt["invariants_passed"] = passed
        return len(errors) == 0, errors

    def validate_ledger(self, ledger: ContinuityLedger) -> tuple[bool, list[str]]:
        """K1/K2: append-only Merkle integrity."""
        return ledger.verify_chain()

    def validate_llm_output(self, output: Any) -> tuple[bool, list[str]]:
        """K5: LLM output schema compliance."""
        errors: list[str] = []
        if not isinstance(output, str):
            errors.append("K5: LLM output must be str")
            return False, errors
        if len(output) > self.constitution.llm.max_output_length:
            errors.append(f"K5: output exceeds {self.constitution.llm.max_output_length} chars")
        return len(errors) == 0, errors

    def pre_append_hash_check(self, receipt: dict[str, Any]) -> tuple[bool, list[str]]:
        """Verify id would match merkle hash before append."""
        payload = {k: v for k, v in receipt.items() if k not in ("id", "merkle", "parent")}
        computed = merkle_hash(payload)
        if receipt.get("id") and receipt["id"] != computed:
            return False, ["K2: receipt id mismatch"]
        return True, []
