# Start Nova Studio Vite dev server (requires API on :8787).
$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

function Test-PortInUse([int]$Port) {
    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return $null -ne $conn
}

Set-Location $RepoRoot

if (-not (Test-PortInUse 8787)) {
    Write-Host "Warning: port 8787 is not in use. Start the API first:"
    Write-Host "  npm run nova-studio"
    Write-Host "  or: $RepoRoot\scripts\Start-NovaStudio.ps1"
    Write-Host ""
}

Write-Host "Starting Nova Studio React dev server from $RepoRoot"
npm run nova-studio:react
