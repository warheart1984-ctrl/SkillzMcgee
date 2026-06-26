# Negotiant Core Integration for DAR-Z Online

**Location:** `docs/integrations/darz-online-negotiant-core.md`  
**Status:** Alpha integration plan  
**Core version:** 1.0.0 (⟴)  
**Face layer:** Full-Face Validation State (FFVS)

## 1. Zone Tension Engine

Each zone gets a **cosmos profile**. Examples:

| Zone | Profile bias |
|------|----------------|
| Warfront | high Resistance |
| Dreamlands | high Horizon |
| Ruins | high Memory |

Player actions → negotiation rolls → `coreTick()` → zone mode shifts.

**Kernel:** `src/darz/simulation/multizone.js`  
**Propagation:** `src/darz/simulation/propagation.js`  
**Player actions:** `src/darz/simulation/player.js`

## 2. Faction AI

Factions are tension profiles. Governance face determines posture:

| Posture | Behavior |
|---------|----------|
| Propose | expand |
| Refine | fortify |
| Review | archive |
| Forecast | scout |
| Ratify | consolidate |

**Module:** `src/darz/factions/loop.js`

## 3. Magic System

Spells = tension negotiations. Backlash = magical instability.

## 4. Player-Driven History

Every major event = Core transition. Scripture face generates mythic summaries.

**Logger:** `src/darz/history/scriptureLog.js`

## 5. Paradox Storms

**Table:** `docs/darz/events/paradox-storm-table.md`  
**Engine:** `src/darz/simulation/paradoxStorm.js`

## 6. Live Ops Cockpit

**Indicators:** `src/cockpit/indicators.js` (reproducible from ledger)  
**Replay:** `src/ledger/replay.js`  
**Admin UI:** `src/ui/admin/cockpit/`  
**Canon:** `governance/standards/theta/canon/cockpit-indicators.md`

## 7. Alpha checklist

- [x] Multi-zone kernel
- [x] Zone propagation
- [x] Faction AI loop
- [x] Player action pipeline
- [x] Paradox storm engine
- [x] Scripture history log
- [x] Cockpit indicator mapping spec
- [x] Evidence ledger schema
- [x] Reproducibility tests
- [ ] Wire DAR-Z zone DB → cosmos profiles
- [ ] Expose admin cockpit to operators
- [ ] Chronicle export as official DAR-Z history

## Constitutional boundary

Only `coreTick()` mutates cosmos. Faces interpret. Scripture is non-canonical lore.
