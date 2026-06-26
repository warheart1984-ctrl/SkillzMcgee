# Nova Studio

**Unified governed IDE shell** — merges the browser slice, governance cockpit, and Python runtime behind one interface.

## Run

```bash
cd skillzmcgee
npm run nova-studio
```

Open **http://localhost:8787**

## Architecture

```
nova-studio/
  public/           # 3-pane UI (continuity | workspace | governance)
  server/
    studio-api.mjs  # HTTP API + static server
    runtime/
      studioRuntime.mjs      # Ledger + live metrics
      governedPipeline.mjs   # Intent → Plan → Reasoning → Capabilities → Receipts
      capabilities.mjs       # read_file, write_file, list_dir (sandboxed)
      specimen.mjs           # Export → import → replay → verify
      constellation.mjs      # Nova / AAES / URG / FOS / CAB federation
  workspace/
    organism.py     # Governed workspace example (blueprint)
```

## API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/state` | GET | Ledger, events, live metrics, governance panel |
| `/api/governed-run` | POST | Full governed pipeline |
| `/api/capability` | POST | Execute single capability |
| `/api/python` | POST | Python `SkillzRuntime` bridge |
| `/api/specimen/export` | POST | Export specimen bundle |
| `/api/specimen/import` | POST | Import specimen bundle |
| `/api/specimen/replay` | POST | Replay fold from specimen |
| `/api/specimen/verify` | POST | Verify specimen integrity |
| `/api/federation/constellation` | GET | Five-runtime constellation status |
| `/api/federation/exchange` | POST | Exchange continuity envelope with peer |

## Repo unity

- **`main`** — SkillzMcGee runtime + Nova Studio (this package)
- **`skillsstack-nova` branch** — superseded by `nova-studio/`; browser slice patterns merged here

See [MERGED.md](./MERGED.md) for migration notes.

## Tests

```bash
npm run test:nova-studio
```
