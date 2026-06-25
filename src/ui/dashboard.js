import { novaSlice } from "../nova/novaSlice.js";
import { getReceipts } from "../nova/receipts.js";
import { runCTS } from "../nova/cts.js";
import { saveReceipt, loadReceipts } from "../storage/db.js";

const els = {
  prompt: () => document.getElementById("prompt"),
  output: () => document.getElementById("output"),
  receipts: () => document.getElementById("receipts-panel"),
  cts: () => document.getElementById("cts-panel"),
  runBtn: () => document.getElementById("run-btn"),
  receiptsBtn: () => document.getElementById("receipts-btn"),
  ctsBtn: () => document.getElementById("cts-btn"),
  status: () => document.getElementById("status")
};

function setStatus(message, type = "info") {
  const el = els.status();
  if (!el) return;
  el.textContent = message;
  el.dataset.type = type;
}

function formatReceipt(receipt) {
  return JSON.stringify(receipt, null, 2);
}

function renderReceipts(receipts) {
  const panel = els.receipts();
  if (!panel) return;

  if (receipts.length === 0) {
    panel.innerHTML = "<p class='empty'>No receipts yet. Run NovaSlice first.</p>";
    return;
  }

  panel.innerHTML = receipts
    .map(
      (r) => `
    <article class="receipt ${r.laws.allowed ? "allowed" : "rejected"}">
      <header>
        <strong>${r.id}</strong>
        <time>${r.timestamp}</time>
      </header>
      <p><span class="label">Intent:</span> ${r.intent.type} (confidence ${r.intent.confidence})</p>
      <p><span class="label">Laws:</span> ${r.laws.allowed ? "allowed" : "rejected"} ${r.laws.violations.length ? `— ${r.laws.violations.join(", ")}` : ""}</p>
      <details>
        <summary>Full receipt</summary>
        <pre>${formatReceipt(r)}</pre>
      </details>
    </article>`
    )
    .join("");
}

function renderCTS(results) {
  const panel = els.cts();
  if (!panel) return;

  panel.innerHTML = results
    .map(
      (r) => `
    <div class="cts-rule ${r.passed ? "pass" : "fail"}">
      <span class="cts-id">${r.id}</span>
      <span class="cts-desc">${r.description}</span>
      <span class="cts-badge">${r.passed ? "PASS" : "FAIL"}</span>
    </div>`
    )
    .join("");
}

export async function handleRunNovaSlice() {
  const prompt = els.prompt()?.value?.trim();
  if (!prompt) {
    setStatus("Enter a prompt first.", "warn");
    return;
  }

  setStatus("Running NovaSlice…", "info");
  els.runBtn()?.setAttribute("disabled", "true");

  try {
    const receipt = await novaSlice(prompt);
    await saveReceipt(receipt);

    const output = els.output();
    if (output) {
      output.textContent =
        typeof receipt.output === "string"
          ? receipt.output
          : JSON.stringify(receipt.output, null, 2);
    }

    setStatus(`Receipt ${receipt.id} created.`, "success");
  } catch (err) {
    setStatus(`Error: ${err.message}`, "error");
  } finally {
    els.runBtn()?.removeAttribute("disabled");
  }
}

export async function handleViewReceipts() {
  setStatus("Loading receipts…", "info");

  const inMemory = getReceipts();
  let stored = [];
  try {
    stored = await loadReceipts();
  } catch {
    // IndexedDB may be unavailable in some contexts
  }

  const byId = new Map();
  [...stored, ...inMemory].forEach((r) => byId.set(r.id, r));
  const merged = [...byId.values()].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  renderReceipts(merged);
  setStatus(`${merged.length} receipt(s) loaded.`, "success");
}

export function handleRunCTS() {
  const results = runCTS();
  renderCTS(results);
  const allPass = results.every((r) => r.passed);
  setStatus(
    allPass ? "All CTS rules passed." : "Some CTS rules failed.",
    allPass ? "success" : "warn"
  );
}

export function initDashboard() {
  els.runBtn()?.addEventListener("click", handleRunNovaSlice);
  els.receiptsBtn()?.addEventListener("click", handleViewReceipts);
  els.ctsBtn()?.addEventListener("click", handleRunCTS);

  els.prompt()?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleRunNovaSlice();
    }
  });

  setStatus("Ready. Enter a prompt and run NovaSlice.", "info");
}
