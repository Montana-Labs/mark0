<#
.SYNOPSIS
  Monitoring sumber daya server (Moona) selama load testing k6.

.DESCRIPTION
  Mencatat satu baris per detik ke satu berkas CSV:
    cpu_pct          pemakaian CPU total (%)
    cpu_perf_pct     "Processor Performance" (%), relatif terhadap frekuensi
                     nominal. Nilai normal bisa di atas 100 (turbo boost);
                     nilai yang turun jauh di bawah 100 menandakan CPU
                     diturunkan frekuensinya (throttling/hemat daya).
    mem_avail_mb     RAM tersedia (MB)
    mem_used_mb      RAM terpakai = total - tersedia (MB)
    node_ws_mb       jumlah working set semua proses node.exe (MB): gabungan
                     middleware, Next.js, dan serve React
    net_rx_mbps      trafik masuk ke server, jumlah semua adapter (Mbps)
    net_tx_mbps      trafik keluar dari server (Mbps)
    tcp_established  jumlah koneksi TCP ESTABLISHED
    node_top_core_pct  CPU proses node.exe TERSIBUK, dalam % dari SATU inti
                     (100 = satu inti penuh). Nilai ~100 berarti proses itu
                     jenuh walau CPU total terlihat rendah (Node satu thread).
    node_top_port    port yang didengarkan proses tersibuk itu (3000 Next.js,
                     4000 middleware, 5000 React/serve); kosong bila tidak ada
    node_sum_core_pct  jumlah CPU semua proses node.exe (% dari satu inti)
    monitor_cpu_pct  beban CPU skrip ini sendiri, dalam % dari kapasitas CPU
                     total (supaya pencemaran pengukur bisa dikurangkan/dilaporkan)

  Dibuat untuk arahan Bu Nila (bimbingan 1, 5 Nov 2026): RAM selama diserang
  k6 (naik lalu turun lagi, atau tertahan = indikasi memory leak) dan
  fluktuasi bandwidth jaringan.

  Rancangan: objek PerformanceCounter dibuat SEKALI lalu hanya dibaca tiap
  detik. Versi awal memakai 5 kueri CIM per putaran; di Pentium N6000 itu
  memakan ~2,1 detik per putaran (selang nyata ~2 detik, putaran pertama 14
  detik) dan ikut membebani CPU yang sedang diukur.

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

  Catatan bahasa: nama kategori/penghitung PerformanceCounter ikut bahasa
  tampilan Windows. Skrip ini ditulis untuk Windows berbahasa Inggris
  (kasus Moona). Kalau ada penghitung yang gagal dibuat, kolomnya dikosongkan
  dan peringatan ditampilkan di awal.

  Hanya membaca; tidak mengubah pengaturan sistem. Dijalankan di Windows
  PowerShell 5.1 bawaan Windows 10/11.

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

function New-Pc($cat, $name, $inst) {
  try {
    if ($inst) { return New-Object System.Diagnostics.PerformanceCounter($cat, $name, $inst, $true) }
    return New-Object System.Diagnostics.PerformanceCounter($cat, $name, $true)
  } catch {
    Write-Warning "Penghitung gagal dibuat: $cat \ $name $inst -> kolom dikosongkan"
    return $null
  }
}

function Read-Pc($c) {
  if ($null -eq $c) { return $null }
  try { return $c.NextValue() } catch { return $null }
}

$totalMB = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1MB)

# --- buat semua penghitung SEKALI ---
$pcCpu   = New-Pc 'Processor'             '% Processor Time'        '_Total'
$pcPerf  = New-Pc 'Processor Information' '% Processor Performance' '_Total'
$pcAvail = New-Pc 'Memory'                'Available MBytes'        $null
$pcTcp   = New-Pc 'TCPv4'                 'Connections Established' $null

$nicRx = @(); $nicTx = @()
try {
  $inst = (New-Object System.Diagnostics.PerformanceCounterCategory('Network Interface')).GetInstanceNames()
  foreach ($i in $inst) {
    $r = New-Pc 'Network Interface' 'Bytes Received/sec' $i
    $s = New-Pc 'Network Interface' 'Bytes Sent/sec'     $i
    if ($r) { $nicRx += $r }
    if ($s) { $nicTx += $s }
  }
} catch {
  Write-Warning "Kategori Network Interface gagal dibaca -> kolom net_* dikosongkan"
}

# --- pengukuran beban skrip sendiri ---
$proc  = [Diagnostics.Process]::GetCurrentProcess()
$cores = [Environment]::ProcessorCount

# --- berkas keluaran (tetap terbuka, tiap baris langsung ditulis ke disk) ---
$writer = New-Object System.IO.StreamWriter($Out, $false, [Text.Encoding]::ASCII)
$writer.AutoFlush = $true
$writer.WriteLine("epoch,iso_utc,cpu_pct,cpu_perf_pct,mem_avail_mb,mem_used_mb,node_ws_mb,net_rx_mbps,net_tx_mbps,tcp_established,node_top_core_pct,node_top_port,node_sum_core_pct,monitor_cpu_pct")

Write-Host "Monitoring dimulai. Berkas : $Out"
Write-Host "RAM total   : $totalMB MB     Selang: $IntervalSec detik     Adapter jaringan: $($nicRx.Count)"
Write-Host "Hentikan dengan Ctrl+C."

# --- pemanasan: penghitung bertipe laju selalu 0 pada pembacaan pertama ---
$null = Read-Pc $pcCpu; $null = Read-Pc $pcPerf; $null = Read-Pc $pcAvail; $null = Read-Pc $pcTcp
foreach ($c in $nicRx) { $null = Read-Pc $c }
foreach ($c in $nicTx) { $null = Read-Pc $c }

# peta PID node -> port yang didengarkan (dibuat sekali; node tidak berganti PID selama tes)
$portOf = @{}
try {
  Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPort -in 3000,4000,5000 } |
    ForEach-Object { $portOf[[int]$_.OwningProcess] = $_.LocalPort }
} catch { Write-Warning "Peta PID->port gagal dibuat; node_top_port dikosongkan" }
foreach ($k in $portOf.Keys) { Write-Host "  node PID $k -> port $($portOf[$k])" }
$lastProcCpu = @{}
foreach ($p in (Get-Process node -ErrorAction SilentlyContinue)) {
  try { $lastProcCpu[$p.Id] = $p.TotalProcessorTime.TotalMilliseconds } catch {}
}

$sw = [Diagnostics.Stopwatch]::StartNew()
$proc.Refresh()
$lastCpu = $proc.TotalProcessorTime
$lastT   = $sw.ElapsedMilliseconds
$nextTick = $lastT
$n = 0

try {
  while ($true) {
    $nextTick += [int]($IntervalSec * 1000)
    $wait = [int]($nextTick - $sw.ElapsedMilliseconds)
    if ($wait -gt 0) { Start-Sleep -Milliseconds $wait }

    $now = [DateTimeOffset]::UtcNow

    $cpu   = Read-Pc $pcCpu
    $perf  = Read-Pc $pcPerf
    $avail = Read-Pc $pcAvail
    $tcp   = Read-Pc $pcTcp

    $rx = $null; $tx = $null
    if ($nicRx.Count -gt 0) {
      $sum = 0.0; foreach ($c in $nicRx) { $v = Read-Pc $c; if ($null -ne $v) { $sum += $v } }
      $rx = $sum * 8 / 1e6
    }
    if ($nicTx.Count -gt 0) {
      $sum = 0.0; foreach ($c in $nicTx) { $v = Read-Pc $c; if ($null -ne $v) { $sum += $v } }
      $tx = $sum * 8 / 1e6
    }

    $nodes = @(Get-Process node -ErrorAction SilentlyContinue)
    $ws = ($nodes | Measure-Object WorkingSet64 -Sum).Sum
    if ($null -eq $ws) { $ws = 0 }

    # CPU per proses node: selisih TotalProcessorTime / selang nyata (100 = satu inti penuh)
    $dtMs = $sw.ElapsedMilliseconds - $lastT
    $topPct = 0.0; $topPid = $null; $sumPct = 0.0
    foreach ($p in $nodes) {
      try {
        $t = $p.TotalProcessorTime.TotalMilliseconds
        if ($lastProcCpu.ContainsKey($p.Id) -and $dtMs -gt 0) {
          $pct = (($t - $lastProcCpu[$p.Id]) / $dtMs) * 100
          $sumPct += $pct
          if ($pct -gt $topPct) { $topPct = $pct; $topPid = $p.Id }
        }
        $lastProcCpu[$p.Id] = $t
      } catch {}
    }
    $topPort = ''
    if ($null -ne $topPid -and $portOf.ContainsKey([int]$topPid)) { $topPort = $portOf[[int]$topPid] }
    $nodeMB = $ws / 1MB

    $used = $null
    if ($null -ne $avail) { $used = $totalMB - $avail }

    # beban skrip sendiri sejak putaran sebelumnya
    $proc.Refresh()
    $cpuNow = $proc.TotalProcessorTime
    $tNow   = $sw.ElapsedMilliseconds
    $own = $null
    if ($tNow -gt $lastT) {
      $own = (($cpuNow - $lastCpu).TotalMilliseconds / (($tNow - $lastT) * $cores)) * 100
    }
    $lastCpu = $cpuNow; $lastT = $tNow

    $line = @(
      $now.ToUnixTimeSeconds(),
      $now.UtcDateTime.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      (Fmt $cpu '0'), (Fmt $perf '0'),
      (Fmt $avail '0'), (Fmt $used '0'), (Fmt $nodeMB '0.0'),
      (Fmt $rx '0.00'), (Fmt $tx '0.00'),
      (Fmt $tcp '0'),
      (Fmt $topPct '0'), $topPort, (Fmt $sumPct '0'),
      (Fmt $own '0.00')
    ) -join ','
    $writer.WriteLine($line)

    $n++
    if ($n % 30 -eq 0) {
      Write-Host ("{0}  cpu={1}%  ram_terpakai={2}MB  node={3}MB  rx={4}Mbps  tx={5}Mbps  tcp={6}  skrip={7}%  nodeTop={8}%@{9}" -f `
        $now.UtcDateTime.ToString('HH:mm:ss'), (Fmt $cpu '0'), (Fmt $used '0'), (Fmt $nodeMB '0'), (Fmt $rx '0.0'), (Fmt $tx '0.0'), (Fmt $tcp '0'), (Fmt $own '0.0'), (Fmt $topPct '0'), $topPort)
    }
  }
}
finally {
  $writer.Dispose()
  Write-Host "Monitoring dihentikan. $n baris tersimpan di $Out"
}
