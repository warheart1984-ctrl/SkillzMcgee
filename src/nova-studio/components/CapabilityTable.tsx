import React from "react";
import { useSubstrateEvents } from "../hooks/useSubstrateEvents";

export const CapabilityTable: React.FC = () => {
  const { capabilities } = useSubstrateEvents();

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">SkillzMcGee Capabilities</div>
      <table className="ns-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kind</th>
            <th>Path</th>
            <th>Input Schema</th>
            <th>Output Schema</th>
            <th>Last Run</th>
          </tr>
        </thead>
        <tbody>
          {capabilities.length === 0 && (
            <tr>
              <td colSpan={6}>No capabilities loaded</td>
            </tr>
          )}
          {capabilities.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.kind}</td>
              <td>{c.path ?? "—"}</td>
              <td className="ns-schema-cell">{JSON.stringify(c.inputSchema)}</td>
              <td className="ns-schema-cell">{JSON.stringify(c.outputSchema)}</td>
              <td>{c.lastRun ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
