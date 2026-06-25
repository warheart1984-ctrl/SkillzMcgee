"""SkillzMcGee test suite."""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from core.receipts import build_receipt
from federation.federated_ledger import FederatedLedger, NodeIdentity
from governance.continuity_ledger import ContinuityLedger
from governance.diff import deep_diff
from governance.merkle import hash_payload, merkle_root
from governance.reducer import ReducerV3
from governance.state_accumulator import StateAccumulator
from ui.governance_ui import UserRequest
from core.runner import SkillzRuntime


def test_merkle_hash_stable():
    a = hash_payload({"slice": "x", "input": 1})
    b = hash_payload({"slice": "x", "input": 1})
    assert a == b


def test_ledger_chain():
    ledger = ContinuityLedger()
    r1 = build_receipt(slice_id="slice_math", input_data="1+1", output=2)
    r2 = build_receipt(slice_id="slice_math", input_data="2+2", output=4)
    id1 = ledger.append(r1)
    id2 = ledger.append(r2)
    assert ledger.entries[1]["parent"] == id1
    assert id1 != id2
    ok, errors = ledger.verify_chain()
    assert ok, errors


def test_reducer_v3():
    ledger = ContinuityLedger()
    ledger.append(build_receipt(slice_id="slice_math", input_data="1+1", output=2.0))
    ledger.append(build_receipt(slice_id="slice_system", input_data={}, output={"health": "ok"}))
    state = ReducerV3().reduce(ledger)
    assert state["system"]["run_count"] == 2
    assert state["slices"]["slice_math"]["valid"] is True
    assert state["slices"]["slice_system"]["health"] == "ok"


def test_state_accumulator():
    acc = StateAccumulator()
    acc.apply({"slice": "slice_math", "output": 42, "status": "ok"})
    assert acc.state["slice_math"]["last_output"] == 42


def test_deep_diff():
    diff = deep_diff({"a": 1}, {"a": 2, "b": 3})
    assert "a" in diff["changed"]
    assert "b" in diff["added"]


def test_federated_ledger():
    node_a = NodeIdentity("node-a")
    fed = FederatedLedger(node_a)
    receipt = fed.build_federated_receipt(
        slice_id="slice_math",
        actor="agent-a",
        input_data="3*3",
        output=9,
    )
    rid = fed.publish(receipt)
    assert rid
    assert fed.local.entries[-1]["signature"]


def test_runtime_process():
    with tempfile.TemporaryDirectory() as tmp:
        cfg = {
            "ledger_path": str(Path(tmp) / "ledger.json"),
            "memory_path": str(Path(tmp) / "memory.json"),
            "node_id": "test-node",
        }
        from governance.constitution.contracts import Constitution
        cfg["constitution"] = Constitution()
        rt = SkillzRuntime(cfg)
        receipt = rt.process_request(UserRequest(slice="slice_math", input="10+5"))
        assert receipt["id"]
        assert rt.state["system"]["run_count"] == 1


if __name__ == "__main__":
    tests = [
        test_merkle_hash_stable,
        test_ledger_chain,
        test_reducer_v3,
        test_state_accumulator,
        test_deep_diff,
        test_federated_ledger,
        test_runtime_process,
    ]
    for t in tests:
        t()
        print(f"OK {t.__name__}")
    print(f"\n{len(tests)} passed")
