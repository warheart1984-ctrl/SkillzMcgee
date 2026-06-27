export function parseCanon(canonMarkdown) {
  const sections = {};
  const regex = /## Â§(\d+) â€” ([^\n]+)[\s\S]*?```json([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(canonMarkdown)) !== null) {
    const title = match[2].trim();
    sections[title] = JSON.parse(match[3]);
  }
  return sections;
}
