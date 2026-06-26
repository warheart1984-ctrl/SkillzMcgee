# Public Diagrams — Continuity OS v0.1

## High-level architecture

```
                 ┌──────────────────────────────┐
                 │        Continuity OS          │
                 │            v0.1               │
                 ├──────────────────────────────┤
                 │   Constitutional Runtime      │
                 │            (CRK‑1)            │
                 ├──────────────────────────────┤
                 │   Continuity Subsystems       │
                 │  Threads · Events · Lineage   │
                 │  Replay · Proofs · Federation │
                 │  Specimens · Waves · Metrics  │
                 └──────────────────────────────┘
```

## CRK-1 runtime stack

See [../../specification/README.md](../../specification/README.md) for the two-plane diagram.

## Thread lifecycle

```
Thread Created → Decision → Outcome → Evidence → Interpretation
      → Governance Receipt → Thread Lineage Update
```

## Governance flow

```
Runtime Action → Governance Evaluation → Receipt → Merkle Anchor → Provenance Append
```
