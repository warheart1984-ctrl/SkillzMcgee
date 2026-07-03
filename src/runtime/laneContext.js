/**
 * Lane context — sovereign communication identity per operator session.
 */
const STORAGE_KEY = "nova.communication.lane_id";
export const DEFAULT_LANE_ID = "jon-darz-architecture";

export function getActiveLaneId() {
  if (typeof sessionStorage === "undefined") return DEFAULT_LANE_ID;
  return sessionStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANE_ID;
}

export function setActiveLaneId(laneId) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, laneId);
}

export async function fetchLaneContext(laneId = getActiveLaneId()) {
  const res = await fetch(`/api/communication/lanes/${encodeURIComponent(laneId)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.lane ?? null;
}

export async function fetchLanes() {
  const res = await fetch("/api/communication/lanes");
  if (!res.ok) return [];
  const data = await res.json();
  return data.lanes ?? [];
}
