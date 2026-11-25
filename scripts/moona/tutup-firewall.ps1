<#
  Menutup kembali port yang dibuka buka-firewall.ps1. PowerShell ADMINISTRATOR:
    powershell -ExecutionPolicy Bypass -File .\scripts\moona\tutup-firewall.ps1
#>
Remove-NetFirewallRule -DisplayName "mark0 server" -ErrorAction SilentlyContinue
Write-Host "Aturan firewall 'mark0 server' dihapus." -ForegroundColor Green
