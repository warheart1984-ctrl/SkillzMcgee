/**
 * Rule-based reply refinement â€” category and altitude aware (no external AI).
 */
export function refineReply(normalized, draftReply) {
  const lines = [];

  switch (normalized.category) {
    case "normative":
      lines.push("Here's the constitutional change as I see it:");
      break;
    case "architectural":
      lines.push("Here's the structural refinement I'm tracking:");
      break;
    case "methodological":
      lines.push("Here's the methodological impact:");
      break;
    case "implementation":
      lines.push("Here's what landed in the repo:");
      break;
    default:
      lines.push("Quick human-level note:");
      break;
  }

  lines.push("");
  lines.push(draftReply);
  lines.push("");
  lines.push(
    `Ask: ${normalized.requiredAction || normalized.ask || "sanity check"}.`,
  );
  lines.push(
    `Latency: ${normalized.latency || "whenever you have bandwidth"}.`,
  );

  return lines.join("\n");
}
