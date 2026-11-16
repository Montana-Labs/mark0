<#
.SYNOPSIS
  Satu perintah untuk menyiapkan sesi load testing di Moona.

.DESCRIPTION
  1. Mematikan proses lama yang listen di port 3000, 4000, 5000.
  2. Membuka jendela PowerShell terpisah untuk middleware, Next.js, dan React
     (skrip 1-middleware.ps1, 2-nextjs.ps1, 3-react.ps1).
  3. Membuka jendela keempat untuk monitoring (scripts\monitor-server.ps1).
  4. Memeriksa ketiga port listen dan /health middleware.

  Tidak membutuhkan hak Administrator. Tidak melakukan build (memakai hasil build
  yang sudah ada). IP server tertanam di build Next.js dan React: kalau IP Moona
  berubah dari 192.168.18.15, build harus diulang lebih dulu.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\moona\mulai-tes.ps1
#>
param([string]$Ip = "192.168.18.15")

$here = $PSScriptRoot
$scripts = Split-Path -Parent $here

function Wait-Port($port, $sec) {
  for ($i = 0; $i -lt $sec; $i++) {
    if (Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue) { return $true }
    Start-Sleep -Seconds 1
  }
  return $false
}

function Open-Win($file, $extra) {
  $a = @('-NoExit', '-ExecutionPolicy', 'Bypass', '-File', $file) + $extra
  Start-Process powershell -ArgumentList $a | Out-Null
}

Write-Host "== 1. Mematikan proses lama di port 3000/4000/5000 =="
Get-NetTCPConnection -State Listen -LocalPort 3000,4000,5000 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2
$sisa = Get-NetTCPConnection -State Listen -LocalPort 3000,4000,5000 -ErrorAction SilentlyContinue
if ($sisa) { Write-Warning "Masih ada proses di port: $(($sisa | ForEach-Object LocalPort) -join ', '). Jalankan skrip ini lagi."; return }

Write-Host "== 2. Middleware (4000) =="
Open-Win (Join-Path $here "1-middleware.ps1") @('-Ip', $Ip)
if (-not (Wait-Port 4000 60)) { Write-Warning "Middleware belum listen setelah 60 detik. Lihat jendelanya."; return }

Write-Host "== 3. Next.js (3000) dan React (5000) =="
Open-Win (Join-Path $here "2-nextjs.ps1") @('-Ip', $Ip)
Open-Win (Join-Path $here "3-react.ps1") @()
$ok3 = Wait-Port 3000 90
$ok5 = Wait-Port 5000 90

Write-Host "== 4. Monitoring (jendela keempat) =="
Open-Win (Join-Path $scripts "monitor-server.ps1") @()

Write-Host ""
Write-Host "== Hasil pengecekan =="
"port 4000 listen : True"
"port 3000 listen : $ok3"
"port 5000 listen : $ok5"
$h = curl.exe -s --max-time 10 "http://localhost:4000/health"
"health middleware: $h"
Write-Host ""
Write-Host "Biarkan ke-4 jendela terbuka. Catat nama berkas CSV di jendela monitoring."
Write-Host "Tunggu 1-2 menit (baseline idle), lalu kabari 'siap'."
