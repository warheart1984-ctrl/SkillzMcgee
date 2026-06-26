/**
 * Full registry — all 30 substrations across 5 clusters
 */

import { continuitySubstrations } from "./cluster_continuity.js";
import { fieldAttractorSubstrations } from "./cluster_field_attractor.js";
import { governanceSubstrations } from "./cluster_governance.js";
import { cosmologicalSubstrations } from "./cluster_cosmological.js";
import { temporalMetaSubstrations } from "./cluster_temporal_meta.js";

export const substrations = [
  ...continuitySubstrations,
  ...fieldAttractorSubstrations,
  ...governanceSubstrations,
  ...cosmologicalSubstrations,
  ...temporalMetaSubstrations,
];

export {
  continuitySubstrations,
  fieldAttractorSubstrations,
  governanceSubstrations,
  cosmologicalSubstrations,
  temporalMetaSubstrations,
};
