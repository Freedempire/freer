param(
  [string]$Message = "Update site content"
)

$ErrorActionPreference = "Stop"

npm run build

git add .

$changed = git diff --cached --name-only
if (-not $changed) {
  Write-Host "No changes to publish."
  exit 0
}

git commit -m $Message
git push
