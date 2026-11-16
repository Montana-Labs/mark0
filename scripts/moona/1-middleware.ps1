# Menyalakan middleware (port 4000) di server lokal Moona. Dijalankan dari mulai-tes.ps1.
param([string]$Ip = "192.168.18.15")
$Host.UI.RawUI.WindowTitle = "mark0 middleware :4000"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location (Join-Path $root "api-middleware")
$env:NODE_ENV = "production"
$env:PORT = "4000"
$env:PUBLIC_BASE_URL = "http://${Ip}:4000"
node dist/index.js
