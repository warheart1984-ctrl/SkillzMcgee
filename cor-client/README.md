# COR Client (skillzmcgee)

**skillzmcgee is the cockpit** — it visualizes COR Suite outputs from **project-infi**. It does not run governance, proof analysis, or hygiene locally.

## Layout

```
cor-client/
├── config.ts           # Base URL / artifact paths
├── fetchers/           # Fetch cor-state, analysis, receipts, maturity
├── visualizers/        # Lineage graph, maturity map, invariant dashboard
└── adapters/           # (future) alternate sources
```

## Local development

1. Run the pipeline in project-infi:

   ```bash
   cd ../project-infi/cor-suite
   npm install
   npm run pipeline
   ```

2. Start Nova Studio (`npm run nova-studio` from skillzmcgee root).

3. Open **COR Suite** in the left nav. The studio API serves artifacts from `../project-infi/cor-suite/out` at `/api/cor/artifact/*`.

## Production / remote

Set `VITE_COR_SUITE_BASE_URL` or `COR_SUITE_BASE_URL` to the raw GitHub base, e.g.:

```
https://raw.githubusercontent.com/<org>/project-infi/main/cor-suite/out
```

## Nova Studio

Dashboard: `src/nova-studio/cor/CorDashboardPage.tsx` → route `/nova/studio/cor`.
