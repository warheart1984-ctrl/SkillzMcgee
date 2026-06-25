// Simple lawful kernel for NovaSlice

export const Laws = {
  DISALLOWED_TYPES: ["unsafe", "abuse", "fraud"],
  MAX_CONFIDENCE: 0.95
};

export function evaluateIntent(intent) {
  const violations = [];

  if (Laws.DISALLOWED_TYPES.includes(intent.type)) {
    violations.push("DISALLOWED_TYPE");
  }

  if (intent.confidence > Laws.MAX_CONFIDENCE) {
    violations.push("CONFIDENCE_TOO_HIGH");
  }

  return {
    allowed: violations.length === 0,
    violations
  };
}
