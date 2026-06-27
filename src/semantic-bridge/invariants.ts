import { rankCategories } from "./classify.js";
import type { InvariantViolation, NormalizedMessage } from "./types.js";

/** B1: No message mixes more than two categories without labeling both. */
/** B2: Every message must have a Core Claim line. */
/** B3: Human-context messages are allowed to have no required action. */
/** B4: Spec-changing messages must always mark Impact = spec. */

export function validateBridgeInvariants(msg: NormalizedMessage): InvariantViolation[] {
  const violations: InvariantViolation[] = [];

  const activeCategories = rankCategories(msg.rawText).filter((r) => r.score > 0);
  if (activeCategories.length >= 2 && !msg.secondaryCategory) {
    violations.push({
      id: "B1",
      message: "Multiple categories detected â€” label secondary category",
    });
  }

  if (!msg.coreClaim?.trim()) {
    violations.push({ id: "B2", message: "Core Claim is required" });
  }

  if (msg.category !== "human" && msg.requiredAction === "none" && !msg.rawText.includes("?")) {
    violations.push({
      id: "B3-adjacent",
      message: "Non-human messages should declare Required Action or include an explicit ask",
    });
  }

  const specChanging =
    /\bspec\b|canon|addendum|whitepaper|invariant|normative doc|binding integration/.test(
      msg.rawText.toLowerCase(),
    ) || msg.category === "normative";
  if (specChanging && msg.impact !== "spec" && msg.category !== "human") {
    violations.push({
      id: "B4",
      message: "Spec-changing messages must mark Impact = spec",
    });
  }

  return violations;
}
