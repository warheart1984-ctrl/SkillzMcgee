# Start Nova Studio API from repo root (safe to run from any directory).
$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

function Test-PortInUse([int]$Port) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $conn
}

Set-Location $RepoRoot

if (Test-PortInUse 8787) {
    $pid = (Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1 -ExpandProperty OwningProcess)
    Write-Host "Nova Studio API already running on http://localhost:8787 (PID $pid)"
    exit 0
}

Write-Host "Starting Nova Studio from $RepoRoot"
npm run nova-studio
