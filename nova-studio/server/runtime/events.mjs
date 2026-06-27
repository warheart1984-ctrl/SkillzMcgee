import crypto from "node:crypto";

import {
  getNovaRuntimeState,
  getStudioState,
  logEvent,
  subscribeStudioEvents,
} from "./studioRuntime.mjs";
import { NOVA_RUNTIME_ID, NOVA_SESSION_ID } from "../../../runtime/state-store.mjs";

const clients = new Set();

export function handleStudioEventsUpgrade(req, socket, head) {
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
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

  clients.add(socket);
  const unsubscribe = subscribeStudioEvents((event) => {
    sendJson(socket, createEventEnvelope(event));
    const wave = getNovaRuntimeState().waves.at(-1);
    if (wave) {
      sendJson(socket, createEnvelope("wave", wave));
    }
  });
  socket.on("close", () => {
    clients.delete(socket);
    unsubscribe();
  });
  socket.on("error", () => {
    clients.delete(socket);
    unsubscribe();
  });
  if (head?.length) {
    socket.unshift(head);
  }
  const novaState = getNovaRuntimeState();
  sendJson(socket, createEnvelope("stance", novaState.stance));
  for (const wave of novaState.waves) {
    sendJson(socket, createEnvelope("wave", wave));
  }
}

export function broadcastStudioState(type = "studio_state") {
  const payload = createEnvelope(type === "studio_state" ? "stance" : type, getNovaRuntimeState().stance);
  for (const client of clients) {
    sendJson(client, payload);
  }
  return { clientCount: clients.size };
}

/** Governed communication stream â€” fourth substrate channel alongside stance/wave/receipts */
export function broadcastCommunicationTick(tick) {
  const envelope = {
    channel: "communication",
    type: "communication",
    runtime_id: NOVA_RUNTIME_ID,
    session_id: NOVA_SESSION_ID,
    timestamp: new Date().toISOString(),
    payload: tick,
  };
  for (const client of clients) {
    sendJson(client, envelope);
  }
  logEvent("communication_tick", { tickId: tick.id, direction: tick.direction });
  return { clientCount: clients.size };
}

export function createEnvelope(type, payload) {
  return {
    type,
    runtime_id: NOVA_RUNTIME_ID,
    session_id: NOVA_SESSION_ID,
    timestamp: new Date().toISOString(),
    payload,
  };
}

export function createEventEnvelope(event) {
  return createEnvelope("event", {
    event_id: event.id,
    event_type: event.type,
    receipt_id: event.receiptId ?? null,
    phase: event.phase ?? null,
    state: getStudioState(),
  });
}

export function sendJson(socket, payload) {
  if (socket.destroyed) {
    return;
  }
  socket.write(encodeWebSocketFrame(JSON.stringify(payload)));
}

export function encodeWebSocketFrame(message) {
  const payload = Buffer.from(message, "utf8");
  if (payload.length < 126) {
    return Buffer.concat([Buffer.from([0x81, payload.length]), payload]);
  }
  if (payload.length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
    return Buffer.concat([header, payload]);
  }
  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(payload.length), 2);
  return Buffer.concat([header, payload]);
}

export function parseWebSocketFrame(buffer) {
  if (buffer.length < 2) {
    return null;
  }
  const second = buffer[1];
  const masked = (second & 0x80) !== 0;
  let length = second & 0x7f;
  let offset = 2;

  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    length = Number(buffer.readBigUInt64BE(offset));
    offset += 8;
  }

  if (masked) {
    if (buffer.length < offset + 4) return null;
    const mask = buffer.subarray(offset, offset + 4);
    offset += 4;
    if (buffer.length < offset + length) return null;
    return {
      message: buffer.subarray(offset, offset + length)
        .map((byte, index) => byte ^ mask[index % 4])
        .toString("utf8"),
      bytesRead: offset + length,
    };
  }
  if (buffer.length < offset + length) return null;
  return {
    message: buffer.subarray(offset, offset + length).toString("utf8"),
    bytesRead: offset + length,
  };
}
