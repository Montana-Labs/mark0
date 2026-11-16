# Menyalakan React (port 5000) di server lokal Moona. Dijalankan dari mulai-tes.ps1.
$Host.UI.RawUI.WindowTitle = "mark0 react :5000"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location (Join-Path $root "react-ecommerce")
npx --yes serve@14 -s dist -l tcp://0.0.0.0:5000
