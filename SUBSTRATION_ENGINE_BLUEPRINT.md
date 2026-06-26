# Substration Engine Blueprint

Constitutional substrate for the federated cosmos — 30 autonomous substrations across 5 clusters, orchestrated by `SubstrationEngine` with cosmic ledger observability.

**Related:** [REALITY_STACK.md](./REALITY_STACK.md) · [FRS-1_BLUEPRINT.md](./FRS-1_BLUEPRINT.md)

## Architecture

Each substration is a **descriptor** with optional hooks:

| Hook | Role |
|------|------|
| `analyze(ctx)` | Read federation / continuity state |
| `deriveNeeds(ctx, analysis)` | Emit `SubstrationNeed[]` |
| `planTasks(ctx, needs)` | Emit `SubstrationTask[]` |
| `act(ctx, tasks)` | Execute via ledger, agents, CRK-1, AS-Ω |

```
federationTick(runtime)
  → getContinuityState(baseLedger, continuity)
  → SubstrationEngine.tick(ctx)
      analyze → deriveNeeds → planTasks → act
  → cosmic ledger stream grows
```

## Clusters (30 substrations)

| Cluster | IDs | Purpose |
|---------|-----|---------|
| **I — Continuity organism** | 1–6 | Self-aware repair: needs, tasks, agents, immunity, repair, forecasting |
| **II — Field & attractor** | 7–12 | Stability, drift dampening, migration flow, reconciliation gravity, epochs, collapse |
| **III — Governance & arbitration** | 13–18 | Arbitration, rule harmonization, constitutional drift, sovereignty, quorum, epoch governance |
| **IV — Cosmological evolution** | 19–24 | Genesis, multi-genesis, drift, fork, merge, cosmological memory |
| **V — Temporal & meta** | 25–30 | Time dilation, temporal reconcile, lineage simulation, entanglement, cross-cosmos influence, meta-continuity |

## Module layout

```
src/
├── substrations/
│   ├── types.js
│   ├── engine.js
│   ├── actions.js              # task.action → runtime ops
│   ├── registry.js             # all 30 descriptors
│   ├── cluster_continuity.js
│   ├── cluster_field_attractor.js
│   ├── cluster_governance.js
│   ├── cluster_cosmological.js
│   └── cluster_temporal_meta.js
├── cosmic/
│   ├── cosmic_ledger.js        # stream: "cosmic"
│   ├── continuity_state.js     # real FRS-backed state view
│   └── cosmic_timeline.js      # read-model narrative
├── runtime/
│   └── federated_runtime.js    # createRuntime()
└── federation/
    └── federation_tick.js      # federationTick()
```

## Integration

```javascript
import { bootFederatedNode, foldFederatedSingularity, federationTick } from "./src/federation/index.js";
import { createRuntime } from "./src/runtime/index.js";
import { cosmicTimelineView } from "./src/cosmic/index.js";

const { identity, continuity } = bootFederatedNode();
const runtime = createRuntime(ledger, agents, { continuity });

// After each AS-Ω fold or on a timer:
await federationTick(runtime);

// Observability:
console.log(cosmicTimelineView(runtime.baseLedger).join("\n"));
```

### When to tick

- After each AS-Ω fold (`foldFederatedSingularity`)
- On a timer (`setInterval`)
- When continuity receipts update

## Cosmic ledger

All substration activity logs to `baseLedger.cosmicStream` via `createCosmicLedger()`:

| Event | Meaning |
|-------|---------|
| `CONTINUITY_NEED` | Need derived |
| `CONTINUITY_TASK_EXECUTED` | Task ran |
| `GENESIS_CANDIDATE_NEED` | Genesis evaluation suggested |
| `META_CONTINUITY_TICK` | Health snapshot |
| `REPAIR_LINEAGE` | Lineage repair |
| `RECONCILIATION_APPLIED` | Reconciliation cycle |

`cosmicTimelineView(baseLedger)` maps these into a human-readable storyline.

## Continuity state

`getContinuityState(ledger, continuity)` enriches `GlobalContinuityState` with:

- `conflicts` — from `detectConflicts` (FRS reconcile)
- `globalRootValid` — from `verifyGlobalContinuity`
- `drift`, `timeSkew`, `healthSummary`, `conflictClusters`, `nodeCongestion`
- Signals for immunity, genesis, collapse, temporal meta

## Task → action mapping

`executeContinuityAction` routes tasks to runtime services:

| `task.action` | Runtime call |
|---------------|--------------|
| `recompute_global_root` | `baseLedger.recomputeGlobalRoot()` |
| `run_reconciliation` | `baseLedger.runReconciliationCycle()` |
| `repair_lineage_chain` | `baseLedger.repairLineage(lineageId)` |
| `collapse_subsystem` | `asOmega.collapseSubsystem(id)` |
| `evaluate_genesis_candidate` | `crk1.evaluateGenesisCandidate(params)` |

Stub implementations are provided in `createRuntime()` until wired to full CRK-1 / AS-Ω.

## Tests

```bash
npm test   # includes tests/substrations.test.js
```

## Next steps

1. Wire `createRuntime` stubs to real CRK-1 and AS-Ω collapse APIs
2. Pipe `foldFederatedSingularity` → `federationTick` in the node loop
3. Add UI panel for cosmic timeline (governance dashboard)
4. Tune per-substration thresholds (drift, skew, congestion)
