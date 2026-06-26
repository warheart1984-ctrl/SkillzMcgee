# ADR-001: Nova Studio Unified Governed IDE Shell

## Status

Accepted

## Context

Governed runtime capabilities (ledger, receipts, capabilities, specimen, federation) existed across multiple UIs (vanilla nova-studio, React cockpit, skillsstack-nova) without a single product surface.

## Decision

Establish `nova-studio/` on port 8787 as the unified HTTP host for the governed IDE shell, with `src/nova-studio/` as the React route scaffold for future embed of cockpit panels.

## Consequences

- Positive: Single API surface (`/api/*`), live ledger JSONL, specimen round-trip
- Negative: React cockpit and vanilla shell still separate until Phase 3 embed
- Neutral: `skillsstack-nova` branch archived per MERGED.md

## Linked Normative Requirements

- CRK1-R040 — Constitutional Loop Completeness
- CRK1-R042 — Governance Visibility
- CRK1-R004 — Replayability

## Verification Method

CTS-M4, CTS-G1; `tests/nova_studio.test.js`

## Evidence Required

Governed pipeline receipts, specimen export bundle, `/api/state` ledger

## Traceability Links

```
CRK1-R040 → ADR-001 → nova-studio/server/runtime/governedPipeline.mjs → tests/nova_studio.test.js → ledger.jsonl → receipt → entry:loop
```

## Version

1.0

## Author

SkillzMcGee maintainers
