import { addClient } from "./broadcaster.mjs";
import { subscribe } from "../runtime/state-store.mjs";

export function startEventServer(server, WebSocketServer) {
  const wss = new WebSocketServer({ server, path: "/events" });

  wss.on("connection", (ws) => {
    const removeClient = addClient(ws);
    const unsubscribe = subscribe((event) => {
      ws.send(JSON.stringify(event));
    });

    ws.on("close", () => {
      unsubscribe();
      removeClient();
    });
  });

  return wss;
}
