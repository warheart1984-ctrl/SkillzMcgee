# CRK-2 Invariant Suite v1.0

**Enforced by:** Codex (`substrate/crk2-invariants.mjs`)  
**Surfaced in:** envelope, receipt, continuity event, drift engine

## A. Signature mismatch

- Input schema mismatch
- Output schema mismatch
- Capability signature hash mismatch

## B. Nondeterministic output detection

- Output hash differs from expected (deterministic slices)
- Output hash differs from previous runs
- LLM output normalization mismatch (future)

## C. Drift threshold enforcement

- Absolute drift > threshold
- Relative drift > threshold
- Unexpected drift direction

## D. Lineage completeness

- Missing parent receipt
- Broken continuity chain
- Non-monotonic checkpoint
- Orphaned artifact / decision

## E. Envelope integrity

- Missing operator
- Missing capability
- Missing input hash
- Missing output hash
- Missing signature hash

Every violation is recorded in envelope `invariantViolations`, receipt `laws.violations`, and continuity events.
