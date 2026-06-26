let seed = 42;

export function resetDeterminism(nextSeed = 42) {
  seed = nextSeed >>> 0;
}

export function deterministicNow() {
  return new Date(seed * 1000).toISOString();
}

export function deterministicRandom() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
}
