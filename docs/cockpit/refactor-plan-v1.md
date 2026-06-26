# Cockpit Refactor Plan (v1.0.0)

**Location:** `docs/cockpit/refactor-plan-v1.md`  
**Canon:** `governance/standards/theta/canon/cockpit-indicators.md`  
**Evidence:** `governance/standards/theta/canon/evidence-ledger-schema.md`

## 1. Goals

- Remove non-reproducible indicators.
- Separate observed, derived, and context.
- Ensure every indicator maps to ledger evidence.

## 2. Changes

### 2.1 Observed panel

- **Show:** tensions, mode (from `zoneTick.cosmos`).
- **Source:** `zoneTick.cosmos`.
- **Components:** `TensionBars`, mode key from `computeIndicators()`.

### 2.2 Derived panel

- **Show:** backlash, cosmology tier, risk indicator, governance posture, scripture verse.
- **Source:** `zoneTick.faces.*`, `zoneTick.cosmos`.
- **Components:** `BacklashMeter`, `CosmologyBadge`, `GovernancePanel`, `ScripturePanel`, `RiskIndicator`.
- All algorithms documented in `cockpit-indicators.md`.

### 2.3 Context panel

- **Show:** Active Law Context, Current Mission, Escalation State.
- **Source:** runtime context (`governanceTick.context`).
- Explicitly labeled **"Context (not evidence)"**.

## 3. Removals

- Remove any "health", "stability", or "danger" meters not defined in `cockpit-indicators.md`.
- Remove UI-local state that pretends to be governance state.

## 4. Wiring

Cockpit reads only from:

- `zoneTick` ledger (`src/ledger/zoneTick.js`)
- `factionTick` ledger
- `governanceTick` ledger
- runtime context API

Indicators computed via `src/cockpit/indicators.js`. No direct heuristics inside UI components.

## 5. Implementation status

| Artifact | Path | Status |
|----------|------|--------|
| Indicator engine | `src/cockpit/indicators.js` | ✅ |
| Ledger replay | `src/ledger/replay.js` | ✅ |
| Reproducibility tests | `tests/cockpit/indicators.reproducibility.test.js` | ✅ |
| Admin ZoneInspector | `src/ui/admin/cockpit/ZoneInspector.tsx` | ✅ |
| DAR-Z admin cockpit | `src/ui/admin/cockpit/` | ✅ |

## 6. Order of operations (Path of All)

1. Cockpit-Indicator Mapping Spec (law)
2. Evidence Ledger Schema (evidence)
3. Cockpit Refactor Plan (engineering)
4. Reproducibility Test Suite (enforcement)
