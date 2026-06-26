import React from "react";
import type { ZoneTick } from "../../../cockpit/types";
import { computeIndicators } from "../../../cockpit/indicators.js";
import { TENSION_LABELS } from "../../cockpit/types";
import { ModeBadge } from "../../cockpit/ModeBadge";
import { BacklashMeter } from "../../cockpit/BacklashMeter";
import { CosmologyBadge } from "./CosmologyBadge";
import { GovernancePanel } from "./GovernancePanel";
import { ScripturePanel } from "./ScripturePanel";
import { RiskIndicator } from "./RiskIndicator";
import { columnStyle, h2Style } from "../../cockpit/styles";

/** Capitalize tension key for RPG face display */
function modeLabel(modeKey: string) {
  return modeKey.charAt(0).toUpperCase() + modeKey.slice(1);
}

export interface ZoneInspectorProps {
  zoneTick: ZoneTick;
}

/**
 * Zone inspector — indicators computed purely from recorded artifacts.
 */
export function ZoneInspector({ zoneTick }: ZoneInspectorProps) {
  const indicators = computeIndicators(zoneTick);
  const displayMode =
    zoneTick.faces?.rpg?.mode ?? modeLabel(indicators.mode);

  return (
    <article style={columnStyle} className="zone-inspector">
      <h2 style={h2Style}>Zone Inspector</h2>
      <p style={{ fontSize: "10px", opacity: 0.6 }}>zone: {zoneTick.zoneId}</p>

      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", margin: "0.5rem 0" }}>
        {TENSION_LABELS.map(({ key, label }) => (
          <span key={key} style={{ fontSize: "10px" }}>
            {label}: {zoneTick.cosmos[key]}
          </span>
        ))}
      </div>

      <ModeBadge mode={displayMode} />
      <BacklashMeter value={indicators.backlash} />
      <CosmologyBadge tier={indicators.tier} />
      <GovernancePanel posture={indicators.posture} />
      <ScripturePanel verse={indicators.verse} />
      <RiskIndicator value={indicators.risk} />
    </article>
  );
}

export default ZoneInspector;
