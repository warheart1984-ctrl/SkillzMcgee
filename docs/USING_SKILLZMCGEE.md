# How To Use SkillzMcGee After Cloning

Anyone who clones the repo can run SkillzMcGee in three modes, depending on
whether they want deterministic behavior, a local model, or a Nova/OpenAI-
compatible endpoint.

This is the clean, universal workflow.

## 1. Clone And Install

```bash
git clone https://github.com/warheart1984-ctrl/skillzmcgee.git
cd skillzmcgee
npm install
```

At this point, the repo is fully functional.

## 2. Choose Your LLM Provider

SkillzMcGee supports three provider modes.

## Mode A: Deterministic Stub

This is the default mode. It works immediately after install and requires no
environment variables.

```bash
npm test
npm run nova-studio
```

The `llm_echo` slice returns deterministic output like:

```text
LLM(qwen2.5-coder:7b) says: <prompt>
```

This proves the governed slice pipeline works without requiring a real model.

## Mode B: Local Model Via Ollama

This is recommended for offline development.

Install Ollama:

[https://ollama.com](https://ollama.com)

Pull a model:

```bash
ollama pull qwen2.5-coder:7b
```

Set provider environment variables.

PowerShell:

```powershell
$env:NOVA_PROVIDER = "ollama"
$env:NOVA_OLLAMA_MODEL = "qwen2.5-coder:7b"
$env:NOVA_OLLAMA_BASE_URL = "http://127.0.0.1:11434"
```

Bash:

```bash
export NOVA_PROVIDER=ollama
export NOVA_OLLAMA_MODEL=qwen2.5-coder:7b
export NOVA_OLLAMA_BASE_URL=http://127.0.0.1:11434
```

Run Nova Studio:

```bash
npm run nova-studio
```

Now governed slices call Ollama locally.

## Mode C: Nova / OpenAI-Compatible Endpoint

Use this mode when the operator has a Nova-compatible endpoint, either local,
hosted, or exposed through a static HTTPS tunnel.

PowerShell:

```powershell
$env:NOVA_PROVIDER = "nova"
$env:NOVA_OPENAI_BASE_URL = "https://your-static-domain.example/v1"
$env:NOVA_OPENAI_MODEL = "nova-local"
$env:NOVA_API_KEY = "<their-key>"
```

Bash:

```bash
export NOVA_PROVIDER=nova
export NOVA_OPENAI_BASE_URL=https://your-static-domain.example/v1
export NOVA_OPENAI_MODEL=nova-local
export NOVA_API_KEY=<their-key>
```

Then run:

```bash
npm run nova-studio
```

SkillzMcGee calls:

```text
POST /v1/chat/completions
```

and records the governed receipt.

## 3. Run A Governed Slice

Once Nova Studio is running, execute:

```text
POST /api/slice/execute
```

Example payload:

```json
{
  "sliceId": "llm_echo",
  "payload": {
    "prompt": "Write a small Python function.",
    "model": "qwen2.5-coder:7b"
  }
}
```

This works across all three provider modes.

## 4. What New Users Do Not Need

They do not need:

- your ngrok token
- your local Nova install
- your Cursor setup
- your Ollama model
- your machine-specific paths

Everything is provider-agnostic.

## 5. Env File Template

See [.env.example](../.env.example) for copyable provider examples.

Do not commit real API keys, ngrok authtokens, private endpoint URLs, or local
machine-specific secrets.

## 6. Verification

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

This is operational adaptation without constitutional change: the provider may
change, but the governed slice, receipt, continuity, and invariant path remain
the same.
