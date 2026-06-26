# MRI-1.0 — Minimal Reference Implementation

**Purpose:** Smallest executable CRK-1 that satisfies all invariants, contracts, and governance requirements.

## Components

| Component | Spec | Repo pointer |
|-----------|------|--------------|
| Five canonical objects | COM-1.0 | `governance/constitution/schemas.py` |
| Invariant checks | K0–K12 | `governance/constitution/invariants.py`, `src/crk1/` |
| Receipt generator | REC-HDR-1.0 | `src/governance/receipts.js`, `nova-studio/server/runtime/studioRuntime.mjs` |
| Drift updater | CE/SE | `src/singularity/absoluteSingularity.js` (fold metrics) |
| Execution loop | required-behaviors | `governance/validator.py`, `nova-studio/server/runtime/governedPipeline.mjs` |

## Non-goals

MRI-1.0 does not include optimization, parallelism, multi-agent support, or full interface adapters.

## Docs

See `docs/` for implementation notes. Target: standalone `src/` in this directory (future extraction).
