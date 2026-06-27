# COR Suite - Folder Structure

**Version:** 1.0
**Repository:** `skillzmcgee` cockpit/runtime mirror for the COR Suite artifacts.

This document records the repository-native layout for CAR-1.0, CAV-1.0, COR-1.0, PGI-1.0, DRA-1.0, governance, and the Workflow Modeling Suite.

```text
skillzmcgee/
â”œâ”€â”€ cor-suite/
â”‚   â””â”€â”€ car/
â”‚       â””â”€â”€ car-1.0.json
â”œâ”€â”€ governance/
â”‚   â”œâ”€â”€ invariants/
â”‚   â”‚   â””â”€â”€ GOV-INV-1.0.md
â”‚   â””â”€â”€ release-criteria/
â”‚       â””â”€â”€ v1.0.md
â”œâ”€â”€ meta/
â”‚   â””â”€â”€ cor-suite/
â”‚       â”œâ”€â”€ cav-validation.json
â”‚       â”œâ”€â”€ cor-state.json
â”‚       â”œâ”€â”€ pgi-1.0.json
â”‚       â”œâ”€â”€ dra-report.json
â”‚       â”œâ”€â”€ proof-analysis.json
â”‚       â”œâ”€â”€ maturity-vector.json
â”‚       â”œâ”€â”€ governance-receipt.json
â”‚       â””â”€â”€ repo-hygiene-status.json
â”œâ”€â”€ spec/
â”‚   â”œâ”€â”€ CAR-1.0-Registry.md
â”‚   â”œâ”€â”€ CAV-1.0-Validation.md
â”‚   â”œâ”€â”€ COR-1.0-Contract.md
â”‚   â”œâ”€â”€ COR-Suite-Spec-1.0.md
â”‚   â”œâ”€â”€ RFC-COR-Suite-1.0.md
â”‚   â”œâ”€â”€ car-1.0.schema.json
â”‚   â”œâ”€â”€ cav-validation.schema.json
â”‚   â”œâ”€â”€ cor-state-vector.schema.json
â”‚   â”œâ”€â”€ pgi.schema.json
â”‚   â”œâ”€â”€ dra-report.schema.json
â”‚   â”œâ”€â”€ governance-receipt.schema.json
â”‚   â””â”€â”€ workflow-modeling-canvas/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ analysis/
â”‚   â”œâ”€â”€ cli/
â”‚   â”‚   â””â”€â”€ cor-suite.ts
â”‚   â”œâ”€â”€ cor/
â”‚   â”œâ”€â”€ cor-suite/
â”‚   â”‚   â”œâ”€â”€ car/
â”‚   â”‚   â”œâ”€â”€ dra/
â”‚   â”‚   â”œâ”€â”€ governance/
â”‚   â”‚   â”œâ”€â”€ pgi/
â”‚   â”‚   â””â”€â”€ paths.ts
â”‚   â”œâ”€â”€ hygiene/
â”‚   â”œâ”€â”€ maturity/
â”‚   â””â”€â”€ nova-studio/
â”œâ”€â”€ tests/
â”‚   â””â”€â”€ cor_suite.test.js
â”œâ”€â”€ workflow-canvas/
â”‚   â”œâ”€â”€ cli-validate.ts
â”‚   â”œâ”€â”€ examples/
â”‚   â”‚   â””â”€â”€ canvas-v1.0.example.json
â”‚   â”œâ”€â”€ types.ts
â”‚   â””â”€â”€ validate.ts
â””â”€â”€ workflow-modeling/
    â”œâ”€â”€ README.md
    â”œâ”€â”€ conformance/
    â”œâ”€â”€ launch-kit/
    â”‚   â””â”€â”€ LaunchKit.md
    â””â”€â”€ nova-studio/
        â””â”€â”€ workflows/
            â””â”€â”€ modeling-agent.json
```

## Pipeline Order

```text
Repo Hygiene -> CAV -> COR -> PGI -> DRA -> Proof Analysis -> Maturity -> Governance
```

## Layer to Path Mapping

| Layer | Module | Primary artifact |
|-------|--------|------------------|
| CAR-1.0 | `src/cor-suite/car/` | `cor-suite/car/car-1.0.json` |
| CAV-1.0 | `src/cor-suite/car/validate.ts` | `meta/cor-suite/cav-validation.json` |
| COR-1.0 | `src/cor/` | `meta/cor-suite/cor-state.json` |
| PGI-1.0 | `src/cor-suite/pgi/` | `meta/cor-suite/pgi-1.0.json` |
| DRA-1.0 | `src/cor-suite/dra/` | `meta/cor-suite/dra-report.json` |
| Proof Analysis | `src/analysis/` | `meta/cor-suite/proof-analysis.json` |
| Maturity | `src/maturity/` | `meta/cor-suite/maturity-vector.json` |
| Governance | `src/cor-suite/governance/` | `meta/cor-suite/governance-receipt.json` |

## Workflow Modeling Suite

The Workflow Modeling Suite lives beside the COR Suite because it consumes the same evidence-first governance model.

| Area | Path |
|------|------|
| Public suite entrypoint | `workflow-modeling/README.md` |
| Consultant launch kit | `workflow-modeling/launch-kit/LaunchKit.md` |
| Runtime canvas types and validator | `workflow-canvas/` |
| Normative canvas specs and schemas | `spec/workflow-modeling-canvas/` |
| Nova Studio modeling agent | `workflow-modeling/nova-studio/workflows/modeling-agent.json` |

This layout keeps canonical state explicit, validation separate, measurement descriptive, analysis explanatory, governance decisional, and communication derivative.
