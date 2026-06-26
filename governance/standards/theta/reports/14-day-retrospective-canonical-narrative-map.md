# 14-Day Retrospective — Canonical ↔ Narrative Mapping

**Document ID:** T-RPT-V10-14D-MAP  
**Version:** 1.0.0  
**Program:** Constitutional Runtime Program (Negotiant Core v1.0.0)  
**Classification:** Dual-Canon Mapping Layer  
**Prepared:** 2026-06-26  
**Status:** Canonical

**Paired documents:**

| Canon | Document |
|-------|----------|
| Formal | `14-day-retrospective-v1.md` |
| Narrative | `14-day-retrospective-narrative-v1.md` |

This document is not prose — it is a mapping layer. It shows how the Narrative Version corresponds to the Canonical Version, and where the narrative adds emotional, contextual, or experiential framing.

It maintains **dual canons:**

- **Formal Canon** — the architecture
- **Narrative Canon** — the story of how it was built

---

## 1. Document Purpose

| Canonical Version | Narrative Version | Mapping |
|-------------------|-------------------|---------|
| Provides a formal retrospective of the 14-day development cycle. | Tells the story of how the system emerged through collaboration, intuition, and rapid iteration. | Narrative reframes the same events as lived experience rather than technical milestones. |

---

## 2. Structure and Tone

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Technical, precise, chronological, objective. | Expressive, founder-voice, emotional, contextual. | Both follow the same timeline; narrative adds human texture. |

---

## 3. Phase I (Days 1–11)

### 3.1 Core Runtime Development

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Implemented the Negotiant Core… deterministic… face-independent. | The core arrived as a feeling… shaped like blacksmiths… alive by Day 3. | Narrative dramatizes the emergence of the core; the underlying facts match exactly. |
| `src/cosmology/negotiant_core.js`, `tests/negotiant-core/` | Days 1–3: ignition → heartbeat → physics | Same artifact: `coreTick()` as sole lawful mutation |

### 3.2 Interpretive Face Layer

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Lists five faces, their functions, and validation. | Describes the faces "waking up" and emerging naturally. | Narrative adds metaphor; the faces and their roles are identical. |
| FFVS — `governance/standards/theta/validations/` | "Faces don't get to decide anything. They only get to interpret." | Same constitutional principle |

### 3.3 Multi-Zone Simulation

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Defines zones, propagation, paradox storms. | Describes zones as "pockets of tension physics" and storms as "chaotic, beautiful, terrifying." | Narrative adds emotional framing; technical content is unchanged. |
| `src/darz/simulation/multizone.js`, `paradoxStorm.js` | Day 8 — first paradox storm | Same subsystem |

### 3.4 Governance Philosophy

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Defines evidence / context / policy / governance / runtime separation. | Describes long conversations with Dar-z and the moment governance "emerged." | Narrative contextualizes the same decisions as collaborative insight. |
| Principles in §3.4 canonical report | "The cockpit must visualize governance, not define it." | Same design constraint → `cockpit-indicators.md` |

---

## 4. Phase II (Days 12–14)

### 4.1 Evidence Ledger

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Formal schema for zoneTick, factionTick, governanceTick. | Describes Bradley helping "formalize the evidence ledger." | Narrative compresses technical detail into a human moment; content matches. |
| `evidence-ledger-schema.md`, `src/ledger/zoneTick.js` | Bradley — formalize ledger | Same artifacts |

### 4.2 Cockpit Semantics

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Defines reproducible indicators, mapping spec, algorithms. | Describes the cockpit transforming from a dashboard into a governed instrument. | Narrative reframes the same transformation as a conceptual breakthrough. |
| `cockpit-indicators.md`, `src/cockpit/indicators.js` | Day 14 — governed observability instrument | Same outcome |

### 4.3 Ledger Replay Engine

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Describes deterministic recomputation and auditability. | Implied through "a world that can't lie to itself." | Narrative expresses the philosophical implication of replay; canonical expresses the mechanism. |
| `src/ledger/replay.js`, `assertReplayConsistency()` | Dar-z: "can't lie to itself" | Same guarantee |

### 4.4 Semantic Refinement with Bradley

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Lists Bradley's contributions precisely. | Describes Bradley as sharpening and clarifying the system. | Narrative adds personality; canonical lists exact contributions. |
| §4.4 canonical report | Days 12–14 — Bradley sharpens, does not reshape | Same scope of work |

---

## 5. Architectural Breakthroughs

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Lists breakthroughs as bullet points. | Describes them as realizations ("the system clicked into place"). | Narrative expresses the emotional impact; canonical expresses the structural impact. |
| §5 canonical report | Day 11 — governed computational universe | Same milestone |

---

## 6. Governance Decisions

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Formal list of constitutional decisions. | Embedded in story moments ("faces don't get to decide anything"). | Narrative shows the conversations that produced the decisions. |
| §6 canonical report | Recurring dialogue between builders | Same decisions, different register |

---

## 7. Reproducibility Guarantees

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Determinism, auditability, no heuristics. | "A world that can't lie to itself." | Narrative expresses the philosophical meaning of reproducibility. |
| `tests/cockpit/indicators.reproducibility.test.js` | §8 narrative — resists drift, remains reproducible | Same judicial enforcement |

---

## 8. Final State of Version 1.0

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| Lists all components completed by Day 14. | Describes the feeling of realizing the system was complete. | Narrative adds emotional closure; canonical adds structural closure. |
| §8 artifact table | §9 narrative — foundation, universe, inevitable | Same deliverable set |

---

## 9. Conclusion

| Canonical | Narrative | Mapping |
|-----------|-----------|---------|
| States the system is ready for Version 1.1 and DAR-Z Alpha. | States the system is "a universe" and "a foundation." | Narrative expresses the magnitude; canonical expresses the readiness. |
| `docs/integrations/darz-online-negotiant-core.md` | "Ready for everything that comes next." | Same forward path |

---

## 10. Summary of Differences

### Canonical Version

- Objective
- Technical
- Architectural
- Chronological
- Governance-grade
- Suitable for publication or review

### Narrative Version

- Subjective
- Emotional
- Expressive
- Founder-voice
- Suitable for onboarding, storytelling, and vision alignment

### Shared Truth

Both versions describe the **same events**, **same breakthroughs**, **same architecture**, and **same outcomes** — the narrative adds the human dimension.

---

## 11. Timeline Alignment (Quick Reference)

| Days | Narrative chapter | Canonical section |
|------|-------------------|-------------------|
| 1 | §1 The Beginning | Phase I opens |
| 1–3 | §2 The Core Appears | §3.1 Core Runtime |
| 4–6 | §3 The Faces Wake Up | §3.2 Interpretive Faces |
| 7–8 | §4 The World Splits Into Zones | §3.3 Multi-Zone Simulation |
| 9–11 | §5 Governance Emerges | §3.4 Governance Philosophy |
| 11 | §6 The System Clicks Into Place | End of Phase I / FFVS |
| 12–14 | §7 Bradley Arrives | Phase II (§4) |
| 13 | §8 The Realization | §7 Reproducibility Guarantees |
| 14 | §9 The Ending | §8 Final State, §9 Conclusion |

---

**End of Mapping Layer**
