import { parseCanon } from "./canonParser.mjs";

export function diffCanons(oldCanon, newCanon) {
  const oldParsed = parseCanon(oldCanon);
  const newParsed = parseCanon(newCanon);
  const diffs = {};
  for (const section of Object.keys(newParsed)) {
    const before = oldParsed[section];
    const after = newParsed[section];
    if (JSON.stringify(before) !== JSON.stringify(after)) {
      diffs[section] = { before, after };
    }
  }
  return diffs;
}
