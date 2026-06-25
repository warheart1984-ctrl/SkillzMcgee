"""Built-in slice handlers."""

from __future__ import annotations

import ast
import operator
from typing import Any, Callable


def _safe_eval(expr: str) -> float:
    ops = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
    }

    def _eval(node: ast.AST) -> float:
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return float(node.value)
        if isinstance(node, ast.BinOp):
            return ops[type(node.op)](_eval(node.left), _eval(node.right))
        if isinstance(node, ast.UnaryOp):
            return ops[type(node.op)](_eval(node.operand))
        raise ValueError(f"unsupported expression: {expr}")

    tree = ast.parse(expr, mode="eval")
    return _eval(tree.body)


def run_math(input_data: Any) -> Any:
    if isinstance(input_data, dict):
        expr = input_data.get("expr", "0")
    else:
        expr = str(input_data)
    return _safe_eval(expr)


def run_research(input_data: Any) -> Any:
    query = input_data if isinstance(input_data, str) else str(input_data)
    return {"summary": f"research stub for: {query}", "citations": []}


def run_system(input_data: Any) -> Any:
    return {"health": "ok", "input": input_data}


def run_custom(input_data: Any) -> Any:
    return input_data


SLICE_REGISTRY: dict[str, Callable[[Any], Any]] = {
    "slice_math": run_math,
    "slice_research": run_research,
    "slice_system": run_system,
    "slice_custom": run_custom,
}
