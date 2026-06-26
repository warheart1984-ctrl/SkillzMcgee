# Nova Studio — Windows / PowerShell quickstart

Run **one command per line**. Do not paste multi-line blocks where `npm` runs before `cd`.

## Prerequisites

- Node.js 18+
- Repo at `E:\skillzmcgee` (adjust if cloned elsewhere)

## Check environment

```powershell
cd E:\skillzmcgee
npm run nova-studio:check
```

## Single URL (API + production React UI)

```powershell
cd E:\skillzmcgee
npm run nova-studio:build:react
npm run nova-studio
```

Open **http://localhost:8787**

## Two terminals (API + hot reload)

**Terminal 1 — API**

```powershell
cd E:\skillzmcgee
npm run nova-studio
```

**Terminal 2 — Vite dev UI**

```powershell
cd E:\skillzmcgee
npm run nova-studio:react
```

Open **http://localhost:5174** (proxies API to 8787).

## Launchers (any directory)

```powershell
E:\skillzmcgee\scripts\Start-NovaStudio.ps1
E:\skillzmcgee\scripts\Start-NovaStudio-React.ps1
```

If port 8787 is already in use, `Start-NovaStudio.ps1` prints the PID and exits — the server is already up.

## Script reference

| Command | Run from | Purpose |
|---------|----------|---------|
| `npm run nova-studio` | repo root | API server :8787 |
| `npm run nova-studio:react` | repo root | Vite dev :5174 |
| `npm run dev:react` | `nova-studio/` only | Same as above (lower level) |
| `npm run nova-studio:build:react` | repo root | Build UI to `nova-studio/dist-react/` |
| `npm run test:v1` | repo root | Constitutional + Nova Studio tests |

## Troubleshooting

### `ENOENT` for `package.json`

You are not in the repo root. Run:

```powershell
cd E:\skillzmcgee
```

### `EADDRINUSE` on port 8787

Server already running. Use http://localhost:8787 or stop it:

```powershell
netstat -ano | findstr :8787
Stop-Process -Id <PID> -Force
```

### `Missing script: "dev:react"`

Run from repo root: `npm run nova-studio:react` — not `npm run dev:react`.

## Verify before commit

```powershell
cd E:\skillzmcgee
npm run test:v1
npm run nova-studio:build:react
```
