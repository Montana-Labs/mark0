<#
  Membuka port 3000, 4000, 5000 untuk demo/pengujian (jaringan Private saja).
  Jalankan di PowerShell ADMINISTRATOR:
    powershell -ExecutionPolicy Bypass -File .\scripts\moona\buka-firewall.ps1
  Setelah selesai, tutup lagi dengan tutup-firewall.ps1.
#>
Remove-NetFirewallRule -DisplayName "mark0 server" -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "mark0 server" -Direction Inbound -Protocol TCP -LocalPort 3000,4000,5000 -Action Allow -Profile Private | Out-Null
Get-NetConnectionProfile | Where-Object NetworkCategory -ne 'Private' | ForEach-Object {
  Write-Host "PERINGATAN: jaringan '$($_.InterfaceAlias)' berstatus $($_.NetworkCategory), ubah ke Private agar port terbuka." -ForegroundColor Yellow
}
Write-Host "Firewall dibuka untuk port 3000, 4000, 5000 (Private)." -ForegroundColor Green
