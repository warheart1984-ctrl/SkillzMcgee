/**
 * Canon diff engine — structural diff of parsed COMM-CANON sections.
 */
import { parseCanon } from "./canonParser.mjs";

/**
 * @param {string|Record<string, unknown>} oldCanon — markdown or pre-parsed
 * @param {string|Record<string, unknown>} newCanon — markdown or pre-parsed
 */
export function diffCanons(oldCanon, newCanon) {
  const oldParsed = typeof oldCanon === "string" ? parseCanon(oldCanon) : oldCanon;
  const newParsed = typeof newCanon === "string" ? parseCanon(newCanon) : newCanon;

  const diffs = {};
  const allSections = new Set([...Object.keys(oldParsed), ...Object.keys(newParsed)]);

  for (const section of allSections) {
    const oldSec = oldParsed[section];
    const newSec = newParsed[section];

    if (JSON.stringify(oldSec) !== JSON.stringify(newSec)) {
      diffs[section] = {
        before: oldSec ?? null,
        after: newSec ?? null,
      };
    }
  }

  return {
    changed_sections: Object.keys(diffs),
    change_count: Object.keys(diffs).length,
    diffs,
  };
}

/**
 * Summarize diff for cockpit display.
 * @param {ReturnType<typeof diffCanons>} diffResult
 */
export function summarizeCanonDiff(diffResult) {
  return diffResult.changed_sections.map((title) => ({
    section: title,
    summary: `Section "${title}" changed`,
  }));
}
