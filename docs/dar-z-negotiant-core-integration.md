# Negotiant Core Integration for DAR-Z Online

**Status:** Exploratory brief  
**Core version:** 1.0.0 (⟴)  
**Validated faces:** Language, RPG (provisional)

## 1. World Tension Engine

Each zone has a **cosmos profile** (five tensions).

- Player actions in a zone trigger `coreTick()` on that zone's profile.
- Zone **mode** shifts when the dominant tension changes (RPG face `mode`).
- Zone instability surfaces via **backlash** (RPG face `backlash`).
- Operators audit zone history as a sequence of lawful Core transitions — not ad hoc flags.

## 2. Faction AI

Factions are modeled as tension profiles (same five-tuple as characters).

- **Governance face** (`src/faces/governance/view.js`) determines faction **posture**: Propose, Refine, Review, Forecast, or Ratify — mapped from dominant tension.
- Fixed pipeline (commentary only): Propose → Negotiate → Shift → Apply → Record.
- Faction AI selects proposals and reactions from posture; it does not mutate the Core directly — only `coreTick()` does.

## 3. Magic / Ability System

Abilities are **negotiations on specific tensions**.

- Casting leans on one tension (e.g. Horizon for divination, Becoming for creation).
- Resolution uses the Negotiation Roll (1d10 + tension vs difficulty).
- **Backlash** drives risk/reward: high spread → emergent chaos, paradox events, unintended world shifts.
- Abilities never bypass `coreTick()`; they declare which tension field is stressed.

## 4. Player-Driven History

Every major event is a recorded Core transition.

- Event log stores `{ before: cosmos, after: coreTick(cosmos), face: rpg|scripture, timestamp }`.
- **Scripture face** generates mythic summaries of player actions (non-authoritative lore).
- RPG face provides operational mode/backlash for live ops and player-facing UI.

## 5. Cockpit for Live Ops

**core-live** wired into DAR-Z admin UI.

Operators see in real time:

- Zone and faction tension bars (cosmos)
- Mode badges and backlash meters (RPG face)
- Governance posture per faction (governance face)
- Spin controls: +1 / +5 tick, reset to zone seed profile

Reference UI: `src/ui/cockpit/CoreRpgPanel.tsx`, `ui/core-rpg.html`

```bash
npm run core-rpg-ui    # local cockpit preview
npm run core -- --live # CLI REPL
node scripts/cockpit_console.mjs core-live
```

## Constitutional boundary

DAR-Z integration must treat the Negotiant Core as **read-only commentary + lawful tick**:

- Faces interpret; they do not govern.
- No face may mutate cosmos except through `coreTick()`.
- Scripture and narrative hooks are never canonical law.

## Integration checklist

- [ ] Zone cosmos schema in game DB
- [ ] Action → `coreTick` pipeline on server
- [ ] RPG face projection for player HUD
- [ ] Governance face for faction AI posture
- [ ] Scripture face for chronicle / myth log
- [ ] Admin cockpit (`CoreRpgPanel` or equivalent)
- [ ] Backlash event table (threshold > 3)
