import { subscribe } from "../runtime/state-store.mjs";
import { routeEvent } from "./router.mjs";

const clients = new Set();

export function addClient(ws) {
  clients.add(ws);
  return () => clients.delete(ws);
}

export function broadcast(event) {
  const routed = routeEvent(event);
  if (!routed) return { clientCount: clients.size, sent: false };
  const payload = JSON.stringify(routed);
  for (const client of clients) {
    if (client.readyState === undefined || client.readyState === 1) {
      client.send?.(payload);
    }
  }
  return { clientCount: clients.size, sent: true };
}

export function attachStateBroadcasts() {
  return subscribe((event) => broadcast(event));
}
