# Cockpit Indicator Mapping (v1.0.0)

**Location:** `governance/standards/theta/canon/cockpit-indicators.md`  
**Status:** Canon  
**Version:** 1.0.0  
**Constitutional Anchor:** Negotiant Core v1.0.0 (⟴)

## 1. Categories

- **Observed** — direct from evidence (ledger/receipts).
- **Derived** — computed from evidence via documented algorithm.
- **Context** — operational state, not evidence.

## 2. Indicators

### 2.1 Mode

- **Category:** Observed
- **Evidence:** `zoneTick.cosmos`
- **Algorithm:** `argmax([becoming, resistance, memory, horizon, equilibrium])` → tension key
- **Implementation:** `src/cockpit/indicators.js` → `dominantTensionKey()`
- **Receipts:** `zoneTick[id].cosmos`
- **Reproducible:** Yes (deterministic)

### 2.2 Backlash

- **Category:** Derived
- **Evidence:** `zoneTick.cosmos`
- **Algorithm:** `max(tensions) − min(tensions)`
- **Implementation:** `src/cockpit/indicators.js` → `computeBacklash()`
- **Receipts:** `zoneTick[id].cosmos`
- **Reproducible:** Yes

### 2.3 Cosmology Tier

- **Category:** Derived
- **Evidence:** `zoneTick.cosmos`
- **Algorithm:** `bucket(avg(tensions))` → Prime / Anti-Prime / Paradox / Return / Hyper-Prime
- **Implementation:** `src/faces/cosmology/view.js`
- **Receipts:** `zoneTick[id].cosmos`
- **Reproducible:** Yes

### 2.4 Governance Posture

- **Category:** Derived
- **Evidence:** `zoneTick.cosmos`
- **Algorithm:** dominant tension → Propose / Refine / Review / Forecast / Ratify
- **Implementation:** `src/faces/governance/view.js`
- **Receipts:** `zoneTick[id].cosmos`
- **Reproducible:** Yes

### 2.5 Scripture Verse

- **Category:** Derived
- **Evidence:** `zoneTick.cosmos`
- **Algorithm:** dominant tension → verse template
- **Implementation:** `src/faces/scripture/view.js`
- **Receipts:** `zoneTick[id].cosmos`
- **Reproducible:** Yes

### 2.6 Active Law Context

- **Category:** Context
- **Evidence:** none (runtime input)
- **Definition:** currently applicable constitutional/policy scope.
- **Must not** be stored as evidence.

### 2.7 Current Mission / Thread Focus

- **Category:** Context
- **Evidence:** none (runtime input)
- **Definition:** current objective.
- **Must not** be stored as evidence.

### 2.8 Risk / Tension Indicator

- **Category:** Derived
- **Evidence:** `zoneTick.cosmos`, `zoneTick.faces.rpg.backlash`, `zoneTick.faces.cosmology.tier`
- **Algorithm:** `risk = tierToScore(tier) + (backlash ≥ 5 ? 1 : 0)`
- **tierToScore:** Prime=0, Anti-Prime=1, Paradox=2, Return=1, Hyper-Prime=3
- **Implementation:** `src/cockpit/indicators.js`, `src/cockpit/tierScore.js`
- **Receipts:** `zoneTick[id]`
- **Reproducible:** Yes

### 2.9 Override / Escalation State

- **Category:** Context
- **Evidence:** `governanceTick.events`
- **Definition:** current governance authority level.
- **Must** be derived from recorded governance events, not UI state.

## 3. Operator Alerts

| Alert | Condition |
|-------|-----------|
| Yellow | backlash ≥ 3 OR tier = Anti-Prime |
| Orange | backlash ≥ 5 OR tier = Paradox |
| Red | tier = Hyper-Prime OR Paradox Storm triggered |

## 4. Constitutional Boundary

Cockpit indicators are **commentary on evidence**. They do not mutate the Core. Only `coreTick()` is lawful mutation.
