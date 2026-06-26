# Repository Unity — Nova Studio Merge

## Before

| Location | Role |
|----------|------|
| `main` (GitHub) | SkillzMcGee Python/Node runtime |
| `skillsstack-nova` branch | Browser lawful slice (Vite dashboard) |
| `e:\agentic-coding-agent\cockpit` | React NovaShell operator HUD |
| `e:\skillzmcgee\ui\cockpit.html` | Governance stance strip |

## After

**Single entry point:** `skillzmcgee/nova-studio/`

| Former | Now |
|--------|-----|
| skillsstack-nova browser slice | `nova-studio/public/` + `server/runtime/studioRuntime.mjs` |
| agentic-coding-agent cockpit layout | `nova-studio` 3-pane grid (left / center / right) |
| Python `SkillzRuntime` | `skillzmcgee/studio_bridge.py` via `/api/python` |
| Governance cockpit HUD | Right pane CKCE-1 / WOLF-1 + wave signature |
| Specimen freezer panels | `/api/specimen/*` round-trip |
| Federation docs only | `constellation.mjs` — live envelope exchange with 5 peers |

## Run unified studio

```bash
npm run nova-studio
```

## Branch policy

- Develop on **`main`** in `nova-studio/`
- `skillsstack-nova` branch is **archived** — do not add new features there
