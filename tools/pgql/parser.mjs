/**
 * PGQL-1.0 — Proof Graph Query Language (parser + AST).
 */

/**
 * @typedef {{ kind: 'select', target: string, where?: { field: string, op: string, value: string|number|string[] } }} SelectQuery
 * @typedef {{ kind: 'explain', scope: 'CLAIM'|'NODE', id: string }} ExplainQuery
 * @typedef {{ kind: 'counterfactual', scenario: string }} CounterfactualQuery
 * @typedef {SelectQuery|ExplainQuery|CounterfactualQuery} PGQLQuery
 */

function tokenize(input) {
  const tokens = [];
  const re = /"([^"]*)"|'([^']*)'|([A-Za-z_][\w-]*)|([=!<>]+)|([(),;])/g;
  let m;
  while ((m = re.exec(input.trim()))) {
    if (m[1] !== undefined || m[2] !== undefined) tokens.push({ type: "string", value: m[1] ?? m[2] });
    else if (m[3]) tokens.push({ type: "ident", value: m[3] });
    else if (m[4]) tokens.push({ type: "op", value: m[4] });
    else if (m[5]) tokens.push({ type: "punct", value: m[5] });
  }
  return tokens.map((t) => (t.type === "ident" && /^[A-Z_]+$/.test(t.value) ? { ...t, value: t.value.toUpperCase() } : t));
}

export function parse(query) {
  const tokens = tokenize(query);
  let i = 0;
  const peek = () => tokens[i];
  const eat = (type, value) => {
    const t = tokens[i];
    if (!t || t.type !== type || (value && t.value !== value)) {
      throw new Error(`PGQL parse error near token ${i}: expected ${type}${value ? ` ${value}` : ""}`);
    }
    i++;
    return t;
  };

  if (peek()?.value === "SELECT") {
    eat("ident", "SELECT");
    const target = eat("ident").value.toLowerCase();
    let where;
    if (peek()?.value === "WHERE") {
      eat("ident", "WHERE");
      const field = eat("ident").value;
      const op = peek()?.type === "op" ? eat("op").value : "=";
      const valTok =
        peek()?.type === "string" ? eat("string") : eat("ident");
      where = { field, op, value: valTok.value };
    }
    return { kind: "select", target, where };
  }

  if (peek()?.value === "EXPLAIN") {
    eat("ident", "EXPLAIN");
    if (peek()?.value === "CLAIM" || peek()?.value === "NODE") {
      eat("ident");
    }
    const id =
      peek()?.type === "string" ? eat("string").value : eat("ident").value;
    return { kind: "explain", scope: "CLAIM", id };
  }

  if (peek()?.value === "COUNTERFACTUAL") {
    eat("ident", "COUNTERFACTUAL");
    const scenario = eat("string").value;
    return { kind: "counterfactual", scenario };
  }

  throw new Error("PGQL: unsupported query");
}

export function parseAndEvaluate(query, evaluateFn) {
  const ast = parse(query);
  return evaluateFn(ast);
}
