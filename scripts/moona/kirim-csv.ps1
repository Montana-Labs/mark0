<#
.SYNOPSIS
  Menyajikan berkas CSV monitoring supaya bisa diunduh dari Mac.

.DESCRIPTION
  Dijalankan SETELAH monitoring dihentikan (Ctrl+C). Langkah:
    1. Menyalin C:\Skripsi\monitor-*.csv (kecuali berkas uji) ke C:\Skripsi\kirim\
    2. Mematikan server React di port 5000 (aturan firewall port itu sudah terbuka)
    3. Menyajikan folder kirim di port 5000, sehingga Mac bisa mengunduh dengan curl.
  Hentikan dengan Ctrl+C setelah Mac selesai mengunduh. Tidak butuh Administrator.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\moona\kirim-csv.ps1
#>
$kirim = "C:\Skripsi\kirim"
New-Item -ItemType Directory -Force $kirim | Out-Null

Get-ChildItem "C:\Skripsi\monitor-*.csv" | Where-Object { $_.Name -notmatch 'uji' } |
  ForEach-Object { Copy-Item $_.FullName $kirim -Force; Write-Host ("Disalin: {0} ({1} KB)" -f $_.Name, [math]::Round($_.Length / 1KB)) }

Get-NetTCPConnection -State Listen -LocalPort 5000 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

Write-Host "Menyajikan $kirim di port 5000. Kabari Mac; hentikan dengan Ctrl+C setelah selesai."
npx --yes serve@14 $kirim -l tcp://0.0.0.0:5000
