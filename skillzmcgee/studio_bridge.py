"""Python bridge for Nova Studio — stdin JSON → stdout JSON."""

from __future__ import annotations

import json
import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))


def ping(_payload: dict) -> dict:
    return {"ok": True, "runtime": "skillzmcgee-python", "version": "2.0.0"}


def process_request(payload: dict) -> dict:
    from core.runner import SkillzRuntime
    from ui.governance_ui import UserRequest

    rt = SkillzRuntime()
    req = UserRequest(
        slice=payload.get("slice", "nova"),
        input=payload.get("input", {}),
        actor=payload.get("actor", "nova-studio"),
    )
    receipt = rt.process_request(req)
    return {"ok": True, "receipt": receipt, "state_keys": list(rt.state.keys()) if isinstance(rt.state, dict) else []}


def main() -> None:
    action = sys.argv[1] if len(sys.argv) > 1 else "ping"
    raw = sys.stdin.read()
    payload = json.loads(raw) if raw.strip() else {}

    handlers = {
        "ping": ping,
        "process_request": process_request,
    }
    handler = handlers.get(action)
    if not handler:
        print(json.dumps({"ok": False, "error": f"Unknown action: {action}"}))
        sys.exit(1)

    try:
        result = handler(payload)
        print(json.dumps(result))
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"ok": False, "error": str(exc)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
