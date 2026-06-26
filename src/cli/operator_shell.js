/**
 * SkillzMcGee operator shell — onboarding banner and CLI help.
 */

/**
 * @returns {string}
 */
export function renderOnboardingBanner() {
  return `──────────────────────────────────────────────
   WELCOME TO SKILLZMCGEE — OPERATOR SHELL
──────────────────────────────────────────────

Governed. Traceable. Continuity‑Aligned.

Nova/AAIS adapter online
Governance Stance Strip active
Continuity substrate detected
Receipts enabled
Cosmic snapshot ready

Type \`skillz ask "<prompt>"\` to begin.
──────────────────────────────────────────────
`;
}

/**
 * @param {object} [opts]
 * @returns {string}
 */
export function renderAskManPage(opts = {}) {
  const author = opts.author ?? "jon";
  return `ASK(1) — SkillzMcGee Operator Commands

NAME
    ask — send a governed query to the Nova/AAIS adapter

SYNOPSIS
    skillz ask "<prompt>"
    skillz ask --model <id> "<prompt>"
    skillz ask --raw "<prompt>"

DESCRIPTION
    The ask command routes operator queries through the Nova/AAIS HTTP adapter.
    All requests pass through the AAES governance layer, emitting receipts
    and updating the Governance Stance Strip.

OPTIONS
    --model <id>
        Specify a model identifier. Defaults to the configured AAIS model.

    --raw
        Bypass formatting and send the prompt verbatim.

    --no-receipt
        Suppress continuity receipt emission (not recommended).

OUTPUT
    Responses are streamed to stdout. Escalation events, drift warnings,
    and governance posture changes are printed to stderr.

EXAMPLES
    skillz ask "summarize the continuity ledger"
    skillz ask --model aais-ultra "explain the tension index"

FILES
    ~/.skillzmcgee/config
    ~/.skillzmcgee/logs/operator.log

AUTHOR
    ${author} (operator)
`;
}
