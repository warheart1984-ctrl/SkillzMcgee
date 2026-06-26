# Public Diagrams — Continuity OS v0.1

## CRK-1 constitutional loop poster

**Primary public graphic** — website, README, launch deck, print:

- [constitutional-loop-poster.md](./constitutional-loop-poster.md)
- [constitutional-loop-poster.txt](./constitutional-loop-poster.txt) (plain ASCII)

Normative linear diagram: [../../specification/constitutional-loop-v1.0.md](../../specification/constitutional-loop-v1.0.md)

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
