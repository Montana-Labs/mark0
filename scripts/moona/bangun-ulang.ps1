<#
.SYNOPSIS
  Build ulang Next.js dan React dengan IP server baru (IP tertanam di build).

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\moona\bangun-ulang.ps1 -Ip 192.168.0.105
  lalu: powershell -ExecutionPolicy Bypass -File .\scripts\moona\mulai-tes.ps1 -Ip 192.168.0.105
#>
param([Parameter(Mandatory=$true)][string]$Ip)

$here = $PSScriptRoot
$root = Split-Path -Parent (Split-Path -Parent $here)

Write-Host "== 1. Mematikan proses lama di port 3000/4000/5000 =="
Get-NetTCPConnection -State Listen -LocalPort 3000,4000,5000 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

Write-Host "== 2. Middleware (dibutuhkan build SSG) =="
Start-Process powershell -ArgumentList @('-NoExit','-ExecutionPolicy','Bypass','-File',(Join-Path $here '1-middleware.ps1'),'-Ip',$Ip) | Out-Null
$ok = $false
for ($i = 0; $i -lt 60; $i++) {
  if (Get-NetTCPConnection -State Listen -LocalPort 4000 -ErrorAction SilentlyContinue) { $ok = $true; break }
  Start-Sleep -Seconds 1
}
if (-not $ok) { Write-Warning "Middleware tidak listen dalam 60 detik. Berhenti."; return }

Write-Host "== 3. Build Next.js untuk $Ip =="
Set-Location (Join-Path $root 'nextjs-ecommerce')
$env:API_URL = "http://${Ip}:4000"
$env:NEXT_PUBLIC_API_URL = "http://${Ip}:4000"
$env:MEDIA_TIER = "light"
$env:NEXT_PUBLIC_MEDIA_TIER = "light"
$env:NODE_ENV = "production"
pnpm build 2>&1 | Tee-Object -FilePath "C:\Skripsi\next-build-$Ip.txt"
if ($LASTEXITCODE -ne 0) { Write-Warning "Build Next.js gagal."; return }

Write-Host "== 4. Build React untuk $Ip =="
Set-Location (Join-Path $root 'react-ecommerce')
$env:VITE_API_URL = "http://${Ip}:4000"
$env:VITE_MEDIA_TIER = "light"
pnpm build
if ($LASTEXITCODE -ne 0) { Write-Warning "Build React gagal."; return }

Write-Host ""
Write-Host "Build selesai untuk $Ip. Lanjut: mulai-tes.ps1 -Ip $Ip"
