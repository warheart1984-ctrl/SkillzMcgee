import { novaSlice } from "../nova/novaSlice.js";
import { getReceipts, clearReceipts } from "../nova/receipts.js";
import { runAll } from "../nova/cts.js";
import { loadReceipts } from "../storage/db.js";
import { bootGovernedRuntime, getRuntime, refreshSingularity } from "../runtime/boot.js";

function showToast(message, type = "success") {
  const status = document.getElementById("status");
  if (!status) return;
  status.textContent = message;
  status.dataset.type = type;
}

function formatIntent(intent) {
  if (!intent || typeof intent !== "object") return "—";
  const type = intent.type ?? "unknown";
  const confidence =
    typeof intent.confidence === "number" ? intent.confidence : "—";
  return `${type} (confidence: ${confidence})`;
}

function renderReceipts(receipts) {
  const panel = document.getElementById("receipts-panel");
  if (!panel) return;

  if (!receipts?.length) {
    panel.innerHTML = '<p class="empty">No receipts yet. Run NovaSlice to create one.</p>';
    return;
  }

  panel.innerHTML = receipts
    .map((r) => {
      const allowed = r.laws?.allowed === true;
      const violations = r.laws?.violations ?? [];
      const cls = allowed ? "allowed" : "rejected";
      const outputText =
        typeof r.output === "string" ? r.output : JSON.stringify(r.output, null, 2);
      return `
        <article class="receipt ${cls}">
          <header>
            <strong>${r.id}</strong>
            <time>${r.timestamp}</time>
          </header>
          <p><span class="label">Intent:</span> ${formatIntent(r.intent)}</p>
          <p><span class="label">Laws:</span> ${allowed ? "allowed" : `rejected (${violations.length} violation(s))`}</p>
          <pre>${outputText}</pre>
        </article>
      `;
    })
    .join("");
}

function renderSingularity(singularity) {
  const panel = document.getElementById("singularity-panel");
  if (!panel) return;

  if (!singularity || singularity.receiptCount === 0) {
    panel.innerHTML =
      '<p class="empty">No singularity yet — run a slice to fold the ledger.</p>';
    return;
  }

  const w_t =
    singularity.wave?.nonlinear?.terminal?.w ??
    singularity.wave?.linear?.w_t ??
    singularity.wave?.w_t ??
    {};
  const dimensions =
    singularity.wave?.linear?.dimensions ?? singularity.wave?.dimensions ?? [];

  const waveBars = dimensions
    .map((dim) => {
      const val = w_t[dim] ?? 0;
      const pct = Math.round(val * 100);
      return `
        <div class="wave-dim">
          <span class="wave-label">${dim}</span>
          <div class="wave-bar"><span style="width:${pct}%"></span></div>
          <span class="wave-val">${pct}%</span>
        </div>
      `;
    })
    .join("");

  const worldlines = (singularity.lineage?.worldlines ?? [])
    .map(
      (wl) =>
        `<li><code>${wl.lineageId}</code> depth ${wl.depth} · ${wl.path.length} node(s)</li>`
    )
    .join("");

  panel.innerHTML = `
    <div class="singularity-meta">
      <p><span class="label">Version:</span> ${singularity.version}</p>
      <p><span class="label">Fingerprint:</span> <code>${singularity.fingerprint}</code></p>
      <p><span class="label">Merkle root:</span> <code>${singularity.merkle?.globalRoot ?? "—"}</code></p>
      <p><span class="label">Receipts:</span> ${singularity.receiptCount}</p>
      <p><span class="label">K4 reconstructable:</span> ${singularity.k4?.reconstructable ? "yes" : "no"}</p>
      <p><span class="label">Hash chain:</span> ${singularity.k4?.hashChainValid ? "valid" : "invalid"}</p>
      <p><span class="label">Phase transition:</span> ${singularity.wave?.phaseTransition ? "detected" : "stable"}</p>
      <p><span class="label">Genesis H-Ω:</span> <code>${singularity.genesisOperator?.fingerprint ?? "—"}</code></p>
    </div>
    <h3 class="subhead">Lineage worldlines</h3>
    <ul class="worldlines">${worldlines || "<li>—</li>"}</ul>
    <h3 class="subhead">Nonlinear Wave — w<sub>t</sub></h3>
    <div class="wave-grid">${waveBars}</div>
    <h3 class="subhead">DAR-Z field summary</h3>
    <pre class="darz-block">${JSON.stringify(
      {
        interference: singularity.darz?.fields?.interference,
        collapse: singularity.darz?.fields?.collapse,
        lineageFields: singularity.darz?.fields?.lineageFields,
      },
      null,
      2
    )}</pre>
  `;
}

function handleFoldSingularity() {
  const singularity = refreshSingularity();
  renderSingularity(singularity);
  showToast(`Folded AS-1 ${singularity.fingerprint}`, "success");
}

function renderCTS(results) {
  const panel = document.getElementById("cts-panel");
  if (!panel) return;

  panel.innerHTML = results
    .map((r) => {
      const cls = r.passed ? "pass" : "fail";
      return `
        <div class="cts-rule ${cls}">
          <span class="cts-id">${r.id}</span>
          <span class="cts-desc">${r.description}</span>
          <span class="cts-badge">${r.passed ? "PASS" : "FAIL"}</span>
        </div>
      `;
    })
    .join("");
}

async function handleRunNovaSlice() {
  const promptEl = document.getElementById("prompt");
  const output = document.getElementById("output");
  const runBtn = document.getElementById("run-btn");
  const prompt = promptEl?.value?.trim();

  if (!prompt) {
    showToast("Enter a prompt first.", "warn");
    return;
  }

  runBtn.disabled = true;
  showToast("Running NovaSlice…", "success");

  try {
    const { output: text, receipt } = await novaSlice(prompt);
    const allowed = receipt.laws?.allowed === true;
    showToast(
      `Receipt ${receipt.id} (${allowed ? "allowed" : "rejected"})`,
      allowed ? "success" : "warn"
    );
    if (output) output.textContent = text;
    renderReceipts(getRuntime().ledger.all());
    renderSingularity(getRuntime().singularity);
  } catch (err) {
    showToast(`Error: ${err.message}`, "error");
    if (output) output.textContent = String(err);
  } finally {
    runBtn.disabled = false;
  }
}

function handleViewReceipts() {
  renderReceipts(getRuntime().ledger.all());
  showToast(`Showing ${getRuntime().ledger.all().length} receipt(s) from continuity ledger.`, "success");
}

function handleRunCTS() {
  const receipts = getRuntime().ledger.all();
  const results = runAll(receipts);
  renderCTS(results);
  const allPass = results.every((r) => r.passed);
  showToast(
    allPass ? "All CTS rules passed." : "Some CTS rules failed.",
    allPass ? "success" : "warn"
  );
}

async function handleClearReceipts() {
  await clearReceipts();
  renderReceipts([]);
  renderSingularity(getRuntime().singularity);
  const output = document.getElementById("output");
  if (output) output.textContent = "—";
  showToast("Receipts cleared.", "success");
}

/**
 * Boot governed runtime from IndexedDB, then wire UI.
 */
export async function initDashboard() {
  const stored = await loadReceipts();
  bootGovernedRuntime(stored);

  const runBtn = document.getElementById("run-btn");
  const receiptsBtn = document.getElementById("receipts-btn");
  const ctsBtn = document.getElementById("cts-btn");
  const clearBtn = document.getElementById("clear-btn");
  const foldBtn = document.getElementById("fold-btn");
  const promptEl = document.getElementById("prompt");

  runBtn?.addEventListener("click", handleRunNovaSlice);
  receiptsBtn?.addEventListener("click", handleViewReceipts);
  ctsBtn?.addEventListener("click", handleRunCTS);
  clearBtn?.addEventListener("click", handleClearReceipts);
  foldBtn?.addEventListener("click", handleFoldSingularity);

  promptEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleRunNovaSlice();
    }
  });

  const count = getRuntime().ledger.all().length;
  showToast(
    count > 0
      ? `Governed runtime ready (${count} receipt(s) loaded).`
      : "Governed runtime ready.",
    "success"
  );
  renderReceipts(getRuntime().ledger.all());
  renderSingularity(getRuntime().singularity);
}
