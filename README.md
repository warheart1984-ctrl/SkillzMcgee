# SkillzMcGee

# SkillzMcGee — Governed Runtime v0

**Append-only receipt ledger with verifiable continuity** for browser-based decision making.

## Why This Matters

Most AI systems are black boxes. SkillzMcGee makes every decision **observable, governed, and reproducible**:

- Every slice execution appends a **governed receipt** (laws checked, output logged)
- Receipts form an **immutable ledger** with cryptographic integrity
- State is **strictly derived** from ledger only (K4 reconstructability proof)
- Continuity is tracked via **lineage chains** (parentId ancestry)
- Terminal state is folded into **Absolute Singularity** — a cosmophysics-inspired object that captures:
  - Merkle proofs (local, lineage, global)
  - Nonlinear wave dynamics over 6 judgment dimensions
  - DAR-Z field tensors (failure, environment, salience registers)
  - Genesis operator H-Ω (generates operators from fold state)

## In 30 Seconds

1. **Enter prompt** → Intent evaluated by law kernel
2. **Allowed?** → LLM adapter runs with slice state conditioning
3. **Output logged** → Receipt appended to ledger + persisted
4. **Fold singularity** → Terminal state reconstructed + verified
5. **Inspect** → Dashboard shows receipts, wave state, continuity proof

## Architecture

| Layer | Module | Proof |
|-------|--------|-------|
| **Governance** | law kernel, receipt validator | CTS-NOVA-001 (receipts exist) |
| **Continuity** | append-only ledger, state accumulator | K4 reconstructability |
| **Hashing** | SHA-256 payload hash, parent-hash chain | verifyHashChain() |
| **Lineage** | parentId ancestry, depth, lineageId | enrichReceiptChain() |
| **Wave Math** | 6D judgment vector, nonlinear integration | stateVectorFromReceipt() |
| **Singularity** | Merkle roots, attractors, phase transitions | foldAbsoluteSingularity() |
| **Proof** | genesis operator, coherence score | verifyReconstructable() |

## Try It

```bash
npm install
npm run dev
# Open http://localhost:5173
