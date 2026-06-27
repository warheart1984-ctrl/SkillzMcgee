import { DARZ_CATEGORY_LABEL } from "./classify.js";
import { normalizeMessage } from "./normalizeMessage.js";
import type {
  DarzToJonTranslation,
  JonToDarzTranslation,
  NormalizedMessage,
} from "./types.js";

const CATEGORY_LABEL: Record<string, string> = {
  normative: "Constitutional / Normative",
  architectural: "Architectural",
  methodological: "Methodological",
  implementation: "Implementation",
  human: "Human",
};

function bandwidthLine(latency: NormalizedMessage["latency"]): string {
  if (latency === "now") return "Need eyes today.";
  if (latency === "soon") return "No rush — soon is fine.";
  return "No rush — whenever you have bandwidth.";
}

function askLine(ask: NormalizedMessage["ask"]): string {
  switch (ask) {
    case "approve":
      return "Do you approve?";
    case "refine":
      return "Would you refine this?";
    case "ignore":
      return "FYI only — no action required.";
    case "respond":
      return "What's your read?";
    case "review":
    default:
      return "Sanity check welcome.";
  }
}

function bulletItems(msg: NormalizedMessage): string[] {
  const items: string[] = [];
  if (msg.context) items.push(msg.context);
  if (msg.targets.length) items.push(`Targets: ${msg.targets.join(", ")}`);
  items.push(`Impact: ${msg.impact}`);
  if (msg.secondaryCategory) {
    items.push(`Also tagged: ${CATEGORY_LABEL[msg.secondaryCategory]}`);
  }
  return items.slice(0, 5);
}

function acknowledgment(msg: NormalizedMessage): string {
  switch (msg.category) {
    case "normative":
      return "Understood — treating this as normative specification input.";
    case "architectural":
      return "Got it — locking the structural read at architectural altitude.";
    case "methodological":
      return "Clear on verification and evidence posture.";
    case "implementation":
      return "Acknowledged — implementation track.";
    case "human":
      return "Heard you.";
    default:
      return "Acknowledged.";
  }
}

function nextSteps(msg: NormalizedMessage): string[] {
  const steps: string[] = [];
  if (msg.category === "human" && msg.requiredAction === "none") {
    return ["No repo or spec work unless you redirect"];
  }
  steps.push(msg.requiredActionDetail);
  if (msg.repositoryTargets.length) {
    steps.push(`Surfaces: ${msg.repositoryTargets.join(", ")}`);
  }
  if (msg.targets.length) {
    steps.push(`Paths: ${msg.targets.slice(0, 3).join(", ")}`);
  }
  if (msg.normativeImpact === "spec") {
    steps.push("Fold into governance / binding docs if canon-worthy");
  }
  return steps.slice(0, 4);
}

function timingLine(latency: NormalizedMessage["latency"]): string {
  if (latency === "now") return "I'll prioritize this today.";
  if (latency === "soon") return "I'll pick this up soon — not blocking you.";
  return "Queued for whenever — no pressure on your side.";
}

function formatDarzCanonical(msg: NormalizedMessage): string {
  return [
    `1. Category: ${DARZ_CATEGORY_LABEL[msg.category]}`,
    "",
    `2. Core Claim:`,
    `   ${msg.coreClaim}`,
    "",
    `3. Normative Impact:`,
    `   ${msg.normativeImpact}`,
    "",
    `4. Required Action:`,
    `   ${msg.requiredActionDetail}`,
    "",
    `5. Repository Targets:`,
    msg.repositoryTargets.length
      ? msg.repositoryTargets.map((t) => `   - ${t}`).join("\n")
      : "   (none inferred)",
    "",
    `6. Response Altitude:`,
    `   ${msg.altitude}`,
  ].join("\n");
}

function generateJonReply(msg: NormalizedMessage): string {
  if (msg.category === "human") {
    const lines = [
      acknowledgment(msg),
      "",
      msg.coreClaim,
      "",
      msg.requiredAction === "none"
        ? "No action on my side unless you want it."
        : timingLine(msg.latency),
    ];
    if (msg.context) lines.splice(2, 0, msg.context);
    return lines.filter(Boolean).join("\n");
  }

  const steps = nextSteps(msg);
  return [
    acknowledgment(msg),
    "",
    "**Read**",
    msg.coreClaim,
    msg.context ? `\n${msg.context}` : null,
    "",
    "**Impact**",
    `${msg.normativeImpact}${msg.repositoryTargets.length ? ` → ${msg.repositoryTargets.join(", ")}` : ""}`,
    "",
    "**My move**",
    ...steps.map((s) => `- ${s}`),
    "",
    "**Timing**",
    timingLine(msg.latency),
    "",
    msg.requiredAction === "review" || /\?/.test(msg.rawText)
      ? "Want me to draft the spec delta or jump straight to implementation?"
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function translateJonToDarz(msg: NormalizedMessage): JonToDarzTranslation {
  const opening =
    msg.ask === "approve" || msg.category === "normative"
      ? "Here's what I'm proposing:"
      : "Here's what changed:";

  const bullets = bulletItems(msg);
  const body = [
    `[Category: ${CATEGORY_LABEL[msg.category]}]`,
    "",
    `Core: ${msg.coreClaim}`,
    "",
    msg.context ? `Context: ${msg.context}` : null,
    `Impact: ${msg.impact} (spec / repo / ops / neither).`,
    `Ask: ${askLine(msg.ask)}`,
    `Latency: ${bandwidthLine(msg.latency)}`,
    "",
    opening,
    ...bullets.map((b) => `- ${b}`),
    "",
    askLine(msg.ask),
    bandwidthLine(msg.latency),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    category: msg.category,
    coreStatement: msg.coreClaim,
    context: msg.context,
    impact: msg.impact,
    ask: msg.ask,
    latency: msg.latency,
    body,
  };
}

export function translateDarzToJon(msg: NormalizedMessage): DarzToJonTranslation {
  const canonical = formatDarzCanonical(msg);
  const jonReply = generateJonReply(msg);
  return {
    category: msg.category,
    categoryLabel: DARZ_CATEGORY_LABEL[msg.category],
    coreClaim: msg.coreClaim,
    normativeImpact: msg.normativeImpact,
    requiredActionDetail: msg.requiredActionDetail,
    repositoryTargets: msg.repositoryTargets,
    responseAltitude: msg.altitude,
    canonical,
    jonReply,
  };
}

export function suggestReply(msg: NormalizedMessage): string {
  if (msg.direction === "darz->jon") {
    return translateDarzToJon(msg).jonReply;
  }
  return translateJonToDarz(msg).body;
}

/** Dar-Z → Jon protocol entry: normalize + full translation bundle */
export function processDarzInbound(rawText: string, overrides: Partial<NormalizedMessage> = {}) {
  const message = normalizeMessage(rawText, "darz->jon", overrides);
  const translation = translateDarzToJon(message);
  return { message, translation };
}
