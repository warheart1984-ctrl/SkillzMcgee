# SkillzMcGee — NovaSlice v0 Governed Runtime

Browser-first workflow for Skillz: lawful slice execution, append-only receipts, and continuity-aware LLM calls.

## What this is

Not just a logging wrapper. The app runs a **v0 governed runtime**:

| Piece | Role |
|-------|------|
| **Continuity ledger** | Append-only receipt history (IndexedDB + in-memory) |
| **State accumulator** | `state = reduce(ledger)` — last output per slice |
| **Validator** | K0 invariants on every receipt before append |
| **LLM adapter** | Prompts conditioned on slice state; every call logged |
| **Boot** | Reload persisted receipts → rebuild ledger + state |
| **Absolute Singularity** | AS-Ω fold: lineage + Merkle + nonlinear wave + DAR-Z fields + H_Ω |

Conceptual mapping (from your architecture notes):

- **Provenance** → receipt metadata (who, when, slice, intent)
- **Lineage** → ordered receipt chain / `parentId`
- **Continuity** → append-only ledger + dashboard history
- **Absolute Singularity** → `foldAbsoluteSingularity()` — see `docs/AS-OMEGA.md`

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Usage

1. Enter a prompt and click **Run Nova Slice**.
2. Intent is evaluated by the law kernel; allowed runs go through the LLM adapter.
3. Each run appends a governed receipt (ok or error).
4. Receipts persist in IndexedDB and reload on refresh.

**CTS:** Run **Run CTS** after at least one slice — `CTS-NOVA-001` checks that receipts exist.

## Project layout

```
src/
  governance/          # ledger, validator, reducer, invariants
  singularity/         # AS-1 fold, wave math, DAR-Z tensors
  runtime/
    boot.js            # bootGovernedRuntime, appendGovernedReceipt, LLM factory
    webRuntime.js      # browser LLM stub
  core/adapters/
    llmAdapter.js      # continuity-aware LLM wrapper
  nova/
    intentRouter.js    # law kernel → adapter or reject
    novaSlice.js       # public slice API
    lawKernel.js
    cts.js
  storage/db.js        # IndexedDB persistence
  ui/dashboard.js      # boot on load, render receipts
public/
  index.html
tests/
  governance.test.mjs
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Governance unit tests (Node) |

## Governed receipt shape

```js
{
  id, timestamp, actor, slice, intent, output,
  status: "ok" | "error",
  laws: { allowed, violations? },
  parentId?
}
```

## Roadmap (v0 → v1)

- **v0.1** — Receipt hashing + parent-hash chain
- **v0.2** — Typed state schemas + diffs
- **v0.3** — LLM output validation + prompt templates
- **v1.0** — Full constitutional runtime loop

## License

MIT
