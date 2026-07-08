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

## Canonical Scorecard Addendum

### Repository Purpose

Constitutional cognitive runtime with Merkle-linked receipts, deterministic reducers, and governed LLM execution.

### Current Maturity

Prototype

### Build Status

Observed: fresh `npm run nova-studio:build` passed in this pass. Hypothesized: the runtime and Nova Studio surfaces are cohesive. Unknown: replay verification across the broader surface is still incomplete.

### Test Status

Observed: fresh `npm test` passed in this pass. Hypothesized: the suites cover the intended prototype slice. Unknown: replay verification across every surface is still incomplete.

### Smoke Test Status

Observed: fresh `npm run nova-studio` served HTTP 200 on `http://localhost:8787` in this pass. Hypothesized: the chosen prototype slice is repeatable. Unknown: replay verification across every surface is still incomplete.

### Documentation Status

Observed: architecture, conformance, release notes, and scorecard docs exist. Hypothesized: the docs are sufficient for a new contributor. Unknown: whether every link is current across all future revisions.

### Evidence Status Taxonomy

- Observed - verified by implementation, testing, or operational evidence
- Hypothesized - expected based on architecture but not yet verified
- Unknown - not yet evaluated

### Proof Surface

- Identity: `skillzmcgee` governed cognitive runtime proof surface
- Purpose: expose the evidence layer for receipts, reducer replay, and studio runtime
- Claim: the repo proves a governed cognitive runtime with reproducible receipts
- Evidence: build/test paths, Nova Studio launch paths, receipts, and docs
- Verification: build, test, cockpit smoke, observer reproduction, and conformance checks
- Replay: receipt history, reducer replay, and observer bundle traces
- Operational Status: Prototype with fresh build/test/smoke evidence in this pass
- Truth Boundary: proves the governed runtime slice, not every production deployment
- Constitutional Profile: authority, evidence, verification, compliance, scope, and limits are documented above
- Blindspots: canonical smoke path, fresh universal replay proof, and onboarding simplicity
- Adversarial Claims: the breadth of docs can be mistaken for universal verification
- Battle Scars: documentation has sometimes raced ahead of a single verified canonical slice
- Color-Team Readiness: Red/Blue/Purple/Green/Yellow/White readiness is partially established
- Commercial Readiness: Builder to Professional transition path
- Next Evidence Required: fresh replay coverage and broader operator-path hardening
- Constitutional Proof Level: P1-Implemented / P2-Verified mix depending on the surface
- Evidence Ladder: P0 Concept, P1 Implemented, P2 Verified, P3 Operational, P4 Independently Verified, P5 Mission-Critical
- Commercial State Tags: Implemented, Verified, Operational, Commercially Available

### Constitutional Profile

- Purpose: governed cognitive runtime with receipts and deterministic state
- Authority: constitutional runtime, ledger, and governance docs
- Evidence Model: receipts, Merkle links, state reducers, conformance outputs
- Verification Process: build, test, smoke, replay, and conformance checks
- Compliance Requirements: lawful execution and traceable state transitions
- Truth Boundary: proves governed runtime behavior, not every downstream production deployment
- Replay/Audit Path: receipt history, reducer replay, and conformance traceability
- Failure / Degradation Path: fail closed on governance violations and preserve continuity evidence
- Current Constitutional Maturity: Prototype
- Constitutional Scope: governed runtime behavior, receipts, reducers, conformance, and studio surfaces
- Constitutional Limits: does not yet govern every downstream deployment or production hardening requirement
- Dependencies: Python runtime, Node runtime for AS-Omega, docs, and the Nova Studio launch path
- Stewardship / Maintainers: SkillzMcGee maintainers and the constitutional runtime collaborators

### Evidence Hierarchy

- Constitutional Governance: constitution, conformance, and invariants
- Software Architecture: ledger, reducer, runtime, and studio surfaces
- Implementation: runtime code, Nova Studio, and workflow engines
- Verification Evidence: tests, conformance outputs, and receipts
- Operational Evidence: startup paths, browser UI, and local runtime behavior
- Adoption Evidence: README, docs, and release notes

### Maturity Progression

Scaffold -> Prototype -> Verified Prototype -> Reference Implementation -> Production Candidate -> Production

### Community and Commercialization

- Who benefits from this? Developers, governance teams, and operators
- Who should contribute? People improving runtime law, receipts, or studio usability
- What customer problem does it solve? It keeps governed runtime work auditable and replayable
- What free capability does it provide? A governed runtime with public-facing docs and a studio path
- What commercial capability could eventually be built on top of it? Productized governed runtime, operator tooling, and implementation support

### Blindspots

- Known architectural blindspots: multiple runtime surfaces still need a single canonical entrypoint
- Known governance blindspots: some claims are docs-backed and need fresh operational proof
- Known replay/audit blindspots: replay verification is not yet universal
- Known operational blindspots: the repository still needs a single fully verified smoke path
- Known adoption blindspots: onboarding remains complex for a new contributor

### Adversarial Claims

- Could claim the repo is fully production ready
- Could exploit the size of the repo to hide unverified slices
- Could misinterpret documentation breadth as verification breadth
- Could falsify readiness by ignoring the canonical smoke path
- Could bypass governance by focusing on one surface only

### Battle Scars

- Past failures: some surfaces have been documented before they were uniformly verified
- Past regressions: large surface area can hide stale assumptions
- Past outages: not recorded here
- Past misconfigurations: too many prototype slices can blur the canonical path
- Past governance violations: overclaiming readiness without fresh evidence
- Past replay failures: replay fidelity is a continuing focus
- Past test failures: broad suites still need disciplined selection
- Past architectural mistakes: the repo can become conceptually fragmented if the scorecard is ignored

### Color-Team Readiness

| Team | Readiness |
|------|-----------|
| Red Team | Partial: many candidate attack surfaces exist because the repo is large |
| Blue Team | Partial: conformance and replay exist, but not every path is fresh |
| Purple Team | Emerging: attack and defense can be coordinated through receipts and conformance |
| Green Team | Partial: build and tests exist, but the canonical slice still needs fresh proof |
| Yellow Team | Partial: user safety and truth boundaries are documented but complex |
| White Team | Strongest layer: constitutional and conformance framing |

### Future Validation

- Open research questions
- Planned verification work
- Planned red-team exercises
- Planned interoperability tests
- Planned performance benchmarks

### Governing Claim Rule

No repository should claim more than its evidence supports.
