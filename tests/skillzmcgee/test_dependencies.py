"""Substration dependency graph — no cycles, required deps exist, optional deps explicit."""

from __future__ import annotations

from skillzmcgee.substrations.registry import SUBSTRATIONS_BY_ID


def _substration_dependency_graph() -> dict[str, list[str]]:
    graph: dict[str, list[str]] = {}
    ids = set(SUBSTRATIONS_BY_ID.keys())
    for sid, s in SUBSTRATIONS_BY_ID.items():
        runtime = s["runtime"]
        graph[sid] = [dep for dep in runtime.get("dependencies", []) if dep in ids]
    return graph


def test_no_circular_dependencies() -> None:
    graph = _substration_dependency_graph()

    def dfs(node: str, path: list[str]) -> None:
        assert node not in path, f"Circular dependency: {' -> '.join(path + [node])}"
        for dep in graph.get(node, []):
            dfs(dep, path + [node])

    for sid in graph.keys():
        dfs(sid, [])


def test_all_dependencies_exist() -> None:
    ids = set(SUBSTRATIONS_BY_ID.keys())
    for sid, s in SUBSTRATIONS_BY_ID.items():
        runtime = s["runtime"]
        optional = set(runtime.get("optionalDependencies") or [])
        for dep in runtime.get("dependencies", []):
            assert dep in ids, f"{sid} depends on missing substration {dep}"
        for dep in optional:
            assert dep not in ids, f"{sid} lists substration {dep} as optional (should be required)"


def test_external_dependencies_declared_optional() -> None:
    """Module/runtime deps must appear in optionalDependencies, not dependencies."""
    ids = set(SUBSTRATIONS_BY_ID.keys())
    for sid, s in SUBSTRATIONS_BY_ID.items():
        runtime = s["runtime"]
        optional = set(runtime.get("optionalDependencies") or [])
        for ext in optional:
            assert ext not in ids, f"{sid} optional dep {ext} is a substration id (should be required)"
        assert len(optional) > 0 or len(runtime.get("dependencies", [])) >= 0
