/**
 * Canon parser — extract JSON sections from COMM-CANON markdown.
 */

/**
 * @param {string} canonMarkdown
 * @returns {Record<string, unknown>}
 */
export function parseCanon(canonMarkdown) {
  const sections = {};
  const regex = /## §(\d+) — ([^\n]+)[\s\S]*?```json([\s\S]*?)```/g;

  let match = regex.exec(canonMarkdown);
  while (match !== null) {
    const title = match[2].trim();
    const jsonBlock = match[3].trim();

    try {
      sections[title] = JSON.parse(jsonBlock);
    } catch {
      sections[title] = { _parse_error: true, raw: jsonBlock };
    }

    match = regex.exec(canonMarkdown);
  }

  return sections;
}

/**
 * @param {Record<string, unknown>} parsed
 * @returns {string[]}
 */
export function listCanonSectionTitles(parsed) {
  return Object.keys(parsed);
}
