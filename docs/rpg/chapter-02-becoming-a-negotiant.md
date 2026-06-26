# Chapter 2 — Becoming a Negotiant

**Engine:** Negotiant Core (⟴) v1.0.0  
**Face:** RPG (`src/faces/rpg/view.js`) — Validated View (Provisional)  
**Chapter 2 — Draft**

## 2.1 Tension Profile

Each character is defined by five tensions:

- Becoming
- Resistance
- Memory
- Horizon
- Equilibrium

At creation, distribute **10 points** across the five tensions, minimum 0, maximum 5 per tension.

Example spread: Becoming 3, Resistance 1, Memory 2, Horizon 3, Equilibrium 1 (total 10).

Your tension profile is the character's lawful input to the Core. It is not a stat block — it is a modal field.

## 2.2 Modes

Your **dominant tension** (highest value) is your starting **Mode**. The RPG face exposes this as `mode` (the tension name with the highest value).

| Dominant tension (`mode`) | Archetype |
|---------------------------|-----------|
| Becoming | Initiator |
| Resistance | Defender |
| Memory | Keeper |
| Horizon | Seer |
| Equilibrium | Balancer |

Mode is read directly from the RPG face (`mode`). The archetype is the player-facing label for that mode.

Helper: `src/faces/rpg/archetypes.js` maps `mode` → archetype for sheets and UI.

## 2.3 Backlash Threshold

Backlash is:

\[
\text{backlash} = \max(\text{tensions}) - \min(\text{tensions})
\]

The RPG face exposes this as `backlash`.

At creation, note your starting backlash.  
If backlash ever exceeds **3**, the GM introduces a **Backlash Event** (paradox, fracture, unintended consequence).

| Backlash | Risk band |
|----------|-----------|
| 0–2 | Stable |
| 3–4 | Unstable — GM may foreshadow backlash |
| 5+ | Critical — Backlash Event recommended |

## 2.4 Negotiation Roll

When you act:

1. Declare which tension you're leaning on.
2. Roll **1d10 + chosen tension**.
3. GM compares against difficulty (5–15).
4. On success: Core spins (`coreTick`), RPG face updates `mode`, `cycle`, and `backlash`.
5. On failure: Core still spins, but GM may apply backlash.

The Core always advances. Outcomes change interpretation, not constitutional law.

## 2.5 Advancement

On major milestones:

- Add **+1** to any tension (max 7).
- Recompute mode and backlash via the RPG face.
- Character arcs are literally **tension evolution**.

Ties for dominant tension: if two tensions share the highest value, the GM picks which mode narratively fits the milestone, then the player adjusts one tension by +1 or −1 to break the tie before the next session.

## 2.6 Character Sheet (minimal)

| Field | Source |
|-------|--------|
| Tensions (5 values) | Player allocation / advancement |
| Mode | RPG face `mode` |
| Archetype | `archetypeForMode(mode)` |
| Backlash | RPG face `backlash` |
| Cycle | RPG face `cycle` (raw vector) |
| Narrative hook | RPG face `narrativeHook` (non-canonical flavor) |

---

Previous: [Chapter 1 — Negotiants](chapter-01-negotiants.md)  
Outline: `docs/negotiants_rpg_outline.md`
