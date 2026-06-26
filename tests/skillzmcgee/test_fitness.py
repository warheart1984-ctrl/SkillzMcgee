"""Governance fitness — substrations must declare and demonstrate fitness."""

from __future__ import annotations

from skillzmcgee.governance.continuity_ledger import iter_receipts
from skillzmcgee.substrations.registry import SUBSTRATIONS_BY_ID


def test_every_substration_declares_fitness_fields() -> None:
    for sid, s in SUBSTRATIONS_BY_ID.items():
        g = s["governance"]
        assert g.get("uniqueContribution"), f"{sid} missing uniqueContribution."
        assert g.get("successMetrics"), f"{sid} missing successMetrics."
        assert g.get("retirementCriteria"), f"{sid} missing retirementCriteria."
        assert g.get("admissionCriteria"), f"{sid} missing admissionCriteria."


def test_substration_has_evidence_of_activity() -> None:
    receipts = list(iter_receipts())
    by_sub: dict[str, list[dict]] = {}
    for r in receipts:
        by_sub.setdefault(r["substrationId"], []).append(r)

    for sid in SUBSTRATIONS_BY_ID.keys():
        assert sid in by_sub, f"{sid} has no receipts; fitness cannot be evaluated."
