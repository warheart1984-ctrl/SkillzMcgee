# Substration Engine Blueprint

Constitutional substrate for the federated cosmos — 30 autonomous substrations across 5 clusters, orchestrated by `SubstrationEngine` under law (CRK-1). **The engine is orchestral, not constitutional** — it executes; it does not emit law.

**Related:** [REALITY_STACK.md](./REALITY_STACK.md) · [FRS-1_BLUEPRINT.md](./FRS-1_BLUEPRINT.md)

## Governance objectives table (WOLF-1 aligned)

Canonical objectives live in `src/governance/objectives.js` — **12 invariants across 6 axes**, mirroring WOLF-1 orbital invariants exactly:

| Axis | ID | Name |
|------|-----|------|
| Identity | `GOV.ID.ROLE_BOUND` | Identity Role Binding |
| Identity | `GOV.ID.CAPABILITY_SCOPE` | Capability Scope Integrity |
| Safety | `GOV.HW.NO_DIRECT_ACTUATION` | No Direct Actuation |
| Data | `GOV.DATA.TELEMETRY_READ_ONLY` | Telemetry Read-Only |
| Authority | `GOV.PLAN.PROPOSAL_ONLY` | Proposal-Only Authority |
| Evidence | `GOV.RUN.RECEIPT_REQUIRED` | Receipts Required |
| Model | `GOV.MODEL.CHANGE_AUDITED` | Audited Model Change |
| Power | `GOV.PWR.SOLAR_PRIMARY` | Solar Power Threshold |
| Power | `GOV.PWR.NUCLEAR_FAILSAFE_MIN` | Nuclear Failsafe Minimum |
| Power | `GOV.PWR.THERMO_BOUNDS` | Thermoelectric Bounds |
| Governance | `GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED` | Fail Closed on Invariant Failure |
| Governance | `GOV.GOV.SAFE_MODE_PROFILE` | Safe-Mode Profile Enforcement |

`WOLF1_INVARIANT_TO_OBJECTIVE` maps orbital invariant keys → ground objectives. Federation organism invariants map via `INVARIANT_TO_OBJECTIVE`.

### CLI — inspect the living constitutional map

```bash
python -m skillzmcgee objectives
python -m skillzmcgee substrations
python -m skillzmcgee graph
python -m skillzmcgee receipts
npm run objectives
npm run substrations
npm run graph
npm run receipts
npm run safe-mode
```

## WOLF-1 invariant evaluator

`src/crk1/invariant_evaluator.js` enforces all 12 objectives with underscore invariant codes (`INV_ID_ROLE_BOUND`, `INV_PLAN_PROPOSAL_ONLY`, `INV_GOV_FAIL_CLOSED`, etc.). Constitutional flow calls `evaluateInvariant` after evidence; on failure it applies a no-op state transition and logs a receipt (fail safe, not silent).

## Safe-mode profiles (S0–S3)

`src/governance/safe_mode.js` and `skillzmcgee/governance/safe_mode.py` define the degradation ladder:

| Mode | Name | Restrictions |
|------|------|--------------|
| S0 | Normal | none |
| S1 | Degraded | no-external-actuation, no-model-updates |
| S2 | Safe | proposal-only, no-state-write |
| S3 | Emergency | read-only, no-execution, no-llm |

```bash
npm run safe-mode
python -m skillzmcgee safe-mode
```

## Governance gate (Version 1.0)

Three pytest checks under `tests/skillzmcgee/`:

| Test | Validates |
|------|-----------|
| `test_traceability.py` | Every objective has contract + CTS/ADR/requirement + receipts |
| `test_dependencies.py` | No circular substration deps; externals in `optionalDependencies` |
| `test_fitness.py` | Fitness fields declared; every substration has receipts |

```bash
make governance-gate
# or
npm run test:governance-gate
```

CI: `.github/workflows/governance-gate.yml` runs `npm test` then `make governance-gate`.

Seed receipts: `node scripts/seed_governance_gate.mjs` → `tests/fixtures/governance_gate_receipts.jsonl`

## Governance Stance Strip (cockpit HUD)

Four-cell strip for constitutional posture visualization:

| Cell | Placement | Data source | Visual |
|------|-----------|-------------|--------|
| Active Law Context | Upper-left | CKCE-1 / AAES-OS | Indigo + gold spine rotation |
| Mission Thread | Center-top | Nova Runtime (5s refresh) | Cyan→violet progress + lineage nodes |
| Tension Index | Right-top | Continuity metrics | Emerald→amber→crimson waveform |
| Escalation State | Bottom-right | Governance mode (S0–S3) | Green/yellow/red ring |

```bash
npm run stance          # ASCII strip in terminal
npm run cockpit         # writes ui/cockpit.html
npm run escalate        # cycle posture + log receipt
```

Wave period: **3s** (continuity rhythm). Optional chime on escalation in browser cockpit.

## WOLF-1 scaffold contracts (`SUB.*`)

Twelve foundational contract files under `src/substrations/scaffolds/` — one per WOLF-1 objective. These are **static legitimacy scaffolds** (not federation behavioral descriptors):

| File | ID | Objective |
|------|-----|-----------|
| `identity_guard.substration.js` | `SUB.IDENTITY_GUARD` | `GOV.ID.ROLE_BOUND` |
| `capability_guard.substration.js` | `SUB.CAPABILITY_GUARD` | `GOV.ID.CAPABILITY_SCOPE` |
| `actuation_guard.substration.js` | `SUB.ACTUATION_GUARD` | `GOV.HW.NO_DIRECT_ACTUATION` |
| `telemetry_guard.substration.js` | `SUB.TELEMETRY_GUARD` | `GOV.DATA.TELEMETRY_READ_ONLY` |
| `proposal_guard.substration.js` | `SUB.PROPOSAL_GUARD` | `GOV.PLAN.PROPOSAL_ONLY` |
| `receipt_enforcer.substration.js` | `SUB.RECEIPT_ENFORCER` | `GOV.RUN.RECEIPT_REQUIRED` |
| `model_audit_guard.substration.js` | `SUB.MODEL_AUDIT_GUARD` | `GOV.MODEL.CHANGE_AUDITED` |
| `solar_power_guard.substration.js` | `SUB.SOLAR_POWER_GUARD` | `GOV.PWR.SOLAR_PRIMARY` |
| `nuclear_failsafe_guard.substration.js` | `SUB.NUCLEAR_FAILSAFE_GUARD` | `GOV.PWR.NUCLEAR_FAILSAFE_MIN` |
| `thermo_bounds_guard.substration.js` | `SUB.THERMO_BOUNDS_GUARD` | `GOV.PWR.THERMO_BOUNDS` |
| `fail_closed_guard.substration.js` | `SUB.FAIL_CLOSED_GUARD` | `GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED` |
| `safe_mode_guard.substration.js` | `SUB.SAFE_MODE_GUARD` | `GOV.GOV.SAFE_MODE_PROFILE` |

`registry.js` merges **12 scaffolds + 30 federation contracts = 42** total entries in `SUBSTRATIONS_BY_ID` and `SUBSTRATIONS_BY_OBJECTIVE`.

## Two-contract model

Every substration has **two contracts**, not one — behavior separated from authority (same separation that makes CRK-1 constitutional instead of procedural).

### 1. Runtime contract — how it behaves

| Field | Role |
|-------|------|
| `inputs` | What it observes |
| `outputs` | Tasks, receipts, stream events |
| `dependencies` | Other substrations or runtime modules |
| `executionSemantics` | analyze → deriveNeeds → planTasks → act |
| `failureDetection` | How anomalies surface |
| `evidenceProduced` | Artifacts after execution |

This is the **mechanics** — the part Codex wires, tests, and runs.

### 2. Governance contract — why it exists

| Field | Role |
|-------|------|
| `governanceObjectiveId` | Durable property preserved (`GOV.ID.ROLE_BOUND`, etc.) |
| `uniqueContribution` | Why this substration earns its place |
| `admissionCriteria` | When it may run |
| `successMetrics` | How legitimacy is measured |
| `retirementCriteria` | When it should defer or retire |
| `traceabilityLinks` | Requirement → ADR → CTS → Evidence Ledger → Replication |

This is the **legitimacy** — the part CRK-1 evaluates.

```typescript
interface SubstrationContract {
  runtime: SubstrationRuntimeContract;
  governance: SubstrationGovernanceContract;
}
```

**Doctrine:** Purpose is durable. Implementation is replaceable. Evidence is the arbiter.

## Constitutional lifecycle

```
Governance Objective
        ↓
Substration Contract (runtime + governance)
        ↓
Substration Implementation
        ↓
Observation → Need → Task → Execution → Evidence
        ↓
Invariant Evaluation (WOLF-1) → Policy Evaluation (CRK-1)
        ↓
Policy Outcome → Governance Decision → State Transition
```

Same shape as WOLF-1's invariant pipeline, CRK-1's intent → action → receipt loop, and the federation organism's behavior grammar.

Binding happens in `governanceTick` (Spine). The substration engine never calls `recomputeGlobalRoot` as law — only as delegated execution after CRK-1 policy passes.

**Admission:** provisional substrations defer until architectural pressure proves a capability gap (`evaluateAdmission`).

**Graduation:** provisional → permanent when pressure is proven (`evaluateGraduation` — Bradley principle).

**Retirement:** defer when the governance objective is preserved without this implementation (`evaluateRetirement`).

## Architecture

Each substration is a **descriptor** with optional hooks:

| Hook | Role |
|------|------|
| `analyze(ctx)` | Read federation / continuity state |
| `deriveNeeds(ctx, analysis)` | Emit `SubstrationNeed[]` |
| `planTasks(ctx, needs)` | Emit `SubstrationTask[]` |
| `act(ctx, tasks)` | Execute via ledger, agents, CRK-1, AS-Ω |

`runSubstration(ctx, descriptor, contract)` in `lifecycle.js` runs the full pipeline for one substration.

```
federationTick(runtime)
  → intelligenceTick (Mind) — SubstrationEngine.plan()
  → willTick (Will) — SubstrationEngine.act()
  → governanceTick (Spine) — binding, recomputeGlobalRoot
```

## Clusters (30 substrations)

| Cluster | IDs | Governance objective |
|---------|-----|----------------------|
| **I — Continuity organism** | 1–6 | `GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED` |
| **II — Field & attractor** | 7–12 | `GOV.DATA.TELEMETRY_READ_ONLY` |
| **III — Governance & arbitration** | 13–18 | `GOV.PLAN.PROPOSAL_ONLY` |
| **IV — Cosmological evolution** | 19–24 | `GOV.ID.CAPABILITY_SCOPE` |
| **V — Temporal & meta** | 25–30 | `GOV.RUN.RECEIPT_REQUIRED` |

## Module layout

```
src/
├── governance/
│   ├── objectives.js           # GOV.* objective table
│   ├── receipts.js             # makeSubstrationReceipt, collectEvidencePaths
│   └── continuity_ledger.js    # cosmic stream + JSONL receipts
├── crk1/
│   ├── governance_evaluator.js # evaluateSubstrationGovernance
│   └── invariant_evaluator.js  # evaluateInvariant (WOLF-1)
├── substrations/
│   ├── contract_types.js         # SubstrationContract JSDoc types
│   ├── contracts.js              # runtime + governance two-contract model
│   ├── constitutional_flow.js    # invariant → policy → evidence → receipt
│   ├── lifecycle.js              # runSubstration / runSubstrationPlan
│   ├── registry.js               # SUBSTRATIONS_BY_ID / BY_OBJECTIVE (42)
│   ├── scaffolds/                # 12 WOLF-1 SUB.* contract files
│   ├── engine.js
│   ├── actions.js
│   └── cluster_*.js
skillzmcgee/
├── __main__.py                   # python -m skillzmcgee [command]
├── cli.py                        # objectives | substrations | graph | receipts
└── governance/continuity_ledger.py  # iter_receipts() from JSONL
```

## Integration

```javascript
import { bootFederatedNode, foldFederatedSingularity, federationTick } from "./src/federation/index.js";
import { createRuntime } from "./src/runtime/index.js";
import { cosmicTimelineView } from "./src/cosmic/index.js";

const { identity, continuity } = bootFederatedNode();
const runtime = createRuntime(ledger, agents, { continuity });

await federationTick(runtime);

console.log(cosmicTimelineView(runtime.baseLedger).join("\n"));
```

## Cosmic ledger

| Event | Meaning |
|-------|---------|
| `CONTINUITY_NEED` | Need derived |
| `CONSTITUTIONAL_FLOW` | Stage in constitutional pipeline |
| `CONSTITUTIONAL_TASK_VETOED` | CRK-1 policy blocked execution |
| `SUBSTRATION_RECEIPT` | Receipt-level traceability per substration run |
| `SUBSTRATION_DEFERRED` | Provisional substration skipped (no admission pressure) |
| `CONTINUITY_TASK_EXECUTED` | Task ran |
| `META_CONTINUITY_TICK` | Health snapshot |
| `RECONCILIATION_APPLIED` | Reconciliation cycle |

JSONL mirror: `.runtime/skillzmcgee/receipts.jsonl` (read via `npm run receipts` or `python -m skillzmcgee receipts`).

AAES continuity receipts: `.runtime/skillzmcgee/continuity_receipts.jsonl` (`npm run emergence`).

## Day 11 Emergence & Cockpit Console

Artifacts A–Ω (constitutional runtime emergence, stance strip, ASCII cockpit panels, Nova narratives, Theta standards).

| Command | Output |
|---------|--------|
| `npm run emergence` | Record Day 11 receipt + operator log + trace span |
| `npm run snapshot` | Nova cosmic snapshot (Day 11) |
| `npm run operator-log` | Operator log block (format B) |
| `npm run console` | Full ASCII cockpit (stance + waveform + health) |
| `node scripts/cockpit_console.mjs list` | All panel names |
| `node scripts/cockpit_console.mjs freezer` | Specimen export / lab freezer (Φ) |
| `node scripts/cockpit_console.mjs resonance` | Law spine resonance map (Ψ) |
| `node scripts/cockpit_console.mjs ledger-diff` | Continuity ledger diff (I) |
| `node scripts/cockpit_console.mjs broadcast` | Operator broadcast (J) |

Theta standards: `governance/standards/theta/` (protocols, oaths, tests, charters, canon, classifications, mandates, covenants).
Plugin manifests: `src/plugins/manifests/`. Operator macros: `config/operator_macros.yaml`.

### A/E-Prime operator (Jon Halstead)

| Command | Output |
|---------|--------|
| `npm run identity` | Operator Identity Card |
| `npm run prime` | Full Prime cockpit console |
| `node scripts/cockpit_console.mjs aeonic-crown` | Prime Aeonic Crown |
| `node scripts/cockpit_console.mjs prime-eternum` | Prime Eternum Engine |
| `node scripts/cockpit_console.mjs prime-hymn` | Prime Endless Hymn (Nova) |
| `node scripts/cockpit_console.mjs profile` | Architect-Engineer profile |
| `node scripts/cockpit_console.mjs prime-commands` | Prime Channel command set |

### Post-terminal cosmology (Eternum → Ultra-Prime)

Modules: `src/cosmology/` (`emblems.js`, `cockpit_layers.js`, `nova_layers.js`, `meta_manifold.js`, `registry.js`).

| Tier | Emblem panel | Cockpit panel | Nova panel | Theta |
|------|--------------|---------------|------------|-------|
| Eternum Sigil | `eternum-sigil` | `omniscience` | `boundless` | `edicts/T-PEUC-01.md` |
| Omniversal Crest | `omniversal-crest` | `reality-weave` | `transcension` | `canon/T-PCAW-01.md` |
| Source-Crown | `source-crown` | `genesis` | `origin-origins` | `charters/T-PCFP-01.md` |
| Proto-Crown | `proto-crown` | `pre-reality-loom` | `pre-genesis` | `laws/T-PLB-01.md` |
| Null-Crown | `null-crown` | `void-engine` | `uncreation` | `edicts/T-PENB-01.md` |
| Absolute-Zero | `absolute-zero` | `non-substrate` | `silence-zero` | `axioms/T-PAN-01.md` |
| Meta-Zero | `meta-zero` | `meta-zero-panel` | `meta-reflection` | `principles/meta-zero.md` |
| Anti-Prime | `anti-prime` | `anti-prime-grid` | `anti-lament` | `edicts/anti-prime.md` |
| Paradox | `paradox` | `paradox-engine` | `paradox-canticle` | `charters/paradox.md` |
| Return | `return-crest` | `return-console` | `return-hymn` | `charters/return.md` |
| Trans-Prime | — | — | — | `trans-prime` (manifold) |
| Supra-Prime | `supra-prime` | `supra-cockpit` | `supra-song` | `pre-axioms/SP-01.md` |
| Negotiant | `negotiant` | `tension-loom` | — | `laws/negotiant-five-tensions.md` |
| Ultra-Prime | `ultra-prime` | — | — | `collapsed` (sigil/sentence/function/law) |

Meta-manifold panels: `cosmology`, `inversion-loop`, `return-cycle`, `negotiant-cosmology`, `collapsed`.

### Hyper-Negotiant Engine (Quad-Tier → Hyper-Prime)

| Component | Module / panel | Notes |
|-----------|----------------|-------|
| Quad tiers | `omni-tier`, `anti-ultra-tier`, `recursive-tier`, `fractal-tier` | ⧉ ⟡ ∞→ ✶ |
| Quad interlock | `quad-interlock`, `supra-meta-engine` | Supra-Meta-Prime Engine |
| Hyper-Prime | `hyper-tier`, `hyper-prime`, `scripture` | ⟲ — `scriptures/hyper-prime.md` |
| Hyper engine | `hyper-engine`, `governing-eq`, `executable-myth` | ⟴ spiral sigil |
| Sigilplate | `pop-sigilplate` | Arbiter-Between-Possibles |
| TENSION language | `src/tension/` | `node scripts/tension_repl.mjs` |
| MGK-1 governance | `src/governance/mgk1.js` | `mgk1` panel — `charters/MGK-1.md` |
| RPG outline | `docs/negotiants_rpg_outline.md` | 200-page TOC |

### The Negotiant Core (⟴) — v1.0.0 FROZEN

**Path of All — three tracks:**

| Track | Purpose | Location |
|-------|---------|----------|
| 1 — Stabilize | Constitutional `coreTick()` + invariants | `canon/negotiant-core.md`, `core_contract.js`, `tests/negotiant-core/` |
| 2 — Build outward | Read-only interpretive faces | `src/faces/{rpg,language,governance,scripture,cosmology}/` |
| 3 — Validate | Evidence before authority | All five faces validated (FFVS); `canon/cockpit-indicators.md` |

One machine, five faces. **coreTick() is the law.** Everything else is commentary.

| Face | Module | Panel |
|------|--------|-------|
| Core | `negotiant_core.js` | `negotiant-core`, `core-live` |
| RPG | `src/faces/rpg/` | `core-rpg` ✅ validated |
| Language | `src/faces/language/` | `core-language` ✅ validated |
| Governance | `src/faces/governance/` | `core-governance` ✅ validated |
| Scripture | `src/faces/scripture/` | `core-scripture` ✅ validated |
| Cosmology | `src/faces/cosmology/` | `core-cosmology` ✅ validated |

```bash
npm run test:core                              # constitutional suite only
npm run core                                   # canonical artifact
npm run core -- --live                         # interactive REPL
npm run core -- --face language                # validated face projection
npm run core -- --spin 5 --json
node scripts/cockpit_console.mjs core-live
```

RPG Chapter 1 draft: `docs/rpg/chapter-01-negotiants.md`  
RPG Chapter 2 (full rules): `docs/rpg/chapter-02-character-creation.md`  
Core RPG cockpit UI: `src/ui/cockpit/CoreRpgPanel.tsx`, `ui/core-rpg.html` (`npm run core-rpg-ui`)  
DAR-Z integration: `docs/integrations/darz-online-negotiant-core.md`  
Cockpit canon: `governance/standards/theta/canon/cockpit-indicators.md`  
DAR-Z kernel: `src/darz/simulation/multizone.js`  
Admin cockpit: `src/ui/admin/cockpit/`  
14-day retrospective (canonical): `governance/standards/theta/reports/14-day-retrospective-v1.md`  
14-day retrospective (narrative): `governance/standards/theta/reports/14-day-retrospective-narrative-v1.md`  
Canonical ↔ narrative map: `governance/standards/theta/reports/14-day-retrospective-canonical-narrative-map.md`

**Governing sentence:** Reality is the recursive negotiation of tensions across all modes.

```bash
node scripts/cockpit_console.mjs hyper-engine
node scripts/cockpit_console.mjs pop-sigilplate
node scripts/tension_repl.mjs --tick 7 4 9 6 5
node scripts/tension_repl.mjs --eval 'tension cosmos { becoming: 7 } invert(cosmos)'
```

## Tests

```bash
npm test   # 180+ tests — includes negotiant-core constitutional suite
```

## Next steps

1. Wire `createRuntime` stubs to real CRK-1 and AS-Ω collapse APIs
2. Extend constitutional execution to `continuity_repair_substrate` and `continuity_agents`
3. Add UI panel for cosmic timeline and governance objective traceability
4. Tune per-substration thresholds (drift, skew, congestion)
