"""SkillzMcGee v2.0 — Multi-agent constitutional runtime."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from governance.continuity_ledger import ContinuityLedger
from governance.reducer import ReducerV3
from governance.validator import ConstitutionalValidator


@dataclass
class AgentManifest:
    agent_id: str
    roles: list[str] = field(default_factory=list)
    capabilities: list[str] = field(default_factory=list)
    constraints: list[str] = field(default_factory=list)


@dataclass
class IntentNode:
    intent_id: str
    goal: str
    depends_on: list[str] = field(default_factory=list)
    assigned_agent: str | None = None
    status: str = "pending"


class IntentGraph:
    """Directed graph of goals, plans, and dependencies."""

    def __init__(self) -> None:
        self.nodes: dict[str, IntentNode] = {}

    def add(self, node: IntentNode) -> None:
        self.nodes[node.intent_id] = node

    def ready(self) -> list[IntentNode]:
        ready: list[IntentNode] = []
        for node in self.nodes.values():
            if node.status != "pending":
                continue
            deps_ok = all(
                self.nodes[d].status == "done"
                for d in node.depends_on
                if d in self.nodes
            )
            if deps_ok:
                ready.append(node)
        return ready


class ConstitutionalScheduler:
    """Choose which agent acts next under invariants."""

    def __init__(self, manifests: dict[str, AgentManifest]) -> None:
        self.manifests = manifests

    def select_agent(
        self,
        intent: IntentNode,
        state: dict[str, Any],
    ) -> str | None:
        if intent.assigned_agent and intent.assigned_agent in self.manifests:
            return intent.assigned_agent
        slice_needed = intent.goal.split(":")[0] if ":" in intent.goal else intent.goal
        for agent_id, manifest in self.manifests.items():
            if slice_needed in manifest.capabilities:
                return agent_id
        agents = state.get("agents", {})
        if agents:
            return next(iter(agents.keys()))
        return next(iter(self.manifests.keys()), None)


class MultiAgentRuntime:
    """
    Host + scheduler + governor + multi-agent substrate.
    state.agents, state.capabilities, state.intent_graph, state.interactions
    """

    def __init__(
        self,
        ledger: ContinuityLedger,
        validator: ConstitutionalValidator,
        reducer: ReducerV3,
        manifests: dict[str, AgentManifest],
    ) -> None:
        self.ledger = ledger
        self.validator = validator
        self.reducer = reducer
        self.manifests = manifests
        self.intents = IntentGraph()
        self.scheduler = ConstitutionalScheduler(manifests)
        self.interactions: list[dict[str, Any]] = []

    def observe(self) -> dict[str, Any]:
        state = self.reducer.reduce(self.ledger)
        state["capabilities"] = {
            aid: m.capabilities for aid, m in self.manifests.items()
        }
        state["intent_graph"] = {
            iid: {"goal": n.goal, "status": n.status, "agent": n.assigned_agent}
            for iid, n in self.intents.nodes.items()
        }
        state["interactions"] = self.interactions
        return state

    def select_next_intent(self) -> IntentNode | None:
        ready = self.intents.ready()
        return ready[0] if ready else None

    def record_interaction(self, from_agent: str, to_agent: str, message: Any) -> None:
        self.interactions.append({
            "from": from_agent,
            "to": to_agent,
            "message": message,
        })
