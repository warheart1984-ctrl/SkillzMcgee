# Evidence Ledger Schema (v1.0.0)

**Location:** `governance/standards/theta/canon/evidence-ledger-schema.md`  
**Status:** Canon  
**Version:** 1.0.0

## 1. zoneTick

Represents one world tick for a zone.

**Fields:**

- `id`: string
- `zoneId`: string
- `timestamp`: ISO8601
- `cosmos`: {
  - `becoming`: number
  - `resistance`: number
  - `memory`: number
  - `horizon`: number
  - `equilibrium`: number
  }
- `faces`: {
  - `rpg?`: { `mode`, `backlash`, `cycle` }
  - `governance?`: { `posture` }
  - `scripture?`: { `verse`, `ordering` }
  - `cosmology?`: { `tier` }
  }
- `sourceEvents`: string[]

**Builder:** `src/ledger/zoneTick.js` → `createZoneTick()`

## 2. factionTick

Represents one faction decision step.

**Fields:**

- `id`
- `factionId`
- `zoneId`
- `timestamp`
- `posture`: string
- `action`: string
- `evidenceRefs`: [zoneTickId, governanceTickId]

## 3. governanceTick

Represents one governance decision.

**Fields:**

- `id`
- `timestamp`
- `context`: { `lawContextId`, `missionId`, `escalationLevel` }
- `policyApplied`: policyId
- `decision`: string
- `evidenceRefs`: [zoneTickId, factionTickId]
- `receipts`: [receiptId]

## 4. Replay

All face projections must be reproducible from `cosmos` via `src/ledger/replay.js` → `replayFromLedger()`.

Stored `faces` are a cache; replay is the judicial check.
