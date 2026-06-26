# Codex Contract (Runtime Authority) v1.0

**Authority:** CRK-1 / Nova Studio v1.0  
**Role:** Constitutional runtime — **not** the cockpit

## Purpose

Codex governs the backend, substrate, and constitutional execution.

## A. Runtime responsibilities

Slice executor, deterministic runtime, sandbox FS, execution envelope, **CRK-2 invariants**, continuity substrate, ledger, drift engine, API routes.

## B. Backend guarantees

Codex must ensure:

- Every transformation is governed
- Every output is hashed
- Every envelope is validated
- Every invariant is enforced
- Every receipt is recorded
- Every continuity event is emitted
- Every drift point is measured
- Every API response is evidence-backed

## C. Codex must NOT

- Render UI
- Modify operator surfaces
- Override governance decisions
- Skip invariant checks
- Produce unverifiable output

**Implementation:** `nova-studio/server/runtime/`, `substrate/`, `services/`

**Related:** [handoff-protocol-v1.0.md](./handoff-protocol-v1.0.md), [../crk-2/invariants.md](../crk-2/invariants.md)
