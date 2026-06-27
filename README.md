# SkillzMcGee

Constitutional cognitive runtime with Merkle-linked receipts, deterministic reducers, and governed LLM execution.

**Architecture docs:** [BLUEPRINT.md](./BLUEPRINT.md) · [REALITY_STACK.md](./REALITY_STACK.md) · [FRS-1_BLUEPRINT.md](./FRS-1_BLUEPRINT.md) · [SUBSTRATION_ENGINE_BLUEPRINT.md](./SUBSTRATION_ENGINE_BLUEPRINT.md)

**CRK-1 two-plane architecture:** [CONTINUITY_OS.md](./CONTINUITY_OS.md) (public overview) · [constitutional loop poster](./docs/public-diagrams/constitutional-loop-poster.md) · [specification/README.md](./specification/README.md) (WHAT) · [conformance/README.md](./conformance/README.md) (HOW) · [traceability matrix](./conformance/traceability-matrix.md) (proof spine) · [CA-1.0](./specification/constitutional-amendments/CA-1.0-one-artifact-per-stage.md) · [stewardship charter](./meta/stewardship-charter.md) · [v1.0 release notes](./meta/RELEASE_NOTES_v1.0.md)

## Quick start

```bash
cd skillzmcgee
pip install -r requirements.txt
python main.py
```

### Nova Studio (unified IDE)

**You must run from the repo root** (`E:\skillzmcgee` or your clone path — not your home directory).

```powershell
cd E:\skillzmcgee
npm run nova-studio:check    # optional — verify ports and cwd
npm run nova-studio          # API + built React UI → http://localhost:8787
```

Optional hot-reload dev UI (second terminal):

```powershell
cd E:\skillzmcgee
npm run nova-studio:react      # → http://localhost:5174
```

Or launch from anywhere:

```powershell
E:\skillzmcgee\scripts\Start-NovaStudio.ps1
E:\skillzmcgee\scripts\Start-NovaStudio-React.ps1
```

Build the React UI for port 8787:

```powershell
npm run nova-studio:build:react
npm run nova-studio
```

See [nova-studio/NOVA_STUDIO.md](./nova-studio/NOVA_STUDIO.md) and [docs/dev-quickstart-windows.md](./docs/dev-quickstart-windows.md).

### Using SkillzMcGee after cloning

Fresh clones can run SkillzMcGee in deterministic mode, through local Ollama, or
through a Nova/OpenAI-compatible `/v1/chat/completions` endpoint.

See [docs/USING_SKILLZMCGEE.md](./docs/USING_SKILLZMCGEE.md) for the universal
clone/install/provider workflow, and [docs/lawful-nova-slice.md](./docs/lawful-nova-slice.md)
for deeper receipt and slice details.

## Architecture

| Layer | Module | Purpose |
|-------|--------|---------|
| v0.1 | `governance/continuity_ledger.py` | Merkle-linked append-only receipts |
| v0.2 | `governance/reducer.py`, `governance/diff.py` | Multi-slice world model + state diffs |
| v0.3 | `core/adapters/llm_adapter.py` | Lawful, context-bound LLM calls |
| v1.0 | `core/runner.py`, `governance/validator.py` | Unified constitutional runtime loop |
| v1.1 | `federation/federated_ledger.py` | Cross-node signed receipts + federated DAG |
| **FRS-1** | `src/federation/` | Full federated cosmology (JS) — identity, exchange, continuity, migration, reconcile, genesis |
| **Substration Engine** | `src/substrations/` | 30 substrations, cosmic ledger, `federationTick()` |
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
