import React, { useEffect, useState } from "react";
import { generateReply, normalizeMessage } from "../runtime/semanticBridge.js";
import { writeCommunicationTick } from "../runtime/communicationLedger.js";
import { refineReply } from "../runtime/replyAssistant.js";
import { fetchLanes, getActiveLaneId, setActiveLaneId } from "../runtime/laneContext.js";
import "./SemanticBridgePanel.css";

function discordWsUrl() {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws/discord`;
}

export default function SemanticBridgePanel() {
  const [laneId, setLaneId] = useState(getActiveLaneId());
  const [lanes, setLanes] = useState([]);
  const [laneContext, setLaneContext] = useState(null);
  const [direction, setDirection] = useState("darz->jon");
  const [rawInput, setRawInput] = useState("");
  const [normalized, setNormalized] = useState(null);
  const [reply, setReply] = useState("");
  const [lastDiscordMsg, setLastDiscordMsg] = useState(null);
  const [discordLive, setDiscordLive] = useState(false);
  const [ledgerStatus, setLedgerStatus] = useState(null);
  const [driftBadge, setDriftBadge] = useState(null);
  const [replyGuard, setReplyGuard] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetchLanes().then(setLanes);
  }, []);

  useEffect(() => {
    setActiveLaneId(laneId);
    setNormalized(null);
    setReply("");
    setDriftBadge(null);
    setLedgerStatus(null);
    void fetch(`/api/communication/lanes/${encodeURIComponent(laneId)}`)
      .then((r) => r.json())
      .then((d) => setLaneContext(d.lane ?? null))
      .catch(() => setLaneContext(null));
  }, [laneId]);

  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(discordWsUrl());
    } catch {
      setDiscordLive(false);
      return undefined;
    }

    ws.onopen = () => setDiscordLive(true);
    ws.onclose = () => setDiscordLive(false);
    ws.onerror = () => setDiscordLive(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "discord.connected") return;
        if (data.type !== "discord.message" && !data.content) return;

        const msg = {
          author: data.author ?? "unknown",
          content: data.content ?? "",
          timestamp: data.timestamp ?? new Date().toISOString(),
          channel: data.channel ?? "general",
        };
        setLastDiscordMsg(msg);
        setRawInput(msg.content);
        setDirection("darz->jon");
        if (laneId === "jon-darz-architecture") {
          setLaneId("jon-darz-architecture");
        }
      } catch {
        // ignore malformed frames
      }
    };

    return () => ws.close();
  }, [laneId]);

  async function handleNormalize() {
    if (!rawInput.trim()) return;
    setBusy(true);
    setLedgerStatus(null);
    setDriftBadge(null);
    try {
      const result = normalizeMessage(rawInput, direction);
      setNormalized(result);

      const base = generateReply(result);
      setReply(refineReply(result, base));

      const anchored = await writeCommunicationTick(result, { laneId });
      setLedgerStatus(anchored.id ?? anchored.tick?.id ?? "anchored");
      if (anchored.corridor_status && anchored.corridor_status !== "ok") {
        setDriftBadge(anchored.corridor_status);
      }
    } catch (err) {
      console.error(err);
      setLedgerStatus(err instanceof Error ? err.message : "ledger failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleRefine() {
    if (!normalized || !reply.trim()) return;
    setBusy(true);
    setReplyGuard(null);
    try {
      const res = await fetch("/api/assistant/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ normalized, draft: reply, lane_id: laneId }),
      });
      const data = await res.json();
      if (data.blocked) {
        setReplyGuard(data);
        return;
      }
      if (data.refined) setReply(data.refined);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="semantic-bridge-panel">
      <h2>Semantic Bridge — DAR-Z ↔ JON</h2>

      <div className="lane-context-bar">
        <label>
          Lane{" "}
          <select value={laneId} onChange={(e) => setLaneId(e.target.value)}>
            {lanes.map((l) => (
              <option key={l.lane_id} value={l.lane_id}>
                {l.label ?? l.lane_id}
              </option>
            ))}
          </select>
        </label>
        {laneContext && (
          <>
            <span className={`lane-status lane-status-${(laneContext.status ?? "ACTIVE").toLowerCase()}`}>
              {laneContext.status ?? "ACTIVE"}
            </span>
            <span className="corridor-summary">{laneContext.corridor_summary}</span>
          </>
        )}
        {driftBadge && (
          <span className={`drift-badge drift-${driftBadge}`}>{driftBadge.replace("_", " ")}</span>
        )}
      </div>

      <div className="semantic-bridge-toolbar">
        <label>
          Direction{" "}
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="darz->jon">Dar-Z → Jon</option>
            <option value="jon->darz">Jon → Dar-Z</option>
          </select>
        </label>
        <span
          className={
            discordLive ? "discord-status discord-status-live" : "discord-status discord-status-off"
          }
        >
          Discord {discordLive ? "live" : "offline"}
        </span>
        {ledgerStatus && <span className="discord-meta">Ledger: {ledgerStatus}</span>}
      </div>

      <div className="bridge-grid">
        <div className="bridge-column">
          <h3>Raw Message</h3>
          {lastDiscordMsg && (
            <p className="discord-meta">
              Last Discord — {lastDiscordMsg.author} in #{lastDiscordMsg.channel}
            </p>
          )}
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste message from Dar-z or write your own…"
            rows={12}
          />
          <button type="button" onClick={() => void handleNormalize()} disabled={busy}>
            {busy ? "Normalizing…" : "Normalize"}
          </button>
        </div>

        <div className="bridge-column">
          <h3>Normalized</h3>
          {normalized ? (
            <pre className="normalized-block">{JSON.stringify(normalized, null, 2)}</pre>
          ) : (
            <p>No message normalized yet.</p>
          )}
        </div>

        <div className="bridge-column">
          <h3>Suggested Reply</h3>
          {replyGuard?.blocked && (
            <div className="reply-guard-banner">
              Continuity-aware guard blocked this reply ({replyGuard.reason}).
              {replyGuard.governance_prompt}
            </div>
          )}
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={12} />
          <button type="button" disabled={!normalized || busy} onClick={() => void handleRefine()}>
            AI-Refine
          </button>
          <button
            type="button"
            disabled={!reply}
            onClick={() => void navigator.clipboard.writeText(reply)}
          >
            Copy Reply
          </button>
        </div>
      </div>
    </div>
  );
}
