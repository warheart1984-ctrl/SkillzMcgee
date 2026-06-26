import { getState } from "../../runtime/state-store.mjs";

export function getNovaStateData() {
  return getState();
}

export async function getNovaState(_req, res) {
  res.json(getNovaStateData());
}
