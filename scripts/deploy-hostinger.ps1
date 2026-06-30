param(
  [string]$Host = $env:HOSTINGER_SSH_HOST,
  [string]$User = $env:HOSTINGER_SSH_USER,
  [string]$RemotePath = $env:HOSTINGER_SSH_PATH,
  [string]$LocalBuild = "dist"
)

if (-not $Host -or -not $User -or -not $RemotePath) {
  Write-Error "Usage: .\deploy-hostinger.ps1 -Host <host> -User <user> -RemotePath <remotePath> [-LocalBuild <localBuild>]."
  exit 1
}

Write-Host "Building Vite app..."
npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Error "Build failed."
  exit $LASTEXITCODE
}

Write-Host "Deploying $LocalBuild to $User@$Host:$RemotePath"
$buildPath = Join-Path (Get-Location) $LocalBuild
if (-not (Test-Path $buildPath)) {
  Write-Error "Build folder '$LocalBuild' not found."
  exit 1
}

$scpCommand = Get-Command scp -ErrorAction SilentlyContinue
$pscpCommand = Get-Command pscp -ErrorAction SilentlyContinue

if ($scpCommand) {
  Write-Host "Using scp to upload files."
  $source = Join-Path $buildPath '*'
  & scp -r "$source" "$User@$Host:$RemotePath"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "scp upload failed."
    exit $LASTEXITCODE
  }
} elseif ($pscpCommand) {
  if (-not $env:HOSTINGER_SSH_PASSWORD) {
    Write-Error "pscp is available but HOSTINGER_SSH_PASSWORD is not set in environment variables."
    exit 1
  }
  Write-Host "Using pscp to upload files."
  & pscp -r -pw $env:HOSTINGER_SSH_PASSWORD "$buildPath\*" "$User@$Host:$RemotePath"
  if ($LASTEXITCODE -ne 0) {
    Write-Error "pscp upload failed."
    exit $LASTEXITCODE
  }
} else {
  Write-Error "Neither scp nor pscp was found in PATH. Install OpenSSH or PuTTY."
  exit 1
}

Write-Host "Deployment complete."
