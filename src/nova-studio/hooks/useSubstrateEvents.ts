import { useEffect, useState } from "react";
import {
  subscribeToStudioState,
  type StudioStatePayload,
} from "../state/substrateStreams";
import type { SliceCapability } from "../lib/slices";
import type { GovernanceEnvelope } from "../governance/receiptTypes";
import type { ContinuityEvent } from "../lib/replayModel";
import type { DriftPoint } from "../lib/driftMath";

export function useSubstrateEvents() {
  const [capabilities, setCapabilities] = useState<SliceCapability[]>([]);
  const [receipts, setReceipts] = useState<GovernanceEnvelope[]>([]);
  const [continuity, setContinuity] = useState<ContinuityEvent[]>([]);
  const [drift, setDrift] = useState<DriftPoint[]>([]);

  useEffect(() => {
    const apply = (state: StudioStatePayload) => {
      setCapabilities(state.capabilities);
      setReceipts(state.receipts);
      setContinuity(state.continuity);
      setDrift(state.drift);
    };

    const sub = subscribeToStudioState(apply);
    return () => sub.close();
  }, []);

  return {
    capabilities,
    receipts,
    continuity,
    timeline: continuity,
    drift,
  };
}
