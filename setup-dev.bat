@echo off
echo ========================================
echo CyTutor Development Setup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo [OK] npm version:
npm --version
echo.

REM Navigate to backend
cd backend

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo [WARNING] IMPORTANT: Edit backend\.env with your configuration:
    echo    - JWT_SECRET (generate a secure random string^)
    echo    - Database credentials (if using PostgreSQL^)
    echo    - Email SMTP settings (for welcome emails^)
    echo.
) else (
    echo [OK] .env file already exists
    echo.
)

REM Install dependencies
echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo [OK] Dependencies installed successfully
) else (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

cd ..

REM Create necessary directories
echo.
echo Creating required directories...

if not exist UI\uploads\avatars mkdir UI\uploads\avatars
if not exist UI\uploads\challenges mkdir UI\uploads\challenges
if not exist logs mkdir logs

echo [OK] Directories created
echo.

REM Create .gitignore for uploads
if not exist UI\uploads\.gitignore (
    echo * > UI\uploads\.gitignore
    echo !.gitignore >> UI\uploads\.gitignore
    echo [OK] Created .gitignore for uploads
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Run 'start.bat' to start the server
echo 3. Open http://localhost:5000 in your browser
echo.
echo For development with auto-reload:
echo    cd backend
echo    npm run dev
echo.
pause
