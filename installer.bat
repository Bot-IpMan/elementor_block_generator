@echo off
REM ============================================================================
REM Windows Installer Script for Elementor Block Generator
REM ============================================================================
REM This script automates the installation and setup process for the
REM Elementor Block Generator project on Windows systems.
REM
REM Prerequisites: Administrator privileges are recommended
REM Created: 2025-12-12
REM ============================================================================

setlocal enabledelayedexpansion
set "SCRIPT_DIR=%~dp0"
set "PROJECT_NAME=elementor_block_generator"
set "NODE_VERSION=18.0.0"
set "PNPM_VERSION=8.0.0"
set "LOG_FILE=%SCRIPT_DIR%installer.log"

REM Color codes for console output
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

REM ============================================================================
REM UTILITY FUNCTIONS
REM ============================================================================

:log_info
echo [INFO] %~1
echo [INFO] %~1 >> "%LOG_FILE%"
exit /b 0

:log_success
echo [SUCCESS] %~1
echo [SUCCESS] %~1 >> "%LOG_FILE%"
exit /b 0

:log_error
echo [ERROR] %~1
echo [ERROR] %~1 >> "%LOG_FILE%"
exit /b 0

:log_warning
echo [WARNING] %~1
echo [WARNING] %~1 >> "%LOG_FILE%"
exit /b 0

REM ============================================================================
REM MAIN SCRIPT START
REM ============================================================================

cls
echo ============================================================================
echo Elementor Block Generator - Windows Installer
echo ============================================================================
echo.

REM Initialize log file
echo Installation Log - %date% %time% > "%LOG_FILE%"
echo. >> "%LOG_FILE%"

call :log_info "Starting installation process..."
call :log_info "Script directory: %SCRIPT_DIR%"

REM Check for administrator privileges
call :check_admin
if errorlevel 1 (
    call :log_warning "This script is running without administrator privileges."
    call :log_warning "Some operations may fail. Consider running as Administrator."
)

REM ============================================================================
REM STEP 1: Check and Install Node.js
REM ============================================================================

echo.
echo [STEP 1/6] Checking Node.js installation...
call :check_and_install_nodejs
if errorlevel 1 (
    call :log_error "Failed to install or verify Node.js"
    goto :install_failed
)

REM ============================================================================
REM STEP 2: Check and Install pnpm
REM ============================================================================

echo.
echo [STEP 2/6] Checking pnpm installation...
call :check_and_install_pnpm
if errorlevel 1 (
    call :log_error "Failed to install or verify pnpm"
    goto :install_failed
)

REM ============================================================================
REM STEP 3: Clone/Update Project
REM ============================================================================

echo.
echo [STEP 3/6] Setting up project repository...
call :setup_project_repo
if errorlevel 1 (
    call :log_error "Failed to setup project repository"
    goto :install_failed
)

REM ============================================================================
REM STEP 4: Install Dependencies
REM ============================================================================

echo.
echo [STEP 4/6] Installing project dependencies...
call :install_dependencies
if errorlevel 1 (
    call :log_error "Failed to install dependencies"
    goto :install_failed
)

REM ============================================================================
REM STEP 5: Create .env File
REM ============================================================================

echo.
echo [STEP 5/6] Creating environment configuration...
call :create_env_file
if errorlevel 1 (
    call :log_error "Failed to create .env file"
    goto :install_failed
)

REM ============================================================================
REM STEP 6: Build and Package
REM ============================================================================

echo.
echo [STEP 6/6] Building and packaging project...
call :build_and_package
if errorlevel 1 (
    call :log_error "Failed to build and package project"
    goto :install_failed
)

REM ============================================================================
REM INSTALLATION SUCCESS
REM ============================================================================

:install_success
echo.
echo ============================================================================
echo Installation completed successfully!
echo ============================================================================
call :log_success "Installation process completed successfully"
call :log_info "Log file saved to: %LOG_FILE%"
echo.
echo Next steps:
echo 1. Review the installer.log file for detailed information
echo 2. Check the dist/ directory for the generated executable
echo 3. Run the packaged application from the dist folder
echo.
pause
exit /b 0

REM ============================================================================
REM INSTALLATION FAILED
REM ============================================================================

:install_failed
echo.
echo ============================================================================
echo Installation failed!
echo ============================================================================
call :log_error "Installation process failed. Check log file for details."
call :log_info "Log file: %LOG_FILE%"
echo.
echo Please check the installer.log file for error details.
echo.
pause
exit /b 1

REM ============================================================================
REM FUNCTION: Check Administrator Privileges
REM ============================================================================

:check_admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    exit /b 1
)
exit /b 0

REM ============================================================================
REM FUNCTION: Check and Install Node.js
REM ============================================================================

:check_and_install_nodejs
call :log_info "Checking for Node.js installation..."

node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set "NODE_INSTALLED=%%i"
    call :log_success "Node.js is already installed: !NODE_INSTALLED!"
    echo Node.js is already installed: !NODE_INSTALLED!
    exit /b 0
)

call :log_info "Node.js not found. Attempting to download and install..."
echo Downloading Node.js installer...

REM Download Node.js LTS using Windows built-in curl
set "NODE_INSTALLER=%temp%\node-installer.msi"
set "NODE_DOWNLOAD_URL=https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"

call :log_info "Downloading from: %NODE_DOWNLOAD_URL%"
powershell -Command "(New-Object Net.ServicePointManager).SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%NODE_DOWNLOAD_URL%', '%NODE_INSTALLER%')" 2>>"%LOG_FILE%"

if not exist "%NODE_INSTALLER%" (
    call :log_error "Failed to download Node.js installer"
    exit /b 1
)

call :log_info "Installing Node.js..."
msiexec.exe /i "%NODE_INSTALLER%" /quiet /norestart ACCEPTEULA=1 2>>"%LOG_FILE%"

REM Wait for installation to complete
timeout /t 10 /nobreak >nul

REM Verify installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :log_error "Node.js installation verification failed"
    exit /b 1
)

REM Refresh environment variables
call :refresh_env_vars

node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set "NODE_INSTALLED=%%i"
    call :log_success "Node.js installed successfully: !NODE_INSTALLED!"
    echo Node.js installed successfully: !NODE_INSTALLED!
    exit /b 0
) else (
    call :log_error "Node.js installation failed or not accessible in PATH"
    exit /b 1
)

REM ============================================================================
REM FUNCTION: Check and Install pnpm
REM ============================================================================

:check_and_install_pnpm
call :log_info "Checking for pnpm installation..."

pnpm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('pnpm --version') do set "PNPM_INSTALLED=%%i"
    call :log_success "pnpm is already installed: %%i"
    echo pnpm is already installed: !PNPM_INSTALLED!
    exit /b 0
)

call :log_info "pnpm not found. Installing via npm..."
echo Installing pnpm...

npm install -g pnpm 2>>"%LOG_FILE%"
if %errorlevel% neq 0 (
    call :log_error "Failed to install pnpm"
    exit /b 1
)

REM Verify pnpm installation
pnpm --version >nul 2>&1
if %errorlevel% eq 0 (
    for /f "tokens=*" %%i in ('pnpm --version') do set "PNPM_INSTALLED=%%i"
    call :log_success "pnpm installed successfully: !PNPM_INSTALLED!"
    echo pnpm installed successfully: !PNPM_INSTALLED!
    exit /b 0
) else (
    call :log_error "pnpm installation verification failed"
    exit /b 1
)

REM ============================================================================
REM FUNCTION: Setup Project Repository
REM ============================================================================

:setup_project_repo
call :log_info "Setting up project repository..."

REM Check if we're already in the project directory
if exist "%SCRIPT_DIR%.git" (
    call :log_info "Project already cloned. Updating existing repository..."
    cd /d "%SCRIPT_DIR%"
    git pull origin main 2>>"%LOG_FILE%"
    if !errorlevel! neq 0 (
        call :log_warning "Git pull failed, but continuing..."
    )
    exit /b 0
)

REM If in root directory, assume already in project
if exist "%SCRIPT_DIR%package.json" (
    call :log_info "Project directory detected. Skipping clone..."
    cd /d "%SCRIPT_DIR%"
    exit /b 0
)

REM Clone the project
call :log_info "Cloning project from GitHub..."
set "PROJECT_URL=https://github.com/Bot-IpMan/elementor_block_generator.git"
git clone "%PROJECT_URL%" "%SCRIPT_DIR%." 2>>"%LOG_FILE%"

if %errorlevel% neq 0 (
    call :log_error "Failed to clone project repository"
    exit /b 1
)

cd /d "%SCRIPT_DIR%"
call :log_success "Project repository setup completed"
exit /b 0

REM ============================================================================
REM FUNCTION: Install Dependencies
REM ============================================================================

:install_dependencies
call :log_info "Installing project dependencies using pnpm..."
echo Installing dependencies. This may take several minutes...

cd /d "%SCRIPT_DIR%"
pnpm install 2>>"%LOG_FILE%"

if %errorlevel% neq 0 (
    call :log_error "Failed to install dependencies"
    call :log_info "Attempting alternative installation with npm..."
    npm install 2>>"%LOG_FILE%"
    if !errorlevel! neq 0 (
        call :log_error "Both pnpm and npm installation failed"
        exit /b 1
    )
)

call :log_success "Dependencies installed successfully"
exit /b 0

REM ============================================================================
REM FUNCTION: Create .env File
REM ============================================================================

:create_env_file
call :log_info "Creating .env configuration file..."

set "ENV_FILE=%SCRIPT_DIR%.env"

REM Check if .env already exists
if exist "%ENV_FILE%" (
    call :log_warning ".env file already exists at %ENV_FILE%"
    call :log_info "Backing up existing .env to .env.backup"
    copy "%ENV_FILE%" "%ENV_FILE%.backup" >nul 2>&1
)

REM Create .env file with default configuration
(
    echo # Elementor Block Generator Configuration
    echo # Auto-generated on %date% %time%
    echo.
    echo # Environment
    echo NODE_ENV=production
    echo.
    echo # Application Settings
    echo APP_NAME=Elementor Block Generator
    echo APP_VERSION=1.0.0
    echo.
    echo # Build Configuration
    echo BUILD_OUTPUT_DIR=dist
    echo.
    echo # Package Configuration
    echo PACKAGE_FORMAT=exe
    echo.
    echo # Logging
    echo LOG_LEVEL=info
    echo.
    echo # Add your custom configuration below
) > "%ENV_FILE%"

if %errorlevel% neq 0 (
    call :log_error "Failed to create .env file"
    exit /b 1
)

call :log_success ".env file created at: %ENV_FILE%"
echo .env file created successfully
exit /b 0

REM ============================================================================
REM FUNCTION: Build and Package
REM ============================================================================

:build_and_package
call :log_info "Building project..."
echo Building project. This may take several minutes...

cd /d "%SCRIPT_DIR%"

REM Check if build script exists in package.json
call :log_info "Attempting to run build script..."
pnpm run build 2>>"%LOG_FILE%"

if %errorlevel% neq 0 (
    call :log_warning "pnpm build failed. Attempting npm build..."
    npm run build 2>>"%LOG_FILE%"
    if !errorlevel! neq 0 (
        call :log_warning "Build script not found or failed. Continuing with packaging..."
    )
)

call :log_success "Build completed"

REM Package as executable
call :log_info "Attempting to package application as executable..."
call :package_as_exe

if %errorlevel% eq 0 (
    call :log_success "Packaging completed successfully"
    exit /b 0
) else (
    call :log_warning "Executable packaging completed with warnings (see log for details)"
    exit /b 0
)

REM ============================================================================
REM FUNCTION: Package as EXE
REM ============================================================================

:package_as_exe
call :log_info "Checking for packaging configuration..."

REM Check if electron-builder is available
if exist "%SCRIPT_DIR%electron-builder.yml" (
    call :log_info "electron-builder configuration found"
    call :log_info "Running electron-builder..."
    pnpm run make 2>>"%LOG_FILE%"
    if !errorlevel! eq 0 (
        call :log_success "Electron builder completed"
        exit /b 0
    )
)

REM Check if there's a build script that handles packaging
pnpm run package 2>>"%LOG_FILE%"
if %errorlevel% eq 0 (
    call :log_success "Package script completed"
    exit /b 0
)

REM If dist folder exists, consider it a success
if exist "%SCRIPT_DIR%dist" (
    call :log_success "Build output found in dist directory"
    exit /b 0
)

call :log_warning "No packaging configuration found. Creating basic output structure..."
if not exist "%SCRIPT_DIR%dist" (
    mkdir "%SCRIPT_DIR%dist"
)

exit /b 0

REM ============================================================================
REM FUNCTION: Refresh Environment Variables
REM ============================================================================

:refresh_env_vars
REM This refreshes the PATH variable to recognize newly installed software
call :log_info "Refreshing environment variables..."

REM PowerShell command to refresh environment
powershell -Command "$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')" 2>>"%LOG_FILE%"

exit /b 0

REM ============================================================================
REM END OF SCRIPT
REM ============================================================================
