# Phase-1 Emergence: Canonical Workspace, Continuity Substrate, and Governance Stance Strip

## Summary

This PR completes the 11-Day Constitutional Runtime Emergence.
AAES-OS is now unified under a single canonical workspace, the continuity substrate is live,
SkillzMcGee has a real Nova/AAIS adapter, and the Governance Stance Strip is implemented across
CLI, HTML cockpit, and Python console.

## Key Changes

### Workspace & Standards

- Declared `aaes-os/` as the canonical workspace root
- Added `pnpm-workspace.yaml` and `tsconfig.base.json`
- Restored AAES packages under `aaes-os/packages/*`
- Restored NIMF source/config
- Restored ops-console service
- Restored Theta standard pack + governance/onboarding/module docs

### Governance & CI

- Rewired `.github/workflows/invariants.yml` to run AAES build + CTS from `aaes-os/`
- Removed obsolete root Python CI job
- CTS: 23 files, 36 tests passing
- Python: 11 passed, 1 skipped
- SkillzMcGee: 10 passed

### Continuity Substrate

- Implemented `SQLiteRunLedgerStore` (persistent receipts + faults)
- Implemented `FileTraceSink` (JSONL spans)

### SkillzMcGee Runtime

- Added Nova/AAIS HTTP LLM adapter
- Added env-based boot wiring
- Added `ask` CLI
- Added Governance Stance Strip (ASCII + HTML + cockpit)
- Added escalation ring (S0–S3) with receipts

### UI / Cockpit

- Added cosmic navy grid, JetBrains Mono, continuity rhythm animations
- Added lineage nodes, tension waveform, law-spine rotation
- Added optional escalation chime

## New Files

- `src/ui/governance_stance_strip.js`
- `src/ui/stance_models.js`
- `src/governance/escalation.js`
- `src/governance/aaes_continuity.js`
- `src/governance/emergence.js`
- `src/governance/operator_log.js`
- `src/ui/event_tile.js`
- `governance/events/day11_emergence.json`
- `scripts/print_stance_strip.mjs`
- `scripts/write_cockpit.mjs`
- `scripts/record_day11_emergence.mjs`
- `tests/governance_stance_strip.test.js`

## Result

AAES-OS now operates as a unified, governed, continuity-bearing runtime with a complete operator cockpit.

## Commit Message (AAES Constitutional Style)

```
Phase-1 Emergence: Re-anchor AAES-OS to canonical workspace; activate continuity substrate; install Governance Stance Strip.

This amendment unifies the AAES organism under aaes-os/, restores the Theta standard pack,
reactivates governance documentation, and rebinds CI to lawful CTS execution.

The continuity substrate is now live (SQLiteRunLedgerStore + JSONL spans).
SkillzMcGee gains a Nova/AAIS adapter, env boot, CLI ask, and the full Governance Stance Strip
(Active Law Context, Mission Thread, Tension Index, Escalation State).

All invariants hold. No drift detected.
```
