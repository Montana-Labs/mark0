<#
.SYNOPSIS
  Monitoring sumber daya server (Moona) selama load testing k6.

.DESCRIPTION
  Mencatat tiap detik ke satu berkas CSV:
    cpu_pct          pemakaian CPU total (%)
    cpu_perf_pct     "Processor Performance" (%) -- turun di bawah 100 saat CPU
                     diturunkan frekuensinya (throttling/hemat daya)
    mem_avail_mb     RAM tersedia (MB)
    mem_used_mb      RAM terpakai = total - tersedia (MB)
    node_ws_mb       jumlah working set semua proses node.exe (MB): gabungan
                     middleware, Next.js, dan serve React
    net_rx_mbps      trafik masuk ke server, jumlah semua adapter (Mbps)
    net_tx_mbps      trafik keluar dari server (Mbps)
    tcp_established  jumlah koneksi TCP ESTABLISHED

  Dibuat untuk arahan Bu Nila (bimbingan 1, 5 Nov 2026): RAM selama diserang
  k6 (naik lalu turun lagi, atau tertahan = indikasi memory leak) dan
  fluktuasi bandwidth jaringan.

  Cara pakai yang disarankan:
    1. Jalankan skrip ini SEBELUM k6, biarkan 1-2 menit (baseline idle).
    2. Jalankan scripts/run-k6-lokal.sh dari Mac.
    3. Setelah k6 selesai, biarkan skrip berjalan 2-3 menit lagi (untuk melihat
       apakah RAM turun kembali), lalu hentikan dengan Ctrl+C.
  Satu berkas CSV untuk satu sesi penuh; dicocokkan dengan
  results/k6-lokal/run-log.csv lewat kolom epoch (waktu UTC).

  Jam Mac dan Moona harus selaras. Cek: di Mac "date +%s", di Moona
  "[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()". Selisih lebih dari 2 detik
  perlu diperbaiki (sinkronkan waktu otomatis di kedua mesin).

  Memakai kelas CIM Win32_PerfFormattedData_* (nama kelas sama di semua bahasa
  Windows). Hanya membaca; tidak mengubah pengaturan sistem.
  Dijalankan di Windows PowerShell 5.1 bawaan Windows 10/11.

.PARAMETER Out
  Lokasi berkas CSV. Bawaan: C:\Skripsi\monitor-<waktu>.csv (di luar repo).

.PARAMETER IntervalSec
  Selang pencatatan dalam detik. Bawaan 1.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\monitor-server.ps1
#>
param(
  [string]$Out = ("C:\Skripsi\monitor-{0:yyyyMMdd-HHmmss}.csv" -f (Get-Date)),
  [double]$IntervalSec = 1
)

$ErrorActionPreference = 'Stop'
$inv = [Globalization.CultureInfo]::InvariantCulture

function Fmt($v, $f = '0.00') {
  if ($null -eq $v) { return '' }
  return ([double]$v).ToString($f, $inv)
}

$totalMB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1MB)

"epoch,iso_utc,cpu_pct,cpu_perf_pct,mem_avail_mb,mem_used_mb,node_ws_mb,net_rx_mbps,net_tx_mbps,tcp_established" |
  Out-File -FilePath $Out -Encoding ascii

Write-Host "Monitoring dimulai. Berkas : $Out"
Write-Host "RAM total   : $totalMB MB     Selang: $IntervalSec detik"
Write-Host "Hentikan dengan Ctrl+C."

$sw = [Diagnostics.Stopwatch]::StartNew()
$n = 0
try {
  while ($true) {
    $t0 = $sw.ElapsedMilliseconds
    $now = [DateTimeOffset]::UtcNow

    $cpu = $null; $perf = $null; $avail = $null; $rx = $null; $tx = $null; $tcp = $null; $nodeMB = $null

    try { $cpu = (Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'").PercentProcessorTime } catch {}
    try { $perf = (Get-CimInstance Win32_PerfFormattedData_Counters_ProcessorInformation -Filter "Name='_Total'").PercentProcessorPerformance } catch {}
    try { $avail = (Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory).AvailableMBytes } catch {}
    try {
      $nics = Get-CimInstance Win32_PerfFormattedData_Tcpip_NetworkInterface
      $rx = ($nics | Measure-Object BytesReceivedPersec -Sum).Sum * 8 / 1e6
      $tx = ($nics | Measure-Object BytesSentPersec -Sum).Sum * 8 / 1e6
    } catch {}
    try { $tcp = (Get-CimInstance Win32_PerfFormattedData_Tcpip_TCPv4).ConnectionsEstablished } catch {}
    try {
      $ws = (Get-Process node -ErrorAction SilentlyContinue | Measure-Object WorkingSet64 -Sum).Sum
      if ($null -eq $ws) { $ws = 0 }
      $nodeMB = $ws / 1MB
    } catch {}

    $used = $null
    if ($null -ne $avail) { $used = $totalMB - $avail }

    $line = @(
      $now.ToUnixTimeSeconds(),
      $now.UtcDateTime.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      (Fmt $cpu '0'), (Fmt $perf '0'),
      (Fmt $avail '0'), (Fmt $used '0'), (Fmt $nodeMB '0.0'),
      (Fmt $rx '0.00'), (Fmt $tx '0.00'),
      (Fmt $tcp '0')
    ) -join ','
    Add-Content -Path $Out -Value $line -Encoding ascii

    $n++
    if ($n % 30 -eq 0) {
      Write-Host ("{0}  cpu={1}%  ram_terpakai={2}MB  node={3}MB  rx={4}Mbps  tx={5}Mbps  tcp={6}" -f `
        $now.UtcDateTime.ToString('HH:mm:ss'), (Fmt $cpu '0'), (Fmt $used '0'), (Fmt $nodeMB '0'), (Fmt $rx '0.0'), (Fmt $tx '0.0'), (Fmt $tcp '0'))
    }

    $wait = [int]($IntervalSec * 1000 - ($sw.ElapsedMilliseconds - $t0))
    if ($wait -gt 0) { Start-Sleep -Milliseconds $wait }
  }
}
finally {
  Write-Host "Monitoring dihentikan. $n baris tersimpan di $Out"
}
