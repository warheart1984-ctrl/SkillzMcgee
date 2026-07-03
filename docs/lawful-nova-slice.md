# Lawful Nova Slice

SkillzMcGee exposes a governed LLM capability named `llm_echo`. It runs through
the same CRK-2 slice path as other capabilities:

```text
operator request
-> runSlice
-> llm_echo capability
-> provider call
-> receipt
-> law kernel verdict
-> continuity events
```

Every run returns a receipt with the provider, model, prompt hash, output text,
token counts, drift record, provenance, and invariant verdict.

## Clone And Install

```bash
git clone https://github.com/warheart1984-ctrl/skillzmcgee.git
cd skillzmcgee
npm install
npm test
```

`npm test` should pass without any external model. The default provider is a
deterministic fallback, so a fresh clone can verify the governed path before
installing Ollama or Nova.

## Mode 1: Deterministic Fallback

No environment variables are required.

```bash
npm run nova-studio
```

Then call the governed slice API:

```bash
curl -X POST http://127.0.0.1:8787/api/slice/execute \
  -H "Content-Type: application/json" \
  -d '{"sliceId":"llm_echo","payload":{"prompt":"Write a small Python function."}}'
```

The response uses the deterministic fallback text. This proves receipts,
continuity, invariants, and the Nova Studio API are working, but it is not a real
model response.

## Mode 2: Local Ollama

Install Ollama, then pull a coding model:

```bash
ollama pull qwen2.5-coder:7b
```

Start Nova Studio with the Ollama provider:

```bash
export NOVA_PROVIDER=ollama
export NOVA_OLLAMA_MODEL=qwen2.5-coder:7b
export NOVA_OLLAMA_BASE_URL=http://127.0.0.1:11434
npm run nova-studio
```

PowerShell:

```powershell
$env:NOVA_PROVIDER = "ollama"
$env:NOVA_OLLAMA_MODEL = "qwen2.5-coder:7b"
$env:NOVA_OLLAMA_BASE_URL = "http://127.0.0.1:11434"
npm run nova-studio
```

Run the slice:

```bash
curl -X POST http://127.0.0.1:8787/api/slice/execute \
  -H "Content-Type: application/json" \
  -d '{"sliceId":"llm_echo","payload":{"prompt":"Write a small Python function.","model":"qwen2.5-coder:7b","max_tokens":256}}'
```

## Mode 3: Nova / OpenAI-Compatible Adapter

Use this when a local Nova adapter or another OpenAI-compatible server exposes
`/v1/chat/completions`.

```bash
export NOVA_PROVIDER=nova
export NOVA_OPENAI_BASE_URL=http://127.0.0.1:18081/v1
export NOVA_OPENAI_MODEL=nova-local
export NOVA_API_KEY=replace-with-your-key
npm run nova-studio
```

PowerShell:

```powershell
$env:NOVA_PROVIDER = "nova"
$env:NOVA_OPENAI_BASE_URL = "http://127.0.0.1:18081/v1"
$env:NOVA_OPENAI_MODEL = "nova-local"
$env:NOVA_API_KEY = "replace-with-your-key"
npm run nova-studio
```

Run the slice:

```bash
curl -X POST http://127.0.0.1:8787/api/slice/execute \
  -H "Content-Type: application/json" \
  -d '{"sliceId":"llm_echo","payload":{"prompt":"Reply with exactly: skillz-ready","model":"nova-local","max_tokens":16}}'
```

Expected receipt fields include:

```json
{
  "provider": "openai-compatible",
  "model": "nova-local",
  "text": "skillz-ready"
}
```

## Cursor Notes

Cursor's native provider may refuse private network URLs such as
`http://127.0.0.1:18081/v1`. If that happens, expose the Nova adapter with a
public HTTPS tunnel and keep `NOVA_API_KEY` enabled.

Cursor settings:

```text
Base URL: https://your-static-tunnel.example/v1
Model: nova-local
API key: your Nova adapter key
```

SkillzMcGee itself can still call the local adapter directly through
`NOVA_OPENAI_BASE_URL=http://127.0.0.1:18081/v1`.

## Verification

Focused lawful slice check:

```bash
node --test --test-name-pattern "lawful llm slice" tests/nova_studio.test.js
```

Nova Studio slice surface:

```bash
npm run test:nova-studio
```

Full JavaScript suite:

```bash
npm test
```
