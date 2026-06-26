import type { TensionCosmos } from "../ui/cockpit/types";

export interface ZoneTickFaces {
  rpg?: { mode?: string; backlash?: number; cycle?: TensionCosmos };
  governance?: { posture?: string };
  scripture?: { verse?: string; ordering?: string[] };
  cosmology?: { tier?: string };
}

export interface ZoneTick {
  id?: string;
  zoneId?: string;
  timestamp?: string;
  cosmos: TensionCosmos;
  faces?: ZoneTickFaces;
  sourceEvents?: string[];
}

export interface CockpitIndicators {
  mode: string;
  backlash: number;
  tier: string | undefined;
  posture: string | undefined;
  verse: string | undefined;
  risk: number;
}
