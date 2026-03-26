param(
  [Parameter(Mandatory = $true)]
  [string]$Name,

  [Parameter(Mandatory = $true)]
  [string]$Url,

  [ValidateSet("mobile", "desktop")]
  [string]$Preset = "mobile",

  [int]$Runs = 5,

  [string]$OutputRoot = "..\\artifacts\\lighthouse",

  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-AbsolutePath([string]$basePath, [string]$relativePath) {
  return [System.IO.Path]::GetFullPath((Join-Path $basePath $relativePath))
}

function Get-Median([double[]]$values) {
  $items = @($values)

  if ($items.Count -eq 0) {
    return 0
  }

  $sorted = @($items | Sort-Object)
  $middle = [math]::Floor($sorted.Count / 2)

  if ($sorted.Count % 2 -eq 0) {
    return ($sorted[$middle - 1] + $sorted[$middle]) / 2
  }

  return $sorted[$middle]
}

function Get-Average([double[]]$values) {
  $items = @($values)

  if ($items.Count -eq 0) {
    return 0
  }

  return ($items | Measure-Object -Average).Average
}

$rootDir = Split-Path $PSScriptRoot -Parent
$outputDir = Get-AbsolutePath $PSScriptRoot $OutputRoot
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$resultDir = Join-Path $outputDir "$Name-$timestamp"

New-Item -ItemType Directory -Force -Path $resultDir | Out-Null

$lighthouseCommand = Get-Command lighthouse -ErrorAction SilentlyContinue
if (-not $lighthouseCommand) {
  throw "Command 'lighthouse' was not found. Install Lighthouse CLI first."
}

$commonArgs = @(
  "--only-categories=performance",
  "--output=json",
  "--quiet",
  "--chrome-flags=--headless --disable-gpu --no-sandbox"
)

if ($Preset -eq "desktop") {
  $commonArgs += "--preset=desktop"
}

if ($DryRun) {
  for ($run = 1; $run -le $Runs; $run++) {
    $jsonPath = Join-Path $resultDir ("run-{0:00}.json" -f $run)
    $previewArgs = @($Url) + $commonArgs + @("--output-path=$jsonPath")
    Write-Host ("lighthouse " + ($previewArgs -join " "))
  }
  exit 0
}

$rows = New-Object System.Collections.Generic.List[object]

for ($run = 1; $run -le $Runs; $run++) {
  $jsonPath = Join-Path $resultDir ("run-{0:00}.json" -f $run)
  $args = @($Url) + $commonArgs + @("--output-path=$jsonPath")

  Write-Host ("[Lighthouse] Run {0}/{1}: {2}" -f $run, $Runs, $Url)
  & $lighthouseCommand.Source @args

  if ($LASTEXITCODE -ne 0) {
    throw "Lighthouse failed on run $run with exit code $LASTEXITCODE."
  }

  $report = Get-Content $jsonPath -Raw | ConvertFrom-Json

  $rows.Add([pscustomobject]@{
      Run = $run
      Url = $report.finalUrl
      FetchTime = $report.fetchTime
      PerformanceScore = [math]::Round(($report.categories.performance.score * 100), 2)
      FCP_ms = [math]::Round($report.audits."first-contentful-paint".numericValue, 2)
      LCP_ms = [math]::Round($report.audits."largest-contentful-paint".numericValue, 2)
      CLS = [math]::Round($report.audits."cumulative-layout-shift".numericValue, 4)
      TBT_ms = [math]::Round($report.audits."total-blocking-time".numericValue, 2)
      SpeedIndex_ms = [math]::Round($report.audits."speed-index".numericValue, 2)
      TTI_ms = [math]::Round($report.audits.interactive.numericValue, 2)
    })
}

$csvPath = Join-Path $resultDir "summary-runs.csv"
$summaryPath = Join-Path $resultDir "summary.json"

$rows | Export-Csv -NoTypeInformation -Path $csvPath

$summary = [pscustomobject]@{
  name = $Name
  url = $Url
  preset = $Preset
  runs = $Runs
  generatedAt = (Get-Date).ToString("o")
  note = "Lighthouse navigation mode produces lab metrics. For strict Core Web Vitals, collect field LCP, CLS, and INP from deployed apps."
  metrics = [pscustomobject]@{
    performanceScore = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.PerformanceScore })), 2)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.PerformanceScore })), 2)
      unit = "score"
    }
    fcp = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.FCP_ms })), 2)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.FCP_ms })), 2)
      unit = "ms"
    }
    lcp = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.LCP_ms })), 2)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.LCP_ms })), 2)
      unit = "ms"
    }
    cls = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.CLS })), 4)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.CLS })), 4)
      unit = "score"
    }
    tbt = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.TBT_ms })), 2)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.TBT_ms })), 2)
      unit = "ms"
    }
    speedIndex = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.SpeedIndex_ms })), 2)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.SpeedIndex_ms })), 2)
      unit = "ms"
    }
    tti = [pscustomobject]@{
      average = [math]::Round((Get-Average ($rows | ForEach-Object { [double]$_.TTI_ms })), 2)
      median = [math]::Round((Get-Median ($rows | ForEach-Object { [double]$_.TTI_ms })), 2)
      unit = "ms"
    }
  }
}

$summary | ConvertTo-Json -Depth 8 | Set-Content -Path $summaryPath

Write-Host ""
Write-Host "Saved Lighthouse run files to: $resultDir"
Write-Host "Per-run CSV: $csvPath"
Write-Host "Summary JSON: $summaryPath"
