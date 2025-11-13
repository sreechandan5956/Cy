@echo off
echo Starting CyTutor Application...
echo.

REM Check if .env exists
if not exist backend\.env (
    echo .env file not found. Creating from .env.example...
    copy backend\.env.example backend\.env
    echo Please edit backend\.env with your configuration
    echo.
)

REM Check if node_modules exists
if not exist backend\node_modules (
    echo Installing dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

REM Start the server
echo Starting server on http://localhost:5000
echo Frontend will be available at http://localhost:5000
echo.
cd backend
call npm start
