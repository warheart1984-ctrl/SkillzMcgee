/**
 * Discord message stream over WebSocket â€” /ws/discord
 * Payload: { author, content, timestamp, channel }
 */
import crypto from "node:crypto";
import { encodeWebSocketFrame, sendJson } from "./events.mjs";

const clients = new Set();

function acceptWebSocket(req, socket, head) {
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return false;
  }

  const accept = crypto
    .createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");

  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "\r\n",
  ].join("\r\n"));

  if (head?.length) {
    socket.unshift(head);
  }
  return true;
}

export function handleDiscordWebSocketUpgrade(req, socket, head) {
  if (!acceptWebSocket(req, socket, head)) return;

  clients.add(socket);
  sendJson(socket, {
    type: "discord.connected",
    timestamp: new Date().toISOString(),
    payload: { message: "Discord bridge connected" },
  });

  socket.on("close", () => clients.delete(socket));
  socket.on("error", () => clients.delete(socket));
}

export function broadcastDiscordMessage(message) {
  const payload = {
    author: message.author ?? "unknown",
    content: String(message.content ?? ""),
    timestamp: message.timestamp ?? new Date().toISOString(),
    channel: message.channel ?? "general",
  };

  for (const client of clients) {
    sendJson(client, { type: "discord.message", ...payload });
  }

  return { delivered: clients.size, message: payload };
}

export function getDiscordBridgeClientCount() {
  return clients.size;
}
