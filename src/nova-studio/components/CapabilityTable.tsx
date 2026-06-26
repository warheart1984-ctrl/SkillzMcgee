import React, { useEffect, useState } from "react";

interface CapabilityRow {
  id: string;
  description: string;
  lastRun: string;
}

const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_NOVA_STUDIO_API
    ? String(import.meta.env.VITE_NOVA_STUDIO_API)
    : "";

export const CapabilityTable: React.FC = () => {
  const [rows, setRows] = useState<CapabilityRow[]>([
    { id: "read_file", description: "Read workspace file", lastRun: "—" },
    { id: "write_file", description: "Write workspace file", lastRun: "—" },
    { id: "list_dir", description: "List workspace directory", lastRun: "—" },
  ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/state`);
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          ledger?: { capability?: string; timestamp?: string }[];
        };
        const byCap = new Map<string, string>();
        for (const entry of data.ledger ?? []) {
          if (entry.capability) {
            byCap.set(entry.capability, entry.timestamp ?? "—");
          }
        }
        if (cancelled) return;
        setRows((prev) =>
          prev.map((r) => ({
            ...r,
            lastRun: byCap.get(r.id) ?? r.lastRun,
          })),
        );
      } catch {
        /* API offline — keep placeholder rows */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <table className="novaStudio-table">
      <thead>
        <tr>
          <th>Capability</th>
          <th>Description</th>
          <th>Last Run</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.description}</td>
            <td>{r.lastRun}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
