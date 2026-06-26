# Meta

| Document | Purpose |
|----------|---------|
| [adr-template.md](./adr-template.md) | ADR template with requirement linkage |
| [adrs/](./adrs/) | Architecture decision records |
| [stewardship-charter.md](./stewardship-charter.md) | Multi-steward governance |
| [steward-council-governance-process.md](./steward-council-governance-process.md) | Council proposal lifecycle |
| [steward-oath.md](./steward-oath.md) | Steward oath |
| [LONG_TERM_STABILITY_PLAN_v1.0.md](./LONG_TERM_STABILITY_PLAN_v1.0.md) | 10-year stability roadmap |
| [RELEASE_NOTES_v1.0.md](./RELEASE_NOTES_v1.0.md) | Formal v1.0 release notes |
| [REPOSITORY_STRUCTURE_v1.0.md](./REPOSITORY_STRUCTURE_v1.0.md) | Canonical repo layout |
| [version-history.md](./version-history.md) | Release lineage |
| [governance.md](./governance.md) | How spec changes are governed |

## Two-plane policy

- **Plane 1** (`/specification/`) — frozen for V1; amendments require V2 process
- **Plane 2** (`/conformance/`) — evolves with engineering; must always resolve to Plane 1 via R-∞
