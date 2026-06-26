# Cursor Contract (Operator Surface Authority) v1.0

**Authority:** CRK-1 / Nova Studio v1.0  
**Role:** Operator cockpit — **not** the runtime

## Purpose

Cursor governs the operator-facing half of the system. Cursor owns everything that touches operator experience and frontend integration.

## A. Operator experience

Nova Studio, ops console, navigation/routing/modes, capability inspector, drift visualizer, continuity timeline, receipt feed, Run Capability panel, input editors, operator identity badge, layout/CSS/grid, responsive behavior, browser QA.

## B. Frontend integration

- Poll `GET /api/state`
- Render receipts, continuity events, drift points, capability metadata, envelope status
- Call `POST /api/run/:capabilityId` with operator identity + input JSON

## C. Frontend guarantees

Cursor must ensure:

- No UI state contradicts backend evidence
- No UI asserts correctness — it **displays measured state**
- No UI hides invariant violations
- No UI bypasses governance

## D. Cursor must NOT

- Execute slices
- Generate receipts
- Modify continuity
- Enforce invariants
- Write to ledger
- Mutate canonical state

**Implementation:** `src/nova-studio/`, `nova-studio/public/`

**Related:** [codex-contract-v1.0.md](./codex-contract-v1.0.md), [handoff-protocol-v1.0.md](./handoff-protocol-v1.0.md)
