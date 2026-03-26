param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("react", "next")]
  [string]$Project,

  [string]$HostUrl = "http://localhost:9000",

  [string]$ScannerPath = "sonar-scanner",

  [string]$Token = $env:SONAR_TOKEN,

  [switch]$RunLint,

  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projects = @{
  react = @{
    Directory = "react-ecommerce"
    DisplayName = "React CSR"
  }
  next = @{
    Directory = "nextjs-ecommerce"
    DisplayName = "Next.js SSR/SSG"
  }
}

$rootDir = Split-Path $PSScriptRoot -Parent
$projectConfig = $projects[$Project]
$projectDir = Join-Path $rootDir $projectConfig.Directory

$scannerCommand = Get-Command $ScannerPath -ErrorAction SilentlyContinue
if (-not $scannerCommand -and -not $DryRun) {
  throw "Command '$ScannerPath' was not found. Install SonarScanner CLI or pass -ScannerPath explicitly."
}

$scannerArgs = @("-Dsonar.host.url=$HostUrl")
if ($Token) {
  $scannerArgs += "-Dsonar.token=$Token"
}

Write-Host ("[SonarQube] Target: {0}" -f $projectConfig.DisplayName)
Write-Host ("[SonarQube] Directory: {0}" -f $projectDir)
Write-Host ("[SonarQube] Host: {0}" -f $HostUrl)

if ($RunLint) {
  Write-Host "[SonarQube] Running lint before scan..."

  Push-Location $projectDir
  try {
    & pnpm lint
    if ($LASTEXITCODE -ne 0) {
      throw "Lint failed with exit code $LASTEXITCODE."
    }
  } finally {
    Pop-Location
  }
}

if ($DryRun) {
  Write-Host ("cd `"{0}`"" -f $projectDir)
  Write-Host ($ScannerPath + " " + ($scannerArgs -join " "))
  exit 0
}

Push-Location $projectDir
try {
  & $scannerCommand.Source @scannerArgs
  if ($LASTEXITCODE -ne 0) {
    throw "SonarScanner failed with exit code $LASTEXITCODE."
  }
} finally {
  Pop-Location
}

Write-Host "[SonarQube] Scan completed."
