export function classifyMessage(text) {
  const t = String(text ?? "").toLowerCase();
  if (t.includes("invariant") || t.includes("axiom") || t.includes("law")) return "normative";
  if (t.includes("interface") || t.includes("diagram") || t.includes("stack") || t.includes("architecture")) return "architectural";
  if (t.includes("evidence") || t.includes("test") || t.includes("audit") || t.includes("conformance")) return "methodological";
  if (t.includes("repo") || t.includes("commit") || t.includes("ui") || t.includes("implementation")) return "implementation";
  return "human";
}

export function inferAltitude(category) {
  if (category === "normative") return "constitutional";
  if (category === "architectural") return "architectural";
  if (category === "methodological" || category === "implementation") return "engineering";
  return "human";
}
