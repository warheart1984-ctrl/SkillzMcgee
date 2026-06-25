# SkillsStack + NovaSlice

A portable, browser-native **lawful AI slice** for Skills. NovaSlice routes every prompt through a **Law Kernel**, records **governance receipts**, and validates integrity with a **CTS** (Compliance Test Suite).

**Repository:** https://github.com/warheart1984-ctrl/SkillzMcgee

## Architecture

```
skillsstack-nova/
  public/
    index.html          # Dashboard UI
  src/
    nova/
      lawKernel.js      # Intent evaluation against laws
      intentRouter.js   # Route intents → LLM or rejection
      novaSlice.js      # Public entry point
      receipts.js       # Governance receipt store
      cts.js            # Compliance test rules
    runtime/
      webRuntime.js     # Free LLM stub (swap for OpenRouter, etc.)
    ui/
      dashboard.js      # Browser UI wiring
    storage/
      db.js             # IndexedDB persistence
```

## Flow

1. **User prompt** → `novaSlice(prompt)` builds an intent (`type: analysis`, `confidence: 0.4`).
2. **Law Kernel** evaluates the intent against `Laws` (disallowed types, max confidence).
3. If **allowed** → `callFreeLLM` runs; if **rejected** → error output with violations.
4. Every call produces a **receipt** (`REC-NOVA-*`) with intent, output, and law result.
5. **CTS** validates receipt integrity (every call has a receipt; rejections record violations).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use:

- **Run NovaSlice** — process a prompt through the lawful pipeline
- **View Receipts** — inspect governance receipts (in-memory + IndexedDB)
- **Run CTS** — run compliance checks on stored receipts

## Laws (Law Kernel)

| Rule | Effect |
|------|--------|
| `DISALLOWED_TYPES` | Blocks `unsafe`, `abuse`, `fraud` intent types |
| `MAX_CONFIDENCE` | Rejects intents with confidence > 0.95 |

## CTS Rules

| ID | Description |
|----|-------------|
| `CTS-NOVA-001` | Every NovaSlice call produces a receipt |
| `CTS-NOVA-002` | Rejected intents must record violations |

## Extending

- **Real LLM**: Replace `callFreeLLM` in `src/runtime/webRuntime.js` with OpenRouter or another free-tier API.
- **More laws**: Add rules in `src/nova/lawKernel.js`.
- **More CTS rules**: Add checks in `src/nova/cts.js`.

## License

MIT
