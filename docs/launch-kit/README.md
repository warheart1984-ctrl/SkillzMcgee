# Continuity OS v0.1 — Public Launch Kit

## Executive summary

Continuity OS is a constitutional runtime ensuring intelligent systems remain interpretable, consequence-bound, reproducible, and historically accountable.

It doesn't replace AI models — it provides the governed execution, evidence, provenance, and accountability layer intelligent systems build upon.

Built on CRK-1, [CA-1.0](../../specification/constitutional-amendments/CA-1.0-one-artifact-per-stage.md), and the Continuity Layer (threads, events, lineage, replay).

## What it provides

- Constitutional Runtime (CRK-1)
- Continuity Threads, Events, Lineage Graphs
- Semantic Replay, Governance Receipts
- Provenance Ledger, Federation Layer

## Public materials

| Asset | Path |
|-------|------|
| Website | [website.html](./website.html) |
| Extended FAQ | [FAQ.md](./FAQ.md) |
| Loop poster | [../public-diagrams/constitutional-loop-poster.md](../public-diagrams/constitutional-loop-poster.md) |
| Animation script (60s) | [constitutional-loop-animation-script.md](./constitutional-loop-animation-script.md) |
| Launch video script (2–3 min) | [launch-video-script.md](./launch-video-script.md) |
| Launch deck (20 slides) | [LAUNCH_DECK.md](./LAUNCH_DECK.md) |
| Press release | [press-release-v1.0.md](./press-release-v1.0.md) |
| **Press kit (v1.0)** | [press-kit-v1.0.md](./press-kit-v1.0.md) |
| **Public FAQ (v1.0)** | [../public/faq-v1.0.md](../public/faq-v1.0.md) |
| **Architecture diagram (v1.0)** | [../public/architecture-overview-v1.0.txt](../public/architecture-overview-v1.0.txt) |
| Launch narrative | [../public/v1.0-launch-narrative.md](../public/v1.0-launch-narrative.md) |
| Interactive tutorial | [../tutorials/constitutional-loop-tutorial.html](../tutorials/constitutional-loop-tutorial.html) |
| Whitepaper | [../whitepaper/CONTINUITY_OS_v0.1_WHITEPAPER.md](../whitepaper/CONTINUITY_OS_v0.1_WHITEPAPER.md) |

## Public FAQ (summary)

See [FAQ.md](./FAQ.md) (extended) or [../public/faq-v1.0.md](../public/faq-v1.0.md) (v1.0 public site).

**Is Continuity OS an agent?** No — governed substrate for agents.

**Does it replace AI models?** No — infrastructure layer for accountability.

**Is it open source?** Yes — v1.0 is open, reproducible, and auditable.

## Launch checklist

- [x] Public diagrams — `docs/public-diagrams/`
- [x] Specification plane — `specification/`
- [x] Conformance plane — `conformance/`
- [x] Public website copy — [website.html](./website.html)
- [x] Extended FAQ — [FAQ.md](./FAQ.md)
- [x] Launch deck — [LAUNCH_DECK.md](./LAUNCH_DECK.md)
- [x] Press release — [press-release-v1.0.md](./press-release-v1.0.md)
- [x] Interactive tutorial — [../tutorials/](../tutorials/)
- [x] Academic paper pointer — `docs/academic-paper/`

## Get started

```bash
npm run nova-studio    # Unified IDE shell
npm test               # CTS partial
npm run test:governance-gate
```

See [../../specification/README.md](../../specification/README.md).
