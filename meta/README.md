# Meta

| Document | Purpose |
|----------|---------|
| [adr-template.md](./adr-template.md) | ADR template with requirement linkage |
| [adrs/](./adrs/) | Architecture decision records |
| [RELEASE_NOTES_v1.0.md](./RELEASE_NOTES_v1.0.md) | Formal v1.0 release notes |
| [version-history.md](./version-history.md) | Release lineage |
| [governance.md](./governance.md) | How spec changes are governed |

## Two-plane policy

- **Plane 1** (`/specification/`) — frozen for V1; amendments require V2 process
- **Plane 2** (`/conformance/`) — evolves with engineering; must always resolve to Plane 1 via R-∞
