# FRS-1 — Federated Reality Stack Blueprint

**Phase:** I  
**Version:** FRS-1.0  
**Stack:** Reality Stack v2.0 (adds **L8 Federation Layer**)  
**Repo:** https://github.com/warheart1984-ctrl/SkillzMcgee

Turn a single-node Reality Stack into a **multi-node federated cosmos** where each node runs AS-Ω and can sync, compare, and exchange worldlines.

---

## Goal

| Before (v1.0) | After (FRS-1 / v2.0) |
|---------------|----------------------|
| Single node | Multi-node federation |
| Local Merkle chain | Global Merkle + federated lineage |
| Isolated AS-Ω | Exchangeable CosmosSnapshots |
| Local worldlines | Migratable worldlines across nodes |
| Manual conflict handling | Reconciliation plans + FinalizedState receipts |
| Solo genesis | Coordinated multi-cosmos genesis |

---

## Updated Layer Model (Reality Stack v2.0)

| Layer | Name | Role |
|-------|------|------|
| **L8** | Federation Layer (FRS-1) | Multi-node continuity + cosmos exchange |
| L7 | Intent Interface Layer | Human → system intent |
| L6 | Cognitive Execution Layer | Agent runtime |
| L5 | CRK-1 Constitutional Kernel | Governance |
| L4 | AS-Ω Cosmological Fold Engine | Cosmophysics |
| L3 | Worldline Continuity Layer | Provenance |
| L2 | Anchoring Substrate | Storage + archives |
| L1 | Foundational Existence Layer | Physical reality |

---

## FRS-1 Modules

```
src/federation/
├── frs.js                    # Orchestrator (boot, fold, publish, ingest)
├── frs_identity/             # Node passport
├── frs_exchange/             # Inter-cosmos communication
├── frs_continuity/           # Global Merkle + federated lineage
├── frs_migration/              # Worldline movement
├── frs_reconcile/              # Conflict resolution
└── frs_genesis/                # Multi-cosmos resets
```

### Module map

| Module | Role | Key objects |
|--------|------|-------------|
| `frs_identity` | Stable node identity + fingerprint | `NodeId`, `NodeFingerprint`, `NodeIdentity` |
| `frs_exchange` | Signed state exchange | `ExchangeEnvelope`, `CosmosSnapshot` |
| `frs_continuity` | Cross-node continuity | `NodeRoot`, `GlobalContinuityState`, `FederatedLineageEntry` |
| `frs_migration` | Worldline migration | `WorldlineExport`, `WorldlineImport`, `MigrationReceipt` |
| `frs_reconcile` | Conflict resolution | `ConflictSet`, `ReconciliationPlan`, `FinalizedState` |
| `frs_genesis` | Coordinated resets | `GenesisEvent`, `GenesisSignature`, `GenesisTopology` |

---

## Core Invariants (F1–F6)

| ID | Law |
|----|-----|
| **F1** | NodeFingerprint = deterministic hash(CRK config + AS-Ω version + environment) |
| **F2** | CosmosSnapshot must be signed, Merkle-verifiable, reproducible from sender ledger |
| **F3** | Migrated worldlines retain lineageId, ancestry, MigrationReceipt on both nodes |
| **F4** | GlobalMerkleRoot = deterministic hash(all node roots + topology) |
| **F5** | Reconciliation produces ReconciliationPlan + logs discarded states + FinalizedState receipt |
| **F6** | Genesis events signed by participating nodes, pre/post fingerprints recorded, replayable |

---

## Data Flow

```
Node runs normally
  → AS-Ω emits CosmosState (fingerprint + merkle + wave + fields)
  → frs_identity tags with NodeId + NodeFingerprint
  → frs_continuity updates GlobalMerkleRoot + FederatedLineageMap
  → frs_exchange sends CosmosSnapshot to peers
  → frs_migration moves selected worldlines
  → frs_reconcile resolves conflicts
  → frs_genesis coordinates shared resets
```

---

## frs_identity

**Path:** `src/federation/frs_identity/`

```javascript
import { loadNodeIdentity, bootNodeIdentity, generateNodeFingerprint } from "./src/federation/frs_identity/index.js";

const { identity, rekeyReceipt } = bootNodeIdentity();
// identity.nodeId, identity.fingerprint.hash
```

**Sub-invariants:** I1 determinism · I2 sensitivity · I3 NodeId stability · I4 verifiable · I5 NodeRekeyReceipt on drift

---

## frs_exchange

**Path:** `src/federation/frs_exchange/`

```javascript
import { createEnvelopeFromIdentity, signWithNodeKey, sendEnvelope, receiveEnvelope } from "./src/federation/frs_exchange/index.js";
```

**Payload types:** `fingerprint` | `snapshot` | `worldline` | `genesis` | `rejection`

**Receipts emitted:**
- `FederatedSnapshotReceipt`
- `WorldlineExportReceipt` / `WorldlineImportReceipt`
- `GenesisSignatureReceipt`
- `FederatedRejectionReceipt`

---

## frs_continuity

```javascript
import { updateNodeRoot, computeGlobalRoot, verifyGlobalContinuity } from "./src/federation/frs_continuity/index.js";
```

```typescript
interface GlobalContinuityState {
  nodeRoots: NodeRoot[];
  globalRoot: string;
  federatedLineages: Record<string, FederatedLineageEntry>;
}
```

---

## frs_migration

```javascript
import { prepareWorldlineExport, acceptWorldlineImport, recordMigration } from "./src/federation/frs_migration/index.js";
```

Every migration produces a `MigrationReceipt` with Merkle proof (M1–M4).

---

## frs_reconcile

```javascript
import { detectConflicts, proposeReconciliation, applyReconciliation } from "./src/federation/frs_reconcile/index.js";
```

Strategies: `rollforward` | `rollback` | `merge` | `quarantine`  
CRK-1 can veto unsafe plans via `validateReconciliationPlan()`.

---

## frs_genesis

```javascript
import { proposeGenesis, signGenesis, commitGenesis, verifyGenesis } from "./src/federation/frs_genesis/index.js";
```

Genesis valid only when quorum met (G1). Pre/post fingerprints required (G2).

---

## Orchestrator API

**Path:** `src/federation/frs.js`

```javascript
import {
  bootFederatedNode,
  foldFederatedSingularity,
  publishCosmosSnapshot,
  ingestFederatedEnvelope,
} from "./src/federation/index.js";

// Boot
const { identity, rekeyReceipt, continuity } = bootFederatedNode();

// Fold with federated metadata
const { asOmega, continuity: updated } = foldFederatedSingularity(ledger, identity, continuity);

// Exchange snapshot to peer
await publishCosmosSnapshot(asOmega, identity, ledger.length, peerNodeId);

// Ingest from peer
const { event, continuity: merged, conflicts } = ingestFederatedEnvelope(envelope, localNodeId, continuity);
```

---

## AS-Ω Integration

`foldSingularity()` now accepts federated meta:

```javascript
meta: {
  nodeId,
  nodeFingerprint,
  frsVersion: "FRS-1.0",
  globalMerkleRoot,  // when wired from continuity
  lineageRoots,
}
```

---

## CRK-1 Federation Rules (L5 extensions)

- All federated messages must be signed
- All worldline imports must preserve provenance (F3)
- Genesis events require quorum signatures (G1)
- Reconciliation strategies subject to constitutional veto (R4)

---

## Tests

```bash
npm run test:frs    # 10 FRS-1 tests
npm test            # singularity + FRS
```

---

## Implementation Status

| Module | Status |
|--------|--------|
| frs_identity | ✅ Implemented |
| frs_exchange | ✅ Implemented (in-memory transport stub) |
| frs_continuity | ✅ Implemented |
| frs_migration | ✅ Implemented |
| frs_reconcile | ✅ Implemented |
| frs_genesis | ✅ Implemented |
| frs orchestrator | ✅ Implemented |
| Network transport | 🔲 Planned (HTTP/WebSocket) |
| Python runtime wire | 🔲 Planned |

---

## Related Docs

- [REALITY_STACK.md](./REALITY_STACK.md) — 7→8 layer model
- [BLUEPRINT.md](./BLUEPRINT.md) — SkillzMcGee module detail

---

*FRS-1 — federated cosmology protocol: identity, exchange, continuity, migration, reconciliation, genesis.*
