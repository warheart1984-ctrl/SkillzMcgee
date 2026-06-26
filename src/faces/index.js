/**
 * Interpretive faces registry — read-only projections over the Negotiant Core.
 */

import { view as rpgView } from "./rpg/view.js";
import { view as languageView } from "./language/view.js";
import { view as governanceView } from "./governance/view.js";
import { view as scriptureView } from "./scripture/view.js";
import { view as cosmologyView } from "./cosmology/view.js";

/** @typedef {"rpg" | "language" | "governance" | "scripture" | "cosmology"} FaceName */

/** @type {readonly FaceName[]} */
export const FACE_NAMES = ["rpg", "language", "governance", "scripture", "cosmology"];

/** @type {Record<FaceName, (cosmos: import("../tension/types.js").Tension) => object>} */
export const FACE_VIEWS = {
  rpg: rpgView,
  language: languageView,
  governance: governanceView,
  scripture: scriptureView,
  cosmology: cosmologyView,
};

/**
 * @param {FaceName} name
 * @param {import("../tension/types.js").Tension} cosmos
 * @returns {object}
 */
export function projectFace(name, cosmos) {
  const fn = FACE_VIEWS[name];
  if (!fn) throw new Error(`Unknown face: ${name}`);
  return fn(cosmos);
}

export { rpgView, languageView, governanceView, scriptureView, cosmologyView };
