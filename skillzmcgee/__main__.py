"""SkillzMcGee CLI — python -m skillzmcgee [command]"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))


def run_demo() -> None:
    from core.runner import runtime_loop

    runtime_loop()


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(prog="skillzmcgee", description="SkillzMcGee constitutional runtime")
    parser.add_argument(
        "command",
        nargs="?",
        default="run-demo",
        choices=["objectives", "substrations", "receipts", "graph", "safe-mode", "run-demo"],
        help="objectives | substrations | receipts | graph | safe-mode | run-demo (default)",
    )
    args = parser.parse_args(argv)

    if args.command == "objectives":
        from skillzmcgee.cli import cli_objectives

        cli_objectives()
    elif args.command == "substrations":
        from skillzmcgee.cli import cli_substrations

        cli_substrations()
    elif args.command == "receipts":
        from skillzmcgee.cli import cli_receipts

        cli_receipts()
    elif args.command == "graph":
        from skillzmcgee.cli import cli_graph

        cli_graph()
    elif args.command == "safe-mode":
        from skillzmcgee.cli import cli_safe_mode

        cli_safe_mode()
    elif args.command == "run-demo":
        run_demo()
    else:
        print(f"Unknown command: {args.command}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
