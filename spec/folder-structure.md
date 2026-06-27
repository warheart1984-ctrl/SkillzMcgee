# COR Suite - Folder Structure

**Version:** 1.0
**Repository:** `skillzmcgee` cockpit/runtime mirror for the COR Suite artifacts.

This document records the repository-native layout for CAR-1.0, CAV-1.0, COR-1.0, PGI-1.0, DRA-1.0, governance, and the Workflow Modeling Suite.

```text
skillzmcgee/
├── cor-suite/
│   └── car/
│       └── car-1.0.json
├── governance/
│   ├── invariants/
│   │   └── GOV-INV-1.0.md
│   └── release-criteria/
│       └── v1.0.md
├── meta/
│   └── cor-suite/
│       ├── cav-validation.json
│       ├── cor-state.json
│       ├── pgi-1.0.json
│       ├── dra-report.json
│       ├── proof-analysis.json
│       ├── maturity-vector.json
│       ├── governance-receipt.json
│       └── repo-hygiene-status.json
├── spec/
│   ├── CAR-1.0-Registry.md
│   ├── CAV-1.0-Validation.md
│   ├── COR-1.0-Contract.md
│   ├── COR-Suite-Spec-1.0.md
│   ├── RFC-COR-Suite-1.0.md
│   ├── car-1.0.schema.json
│   ├── cav-validation.schema.json
│   ├── cor-state-vector.schema.json
│   ├── pgi.schema.json
│   ├── dra-report.schema.json
│   ├── governance-receipt.schema.json
│   └── workflow-modeling-canvas/
├── src/
│   ├── analysis/
│   ├── cli/
│   │   └── cor-suite.ts
│   ├── cor/
│   ├── cor-suite/
│   │   ├── car/
│   │   ├── dra/
│   │   ├── governance/
│   │   ├── pgi/
│   │   └── paths.ts
│   ├── hygiene/
│   ├── maturity/
│   └── nova-studio/
├── tests/
│   └── cor_suite.test.js
├── workflow-canvas/
│   ├── cli-validate.ts
│   ├── examples/
│   │   └── canvas-v1.0.example.json
│   ├── types.ts
│   └── validate.ts
└── workflow-modeling/
    ├── README.md
    ├── conformance/
    ├── launch-kit/
    │   └── LaunchKit.md
    └── nova-studio/
        └── workflows/
            └── modeling-agent.json
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
