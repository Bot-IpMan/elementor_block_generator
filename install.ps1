# PowerShell Installation Script for Elementor Block Generator
# This script handles the installation process for Windows users
# Including checking Node.js, installing pnpm, and setting up the project
# Created: 2025-12-12 20:54:13 UTC

# Set error action preference
$ErrorActionPreference = "Stop"

# Define colors for output
$colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
}

function Write-Status {
    param(
        [string]$Message,
        [string]$Status = "Info"
    )
    $color = $colors[$Status]
    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Check-NodeJs {
    Write-Status "Checking for Node.js installation..." "Info"
    
    try {
        $nodeVersion = node --version 2>$null
        if ($null -eq $nodeVersion) {
            Write-Status "Node.js is not installed." "Error"
            return $false
        }
        Write-Status "Node.js found: $nodeVersion" "Success"
        return $true
    }
    catch {
        Write-Status "Node.js is not installed." "Error"
        return $false
    }
}

function Install-NodeJs {
    Write-Status "Node.js installation required." "Warning"
    Write-Host ""
    Write-Host "Please download and install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Recommended: Download the LTS (Long Term Support) version" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, please run this script again." -ForegroundColor Yellow
    Write-Host ""
    
    $response = Read-Host "Would you like to open the Node.js download page in your browser? (Y/n)"
    if ($response -ne "n" -and $response -ne "N") {
        Start-Process "https://nodejs.org/"
    }
    
    exit 1
}

function Check-Pnpm {
    Write-Status "Checking for pnpm installation..." "Info"
    
    try {
        $pnpmVersion = pnpm --version 2>$null
        if ($null -eq $pnpmVersion) {
            Write-Status "pnpm is not installed." "Warning"
            return $false
        }
        Write-Status "pnpm found: v$pnpmVersion" "Success"
        return $true
    }
    catch {
        Write-Status "pnpm is not installed." "Warning"
        return $false
    }
}

function Install-Pnpm {
    Write-Status "Installing pnpm..." "Info"
    
    try {
        npm install -g pnpm
        $pnpmVersion = pnpm --version
        Write-Status "pnpm successfully installed: v$pnpmVersion" "Success"
        return $true
    }
    catch {
        Write-Status "Failed to install pnpm: $_" "Error"
        return $false
    }
}

function Setup-Project {
    Write-Status "Setting up project dependencies..." "Info"
    
    try {
        Write-Status "Installing project dependencies with pnpm..." "Info"
        pnpm install
        
        Write-Status "Project dependencies installed successfully." "Success"
        return $true
    }
    catch {
        Write-Status "Failed to install project dependencies: $_" "Error"
        return $false
    }
}

function Show-SystemInfo {
    Write-Status "System Information:" "Info"
    Write-Host "PowerShell Version: $($PSVersionTable.PSVersion.Major).$($PSVersionTable.PSVersion.Minor)" -ForegroundColor Gray
    Write-Host "OS: $([System.Environment]::OSVersion.VersionString)" -ForegroundColor Gray
}

# Main execution
function Main {
    Clear-Host
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║   Elementor Block Generator - Windows Installation Script   ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    Show-SystemInfo
    Write-Host ""
    
    # Check for administrator privileges (optional warning)
    if (-not (Test-Administrator)) {
        Write-Status "Running without administrator privileges. Some operations may require elevation." "Warning"
        Write-Host ""
    }
    
    # Step 1: Check Node.js
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Step 1: Checking Node.js" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    if (-not (Check-NodeJs)) {
        Install-NodeJs
    }
    
    Write-Host ""
    
    # Step 2: Check and install pnpm
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Step 2: Checking pnpm" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    if (-not (Check-Pnpm)) {
        Write-Host ""
        if (-not (Install-Pnpm)) {
            Write-Status "Installation aborted due to pnpm installation failure." "Error"
            exit 1
        }
    }
    
    Write-Host ""
    
    # Step 3: Setup project
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "Step 3: Setting up project" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    if (-not (Setup-Project)) {
        Write-Status "Installation aborted due to project setup failure." "Error"
        exit 1
    }
    
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║   Installation completed successfully!                      ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review the README.md for project documentation" -ForegroundColor Gray
    Write-Host "2. Start development with: pnpm dev" -ForegroundColor Gray
    Write-Host "3. Build the project with: pnpm build" -ForegroundColor Gray
    Write-Host ""
}

# Execute main function
Main
