# SkillzMcGee

Constitutional cognitive runtime with Merkle-linked receipts, deterministic reducers, and governed LLM execution.

**Architecture docs:** [BLUEPRINT.md](./BLUEPRINT.md) · [REALITY_STACK.md](./REALITY_STACK.md)

## Quick start

```bash
cd skillzmcgee
pip install -r requirements.txt
python main.py
```

## Architecture

| Layer | Module | Purpose |
|-------|--------|---------|
| v0.1 | `governance/continuity_ledger.py` | Merkle-linked append-only receipts |
| v0.2 | `governance/reducer.py`, `governance/diff.py` | Multi-slice world model + state diffs |
| v0.3 | `core/adapters/llm_adapter.py` | Lawful, context-bound LLM calls |
| v1.0 | `core/runner.py`, `governance/validator.py` | Unified constitutional runtime loop |
| v1.1 | `federation/federated_ledger.py` | Cross-node signed receipts + federated DAG |
| v2.0 | `governance/multi_agent.py` | Multi-agent scheduler + intent graph |
| CRK-1 | `crk1/integration.py` | CRK-1 receipt/reducer/validator mapping |
| DAR-Z | `darz/cosmophysics.py` | Cosmophysics reducer + timeline invariants |

## Runtime loop

```
observe → execute slice → build receipt → validate → append → reduce → persist → UI
```

State is always `state = reduce(ledger)`. No hidden state.

## Tests

```bash
# Python runtime
python tests/test_skillzmcgee.py

# AS-Ω singularity (Node 18+)
npm test
```

## AS-Ω Singularity Fold

JavaScript module at `src/singularity/` — folds a governed ledger into a fingerprint:

```
attachLineage → hashReceipt → merkleRoot → integrateWave → solveFields → ASΩ
```

```javascript
import { foldSingularity } from "./src/singularity/index.js";

const asOmega = foldSingularity(ledger);
// { fingerprint, merkle, wave, darz, lineages, ledger, meta }
```

| Module | Spec | Purpose |
|--------|------|---------|
| `lineage.js` | AS-2 | parentId / lineageId / depth chains |
| `merkle.js` | AS-3 | Receipt hashing + Merkle roots |
| `nonlinearWave.js` | AS-4 | Salience/failure wave dynamics |
| `darzFields.js` | AS-5 | DAR-Z field equations |
| `absoluteSingularity.js` | AS-Ω | Full fold orchestrator |
