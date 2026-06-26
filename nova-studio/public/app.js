const API = "";

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

function el(id) {
  return document.getElementById(id);
}

function renderMetrics(metrics) {
  const panel = el("metrics-panel");
  if (!panel) return;
  const rows = [
    ["Coherence", `${metrics.coherence}%`],
    ["Thread Integrity", `${metrics.threadIntegrity}%`],
    ["Wave Alignment", `${metrics.waveAlignment}%`],
    ["Lawfulness", `${metrics.lawfulness}%`],
    ["Drift", `${metrics.drift}`],
    ["Receipts", `${metrics.receiptCount}`],
  ];
  panel.innerHTML = rows
    .map(
      ([k, v]) =>
        `<div class="metric-row"><span>${k}</span><span class="metric-val">${v}</span></div>`
    )
    .join("");
}

function renderTimeline(events, ledger) {
  const ul = el("thread-timeline");
  if (!ul) return;
  const items = [
    ...events.slice(0, 8).map((e) => `<li><strong>${e.type}</strong> <small>${e.timestamp}</small></li>`),
    ...ledger
      .slice(-5)
      .reverse()
      .map((r) => `<li><strong>${r.phase ?? r.slice}</strong> ${r.id}</li>`),
  ];
  ul.innerHTML = items.join("") || "<li>No events yet</li>";
}

function renderLineage(metrics) {
  const div = el("lineage-graph");
  if (!div) return;
  const fp = metrics.fingerprint?.slice(0, 16) ?? "—";
  div.innerHTML = `ROOT → nova-studio → ${fp}… (${metrics.receiptCount} nodes)`;
}

function renderCorridor(steps) {
  const div = el("reasoning-corridor");
  if (!div) return;
  div.innerHTML = (steps ?? [])
    .map((s) => `<div class="corridor-step active">${s.step}</div>`)
    .join("");
}

function renderCapTable(rows) {
  const tbody = el("cap-table-body");
  if (!tbody) return;
  tbody.innerHTML = (rows ?? [])
    .map(
      (r) =>
        `<tr><td>${r.capability}</td><td>${r.target}</td><td>${r.status}</td><td><code>${r.receiptId}</code></td></tr>`
    )
    .join("");
}

function renderGovernance(items) {
  const ul = el("governance-list");
  if (!ul) return;
  ul.innerHTML = items
    .map((g) => `<li class="${g.passed ? "pass" : "fail"}">${g.passed ? "✓" : "✗"} ${g.name}</li>`)
    .join("");
}

function renderReceipts(ledger) {
  const ul = el("receipt-list");
  if (!ul) return;
  ul.innerHTML = ledger
    .slice(-10)
    .reverse()
    .map((r) => `<li><code>${r.id}</code> — ${r.phase ?? r.slice}</li>`)
    .join("");
}

function renderWave(metrics) {
  const canvas = el("wave-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#3d9eff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const align = (metrics.waveAlignment ?? 50) / 100;
  for (let x = 0; x < canvas.width; x++) {
    const y = 30 + Math.sin(x * 0.08 + Date.now() / 500) * 15 * align;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function renderConstellation(constellation) {
  const bar = el("constellation-bar");
  if (!bar) return;
  bar.innerHTML = (constellation?.peers ?? [])
    .map((p) => `<span class="peer-chip ${p.status}">${p.id}</span>`)
    .join("");
}

function renderEvents(events) {
  const pre = el("event-log");
  if (!pre) return;
  pre.textContent = events
    .slice(0, 12)
    .map((e) => `${e.timestamp}  ${e.type}`)
    .join("\n");
}

function renderSpecimens(specimens) {
  const ul = el("specimen-list");
  if (!ul) return;
  ul.innerHTML = specimens
    .map((s) => `<li><code>${s.id}</code> (${s.receiptCount} receipts)</li>`)
    .join("");
}

let lastSpecimenId = null;

async function refresh() {
  const state = await api("/api/state");
  renderMetrics(state.metrics);
  renderTimeline(state.events, state.ledger);
  renderLineage(state.metrics);
  renderGovernance(state.governance);
  renderReceipts(state.ledger);
  renderEvents(state.events);
  renderWave(state.metrics);

  const constellation = await api("/api/federation/constellation");
  renderConstellation(constellation);

  const specimens = await api("/api/specimen/list");
  renderSpecimens(specimens.specimens ?? []);

  const editor = el("code-editor");
  if (editor && !editor.dataset.loaded) {
    try {
      const cap = await api("/api/capability", {
        method: "POST",
        body: JSON.stringify({ name: "read_file", args: { path: "organism.py" } }),
      });
      if (cap.ok && cap.output?.content) {
        editor.value = cap.output.content;
        editor.dataset.loaded = "1";
      }
    } catch {
      /* workspace may be empty on first boot */
    }
  }
}

async function runPipeline() {
  const prompt = el("intent-prompt")?.value?.trim();
  const code = el("code-editor")?.value;
  if (!prompt) return;

  const result = await api("/api/governed-run", {
    method: "POST",
    body: JSON.stringify({ prompt, code }),
  });

  el("output").textContent = result.output ?? "—";
  renderCorridor(result.reasoningCorridor);
  renderCapTable(result.capabilityTable);
  await refresh();
}

async function exportSpecimen() {
  const result = await api("/api/specimen/export", {
    method: "POST",
    body: JSON.stringify({ label: "nova-studio" }),
  });
  lastSpecimenId = result.id;
  el("federation-log").textContent = `Exported specimen: ${result.id}`;
  await refresh();
}

async function replaySpecimen() {
  if (!lastSpecimenId) {
    const list = await api("/api/specimen/list");
    lastSpecimenId = list.specimens?.[0]?.id;
  }
  if (!lastSpecimenId) return;
  const result = await api("/api/specimen/replay", {
    method: "POST",
    body: JSON.stringify({ id: lastSpecimenId }),
  });
  el("federation-log").textContent = `Replay: ${result.fingerprint} (deterministic: ${result.deterministic})`;
}

async function verifySpecimen() {
  if (!lastSpecimenId) return;
  const result = await api("/api/specimen/verify", {
    method: "POST",
    body: JSON.stringify({ id: lastSpecimenId }),
  });
  el("federation-log").textContent = result.ok
    ? `Verify PASS — ${result.receiptCount} receipts`
    : `Verify FAIL — ${result.errors?.join(", ")}`;
}

async function broadcastFederation() {
  const result = await api("/api/federation/exchange", {
    method: "POST",
    body: JSON.stringify({ broadcast: true }),
  });
  el("federation-log").textContent = JSON.stringify(
    result.exchanges?.map((e) => `${e.from}→${e.to}`),
    null,
    2
  );
  await refresh();
}

el("run-btn")?.addEventListener("click", () => runPipeline().catch((e) => alert(e.message)));
el("specimen-export")?.addEventListener("click", () => exportSpecimen().catch((e) => alert(e.message)));
el("specimen-replay")?.addEventListener("click", () => replaySpecimen().catch((e) => alert(e.message)));
el("specimen-verify")?.addEventListener("click", () => verifySpecimen().catch((e) => alert(e.message)));
el("federation-broadcast")?.addEventListener("click", () => broadcastFederation().catch((e) => alert(e.message)));

refresh().catch(console.error);
setInterval(() => {
  renderWave({ waveAlignment: 90 });
}, 2000);
setInterval(() => refresh().catch(() => {}), 8000);
