import { useState } from "react";

export function usePgql() {
  const [query, setQuery] = useState('SELECT claims WHERE status = "missing"');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(customQuery?: string) {
    const q = customQuery ?? query;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pgql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "PGQL failed");
      setResult(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return { query, setQuery, result, loading, error, execute };
}
