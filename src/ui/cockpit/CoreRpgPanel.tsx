import React from "react";
import type { CoreRpgPanelProps } from "./types";
import { TensionBars } from "./TensionBars";
import { ModeBadge } from "./ModeBadge";
import { BacklashMeter } from "./BacklashMeter";
import { CycleList } from "./CycleList";
import { NarrativeHook } from "./NarrativeHook";
import { Controls } from "./Controls";
import {
  gridStyle,
  headerStyle,
  panelStyle,
  subStyle,
  titleStyle,
} from "./styles";

/**
 * Core + RPG face cockpit — composes interpretive sub-panels over core-live state.
 */
export function CoreRpgPanel({
  cosmos,
  rpg,
  rpgFace,
  archetype,
  coreVersion = "1.0.0",
  tickKey = 0,
  faces,
  activeFace,
  onSpin,
  onReset,
  onProjectFace,
}: CoreRpgPanelProps) {
  const projection = rpg ?? rpgFace;
  if (!projection) {
    throw new Error("CoreRpgPanel requires `rpg` or `rpgFace` projection");
  }

  return (
    <section
      className="core-rpg-panel"
      data-core-version={coreVersion}
      style={panelStyle}
    >
      <header style={headerStyle}>
        <h1 style={titleStyle}>NEGOTIANT CORE ⟴ — RPG FACE</h1>
        <span style={subStyle}>core-live · validated interpretive view</span>
      </header>

      <div style={gridStyle}>
        <TensionBars
          tensions={cosmos}
          dominantMode={projection.mode}
          tickKey={tickKey}
        />

        <div>
          <ModeBadge mode={projection.mode} archetype={archetype} tickKey={tickKey} />
          <BacklashMeter value={projection.backlash} />
          <Controls
            onSpin={onSpin}
            onReset={onReset}
            faces={faces}
            activeFace={activeFace}
            onProjectFace={onProjectFace}
          />
        </div>

        <div>
          <CycleList cycle={projection.cycle} />
          <NarrativeHook text={projection.narrativeHook} />
        </div>
      </div>
    </section>
  );
}

export default CoreRpgPanel;
