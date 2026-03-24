<#
.SYNOPSIS
  Quick-save script for MotionCalc / RatioLab.
  Stages all changes and commits with a message you provide.

.USAGE
  From the project root, run:

    .\save.ps1                       # prompted for a message
    .\save.ps1 "fix belt ratio bug"  # message inline
    .\save.ps1 -WhatIf               # preview what would be committed
#>

param(
    [Parameter(Position = 0)]
    [string]$Message,

    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot

try {
    $status = git status --porcelain
    if (-not $status) {
        Write-Host "`n  Nothing to save -- working tree is clean.`n" -ForegroundColor Green
        return
    }

    Write-Host "`n  Changed files:" -ForegroundColor Cyan
    $status | ForEach-Object { Write-Host "    $_" }

    if ($WhatIf) {
        Write-Host "`n  [WhatIf] No commit created.`n" -ForegroundColor Yellow
        return
    }

    if (-not $Message) {
        Write-Host ""
        $Message = Read-Host "  Commit message"
        if (-not $Message) {
            Write-Host "  Aborted -- no message provided.`n" -ForegroundColor Yellow
            return
        }
    }

    git add -A
    git commit -m $Message

    Write-Host "`n  Saved!`n" -ForegroundColor Green
    git log --oneline -5
    Write-Host ""
}
finally {
    Pop-Location
}
