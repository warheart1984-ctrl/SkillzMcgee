# Absolute Singularity (AS-1)

**The single fold point** where SkillzMcGee's governed runtime collapses all continuity into one observable state.

## What it is (in code)

| Mythos layer | AS-1 implementation |
|--------------|---------------------|
| Absolute Singularity | `foldAbsoluteSingularity(ledger)` — one object from the full ledger |
| Wave Math | `waveStep(w_t, e_t)` — judgment vector over 6 JPA-1 dimensions |
| DAR-Z tensors | `buildDarzTensors(receipts)` — failure, environment, salience registers |
| K4 reconstructability | `verifyReconstructable` — slice state must equal `reduce(ledger)` |
| Continuity fingerprint | `ledgerFingerprint` — stable hash anchor for the ledger |

## Fold output shape

```js
{
  version: "AS-1",
  fingerprint: "AS-deadbeef",
  receiptCount: N,
  sliceState: { nova: { lastOutput, ... } },
  wave: { w_t: { perception, interpretation, ... }, dimensions: [...] },
  darz: { failureHistory, decisionEnvironment, perceptionSalience },
  k4: { reconstructable: true, coherence: 0.95 }
}
```

## When it runs

- On **boot** (`bootGovernedRuntime`)
- After every **receipt append** (Nova slice or LLM adapter)
- On demand via **Fold Singularity** in the dashboard

## CTS

`CTS-AS-001` asserts K4 reconstructability on the current ledger.

## Files

```
src/singularity/
  absoluteSingularity.js   # fold + K4 verify
  waveMath.js              # F(w_t, e_t), R(τ)
  darzTensors.js           # three continuity gap registers
  fingerprint.js           # ledger anchor hash
```

This is **v0** — deterministic, browser-native, no external math libs. Wave dynamics and tensors are simplified linear folds, not the full cosmology spec.
