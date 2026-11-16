# Menyalakan Next.js (port 3000, tier light) di server lokal Moona. Dijalankan dari mulai-tes.ps1.
param([string]$Ip = "192.168.18.15")
$Host.UI.RawUI.WindowTitle = "mark0 nextjs :3000"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location (Join-Path $root "nextjs-ecommerce")
$env:API_URL = "http://${Ip}:4000"
$env:NEXT_PUBLIC_API_URL = "http://${Ip}:4000"
$env:MEDIA_TIER = "light"
$env:NEXT_PUBLIC_MEDIA_TIER = "light"
$env:NODE_ENV = "production"
pnpm start -- -p 3000 -H 0.0.0.0
