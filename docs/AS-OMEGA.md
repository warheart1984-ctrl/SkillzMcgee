# Absolute Singularity — AS-2 → AS-Ω

Full cosmophysics stack for SkillzMcGee's governed runtime.

## Layer map

| Version | Module | What it adds |
|---------|--------|--------------|
| **AS-2** | `lineage.js` | `parentId`, `lineageId`, `depth`, branches, worldlines |
| **AS-3** | `receiptHash.js`, `merkle.js`, `sha256.js` | `receiptHash`, `parentHash`, Merkle roots |
| **AS-4** | `nonlinearWave.js` | `w_{t+1} = f(w_t, e_t, ∂w/∂t, ∂²w/∂t²)` integration |
| **AS-5** | `darzFields.js` | `F_failure`, `F_environment`, `F_salience` fields |
| **AS-Ω** | `absoluteSingularity.js`, `genesis.js` | Full fold + `H_Ω` genesis operator |

## AS-Ω fold output

```js
{
  version: "AS-Ω",
  fingerprint,
  merkle: { localRoot, lineageRoots, globalRoot },
  lineage: { roots, branches, worldlines },
  lineages: { [lineageId]: { wave, darz } },
  wave: { linear, nonlinear, attractors, phaseTransition },
  darz: { tensors, fields },
  k4: { reconstructable, hashChainValid, coherence },
  genesisOperator: { id: "H-Ω", fingerprint, generates: "world-operator" }
}
```

## Receipt enrichment

Every append runs `prepareReceiptForAppend`:

1. Chains `parentId` to prior receipt (unless explicit fork)
2. Resolves `lineageId` + `depth`
3. Computes SHA-256 `receiptHash` + `parentHash`

## CTS rules

- `CTS-AS-001` — K4 reconstructability
- `CTS-AS-003` — hash chain validity
- `CTS-AS-Ω` — merkle root + genesis operator present

## Try it

```bash
npm run dev
```

Run slices → **Fold Singularity** → inspect worldlines, Merkle root, nonlinear wave, H-Ω fingerprint.
