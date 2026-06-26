import React from "react";
import { useCapabilities } from "./useCapabilities";

export const CapabilitiesList: React.FC = () => {
  const { capabilities, selected, setSelected, loading } = useCapabilities();

  if (loading) return <div className="ns-panel">Loading capabilities…</div>;
  if (!capabilities.length) return <div className="ns-panel">No capabilities found</div>;

  return (
    <div className="ns-panel ns-capabilities-list">
      <h3>Capabilities</h3>
      <ul className="ns-cap-list">
        {capabilities.map((cap) => (
          <li
            key={cap.id}
            className={
              selected?.id === cap.id ? "ns-capability ns-capability-active" : "ns-capability"
            }
            onClick={() => setSelected(cap)}
            onKeyDown={(e) => e.key === "Enter" && setSelected(cap)}
            role="button"
            tabIndex={0}
          >
            <strong>{cap.name}</strong>
            <div className="ns-meta">{cap.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
