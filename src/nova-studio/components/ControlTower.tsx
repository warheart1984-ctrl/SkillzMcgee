import React from "react";
import type { FoldSummary, StanceStripState } from "../state/substrateStreams";

interface ControlTowerProps {
  stance: StanceStripState;
  folds: FoldSummary[];
}

export const ControlTower: React.FC<ControlTowerProps> = ({ stance, folds }) => {
  const latestFold = folds.at(-1);

  return (
    <div className="novaStudio-control">
      <h3>Control Tower</h3>
      <dl className="novaStudio-controlState">
        <div>
          <dt>stance</dt>
          <dd>{stance.stance}</dd>
        </div>
        <div>
          <dt>focus</dt>
          <dd>{stance.focus_capability_id ?? "none"}</dd>
        </div>
        <div>
          <dt>fold</dt>
          <dd>{latestFold?.fold_id ?? "pending"}</dd>
        </div>
      </dl>
      <button type="button">Rerun Capability</button>
      <button type="button">Inspect Lineage</button>
      <button type="button">Open Replay</button>
    </div>
  );
};
