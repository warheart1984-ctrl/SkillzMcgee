"""WOLF-1 governance objectives — mirrors src/governance/objectives.js."""

from __future__ import annotations

from typing import TypedDict


class GovernanceObjective(TypedDict):
    name: str
    description: str
    axis: str


GOVERNANCE_OBJECTIVES: dict[str, GovernanceObjective] = {
    "GOV.ID.ROLE_BOUND": {
        "axis": "identity",
        "name": "Identity Role Binding",
        "description": "Requests must carry valid identity.",
    },
    "GOV.ID.CAPABILITY_SCOPE": {
        "axis": "identity",
        "name": "Capability Scope Integrity",
        "description": "Actions must match declared capability.",
    },
    "GOV.HW.NO_DIRECT_ACTUATION": {
        "axis": "safety",
        "name": "No Direct Actuation",
        "description": "Cognition cannot issue actuator commands.",
    },
    "GOV.DATA.TELEMETRY_READ_ONLY": {
        "axis": "data",
        "name": "Telemetry Read-Only",
        "description": "Telemetry cannot be mutated by cognitive runs.",
    },
    "GOV.PLAN.PROPOSAL_ONLY": {
        "axis": "authority",
        "name": "Proposal-Only Authority",
        "description": "LLM outputs are proposals, never commands.",
    },
    "GOV.RUN.RECEIPT_REQUIRED": {
        "axis": "evidence",
        "name": "Receipts Required",
        "description": "Every run must emit a receipt.",
    },
    "GOV.MODEL.CHANGE_AUDITED": {
        "axis": "model",
        "name": "Audited Model Change",
        "description": "Model updates must be signed and logged.",
    },
    "GOV.PWR.SOLAR_PRIMARY": {
        "axis": "power",
        "name": "Solar Power Threshold",
        "description": "Cognitive runs require solar/storage minimums.",
    },
    "GOV.PWR.NUCLEAR_FAILSAFE_MIN": {
        "axis": "power",
        "name": "Nuclear Failsafe Minimum",
        "description": "Governance floor must be guaranteed.",
    },
    "GOV.PWR.THERMO_BOUNDS": {
        "axis": "power",
        "name": "Thermoelectric Bounds",
        "description": "Thermal spine must remain within bounds.",
    },
    "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED": {
        "axis": "governance",
        "name": "Fail Closed on Invariant Failure",
        "description": "Invariant evaluation failure halts execution.",
    },
    "GOV.GOV.SAFE_MODE_PROFILE": {
        "axis": "governance",
        "name": "Safe-Mode Profile Enforcement",
        "description": "Safe-mode restricts actions.",
    },
}

GOVERNANCE_OBJECTIVE_IDS: tuple[str, ...] = tuple(GOVERNANCE_OBJECTIVES.keys())

WOLF1_INVARIANT_TO_OBJECTIVE: dict[str, str] = {
    "IDENTITY_ROLE_BOUND": "GOV.ID.ROLE_BOUND",
    "IDENTITY_CAPABILITY_SCOPE": "GOV.ID.CAPABILITY_SCOPE",
    "SAFETY_NO_DIRECT_ACTUATION": "GOV.HW.NO_DIRECT_ACTUATION",
    "DATA_TELEMETRY_READ_ONLY": "GOV.DATA.TELEMETRY_READ_ONLY",
    "AUTHORITY_PROPOSAL_ONLY": "GOV.PLAN.PROPOSAL_ONLY",
    "EVIDENCE_RECEIPT_REQUIRED": "GOV.RUN.RECEIPT_REQUIRED",
    "MODEL_CHANGE_AUDITED": "GOV.MODEL.CHANGE_AUDITED",
    "POWER_SOLAR_PRIMARY": "GOV.PWR.SOLAR_PRIMARY",
    "POWER_NUCLEAR_FAILSAFE_MIN": "GOV.PWR.NUCLEAR_FAILSAFE_MIN",
    "POWER_THERMO_BOUNDS": "GOV.PWR.THERMO_BOUNDS",
    "GOVERNANCE_FAIL_CLOSED": "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED",
    "GOVERNANCE_SAFE_MODE": "GOV.GOV.SAFE_MODE_PROFILE",
}
