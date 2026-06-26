import React from "react";
import { ZoneTile } from "./ZoneTile";

export interface ZoneMapEntry {
  name: string;
  mode?: string;
  tier?: string;
  backlash?: number;
}

export interface ZoneMapProps {
  zones: ZoneMapEntry[];
  selected?: string;
  onSelect?: (name: string) => void;
}

export function ZoneMap({ zones, selected, onSelect }: ZoneMapProps) {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h2 style={{ fontSize: "10px", letterSpacing: "0.14em", opacity: 0.7 }}>ZONE MAP</h2>
      {zones.map((z) => (
        <ZoneTile
          key={z.name}
          {...z}
          selected={selected === z.name}
          onSelect={() => onSelect?.(z.name)}
        />
      ))}
    </aside>
  );
}

export default ZoneMap;
