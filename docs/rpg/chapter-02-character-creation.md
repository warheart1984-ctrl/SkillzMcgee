# Chapter 2 — Character Creation

**Engine:** Negotiant Core (⟴) v1.0.0  
**Face:** RPG (`src/faces/rpg/view.js`) — Validated View (Provisional)  
**Chapter 2 — Full Rules**

## 2.1 What a Character Is

A Negotiant is defined not by class or race, but by a **tension profile** — a five-dimensional modal signature:

| Tension | Meaning |
|---------|---------|
| **Becoming** | initiative, assertion, creation |
| **Resistance** | defiance, defense, refusal |
| **Memory** | lineage, recall, echoes |
| **Horizon** | foresight, possibility, risk |
| **Equilibrium** | balance, nullification, harmony |

These are not "stats."  
They are **modes of being**.

Your tension profile is lawful input to the Core. The RPG face projects it into `mode`, `cycle`, `backlash`, and `narrativeHook` — commentary only, never constitutional law.

## 2.2 Point Buy System

You begin with **10 tension points**.

**Rules:**

- Minimum per tension: **0**
- Maximum per tension: **5**
- Total must equal **10**

**Example:**

```
Becoming:    3
Resistance:  2
Memory:      1
Horizon:     2
Equilibrium: 2
```

Record your profile on the character sheet. Any profile that violates the rules is not a valid Negotiant at creation.

## 2.3 Determine Your Mode

Your **Mode** is the tension with the highest value. The RPG face exposes the dominant tension name as `mode` (e.g. `Becoming`, `Resistance`).

Mode determines:

- your narrative posture
- your default approach to conflict
- your negotiation advantage

**Mode mapping** (player-facing archetype from `src/faces/rpg/archetypes.js`):

| Dominant tension (`mode`) | Archetype |
|---------------------------|-----------|
| Becoming | Initiator |
| Resistance | Defender |
| Memory | Keeper |
| Horizon | Seer |
| Equilibrium | Balancer |

Dominant tension is read directly from the RPG face (`mode`). The archetype is the playable Mode label.

**Ties:** If two tensions share the highest value, choose the Mode that fits your concept, then adjust one tension by +1 or −1 before play to break the tie.

## 2.4 Backlash Threshold

\[
\text{backlash} = \max(\text{tensions}) - \min(\text{tensions})
\]

The RPG face exposes this as `backlash`.

**Backlash tiers:**

| Backlash | Effect |
|----------|--------|
| 0–2 | Stable |
| 3–4 | Volatile |
| 5+ | Paradox risk |

If backlash exceeds **3**, the GM may trigger a **Backlash Event**:

- paradox
- fracture
- unintended consequence
- mode inversion
- tension bleed

Backlash is a derived metric. It is not a Core invariant.

## 2.5 Negotiation Roll (Core Mechanic)

Every action is a **negotiation**.

### Step 1 — Declare tension

Choose which tension you're leaning on.

### Step 2 — Roll

```
1d10 + chosen tension
```

### Step 3 — Compare to difficulty

Typical DCs:

| DC | Difficulty |
|----|------------|
| 5 | trivial |
| 8 | standard |
| 12 | challenging |
| 15 | extreme |

### Step 4 — Core spins

Regardless of success or failure:

```
cosmos = coreTick(cosmos)
```

Only `coreTick()` may lawfully mutate tension state.

### Step 5 — RPG face updates

Reproject the RPG face. `mode`, `cycle`, and `backlash` update automatically.

On failure, the GM may apply additional backlash pressure (narrative or mechanical), but the Core still advances.

## 2.6 Advancement

At major milestones:

- Add **+1** to any tension (max **7**)
- Recompute mode (RPG face `mode` + archetype)
- Recompute backlash (RPG face `backlash`)

Characters evolve by shifting their tension profile, not by leveling.

Character arcs are literally **tension evolution**.

## 2.7 Character Sheet (reference)

| Field | Source |
|-------|--------|
| Five tensions | Point buy / advancement |
| Dominant tension | RPG face `mode` |
| Archetype (Mode) | `archetypeForMode(mode)` |
| Backlash | RPG face `backlash` |
| Cycle | RPG face `cycle` |
| Narrative hook | RPG face `narrativeHook` (non-canonical) |

---

Previous: [Chapter 1 — Negotiants](chapter-01-negotiants.md)  
Outline: `docs/negotiants_rpg_outline.md`
