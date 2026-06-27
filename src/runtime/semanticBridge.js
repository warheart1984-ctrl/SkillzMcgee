/**
 * Semantic Bridge runtime â€” classification, normalization, reply generation.
 * Facade over src/semantic-bridge (v1.0 protocol).
 */
import {
  CATEGORIES,
  REPOSITORY_TARGETS,
  classifyMessage,
  normalizeMessage,
  processDarzInbound,
  suggestReply,
  translateDarzToJon,
  translateJonToDarz,
} from "../semantic-bridge/index.ts";

export {
  CATEGORIES,
  REPOSITORY_TARGETS,
  classifyMessage,
  normalizeMessage,
  suggestReply,
  translateDarzToJon,
  translateJonToDarz,
  processDarzInbound,
};

/** Build a suggested reply from a normalized message. */
export function generateReply(normalized) {
  if (!normalized) return "";

  if (normalized.direction === "darz->jon") {
    return suggestReply(normalized);
  }

  return [
    `[${normalized.category.toUpperCase()}]`,
    "",
    `Core: ${normalized.coreClaim}`,
    "",
    `Context: ${normalized.context || "â€”"}`,
    "",
    `Impact: ${normalized.impact}`,
    "",
    `Ask: ${normalized.requiredAction}`,
    "",
    `Latency: ${normalized.latency}`,
  ].join("\n");
}
