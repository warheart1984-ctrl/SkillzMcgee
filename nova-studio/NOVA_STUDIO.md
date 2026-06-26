# Nova Studio

**Unified governed IDE shell** — merges the browser slice, governance cockpit, and Python runtime behind one interface.

## Run

**Always from repo root** (`E:\skillzmcgee`):

```powershell
cd E:\skillzmcgee
npm run nova-studio:check
npm run nova-studio
```

Open **http://localhost:8787**

### From anywhere (PowerShell)

```powershell
E:\skillzmcgee\scripts\Start-NovaStudio.ps1
```

If port 8787 is already in use, the launcher reports the PID and exits — no crash.

## Workflows

### A. Single URL (production React build)

```powershell
cd E:\skillzmcgee
npm run nova-studio:build:react
npm run nova-studio
```

The API serves the React app from `nova-studio/dist-react/` (Investigation, Forensics, Audit, etc.).

### B. Hot reload (two terminals)

**Terminal 1**

```powershell
cd E:\skillzmcgee
npm run nova-studio
```

**Terminal 2**

```powershell
cd E:\skillzmcgee
npm run nova-studio:react
```

Open **http://localhost:5174** (Vite proxies `/api` to 8787).

## Script location

| Script | Where defined | Invoke from repo root |
|--------|---------------|------------------------|
| `nova-studio` | root `package.json` | `npm run nova-studio` |
| `nova-studio:react` | root `package.json` | `npm run nova-studio:react` |
| `dev:react` | `nova-studio/package.json` | use `nova-studio:react` instead |
| `nova-studio:build:react` | root | `npm run nova-studio:build:react` |
| `test:v1` | root | `npm run test:v1` |

See also [docs/dev-quickstart-windows.md](../docs/dev-quickstart-windows.md).

## Port conflicts

```powershell
netstat -ano | findstr :8787
Stop-Process -Id <PID> -Force
cd E:\skillzmcgee
npm run nova-studio
```

## Architecture

```
nova-studio/
  public/           # Legacy static fallback
  dist-react/       # Vite production build (gitignored)
  server/
    studio-api.mjs  # HTTP API + static server
    runtime/        # Ledger, forensics, constitutional data
  workspace/
    organism.py     # Governed workspace example
```

Static serve priority: `dist-react` → `dist` → `public`.

## API (selected)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/run/:capabilityId` | POST | Governed slice execution |
| `/api/state` | GET | Capabilities, receipts, continuity, drift |
| `/api/investigation/receipt/:id` | GET | Investigation dossier |
| `/api/slice/replay` | POST | Replay slice from receipt |
| `/api/continuity/replay` | POST | Continuity replay from checkpoint |
| `/api/audit/state` | GET | COR/CSR/DRA/ledger for auditor dashboard |
| `/api/pgql` | POST | Proof-graph query language |

Full forensic suite: `/api/receipt/diff`, `/api/drift/history`, `/api/drift/anomalies`, `/api/impact`, `/api/governance/impact`, `/api/session/replay`.

## UI routes

| Path | Mode |
|------|------|
| `/nova/studio/capabilities` | Run capabilities, receipts |
| `/nova/studio/continuity` | Continuity timeline |
| `/nova/studio/proof-graph` | Proof graph visualizer |
| `/nova/studio/audit` | Auditor dashboard (`?receipt=` focus) |
| `/nova/studio/forensics` | Receipt diff, drift heatmap, impact |
| `/nova/studio/investigate` | Investigation mode (`?receipt=` or `?decision=`) |
| `/nova/studio/steward` | Steward governance |

## Tests

```powershell
cd E:\skillzmcgee
npm run test:v1
```

## Repo unity

- **`main`** — SkillzMcGee runtime + Nova Studio (this package)
- **`skillsstack-nova` branch** — superseded by `nova-studio/`

See [MERGED.md](./MERGED.md) for migration notes.
