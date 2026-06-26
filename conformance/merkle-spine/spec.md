# Merkle Spine Specification

**Resolves to:** CRK1-R034, R030

## Structure

- **Layer 0:** Constitutional objects
- **Layer 1:** Governance receipts
- **Layer 2:** Provenance entries
- **Layer 3:** Drift envelope checkpoints
- **Layer 4:** Version-level anchors

## Node

```
Node = hash(object_id, object_type, object_payload, timestamp)
```

## Root

```
Root = H(L4)
```

## Guarantees

- No rewriting history
- No unanchored objects
- No orphan receipts
- Founder-independent verification

## Implementation

`governance/merkle.py`, receipt `parentId` chain in `nova-studio/server/runtime/studioRuntime.mjs`
