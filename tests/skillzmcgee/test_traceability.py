"""Objective traceability — Objective → Contract → Implementation → CTS → Receipt."""

from __future__ import annotations

from skillzmcgee.governance.continuity_ledger import iter_receipts
from skillzmcgee.governance.objectives import GOVERNANCE_OBJECTIVES
from skillzmcgee.substrations.registry import SUBSTRATIONS_BY_OBJECTIVE


def test_every_objective_has_contract_and_impl() -> None:
    for oid in GOVERNANCE_OBJECTIVES.keys():
        subs = SUBSTRATIONS_BY_OBJECTIVE.get(oid, [])
        assert subs, f"Objective {oid} has no substration implementation."

        for s in subs:
            runtime = s["runtime"]
            governance = s["governance"]
            assert runtime.get("id"), f"Objective {oid} contract missing runtime id."
            links = governance.get("traceabilityLinks") or {}
            assert links.get("ctsId"), f"{runtime['id']} missing CTS ID."
            assert links.get("adrId"), f"{runtime['id']} missing ADR ID."
            assert links.get("requirementId"), f"{runtime['id']} missing requirement ID."
            assert links.get("evidenceLedgerPath"), f"{runtime['id']} missing evidence ledger path."


def test_every_objective_has_evidence_or_receipts() -> None:
    receipts = list(iter_receipts())
    covered = {r["governanceObjectiveId"] for r in receipts}
    for oid in GOVERNANCE_OBJECTIVES.keys():
        assert oid in covered, f"Objective {oid} has no receipts/evidence yet."
