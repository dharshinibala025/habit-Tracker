@echo off
echo ========================================
echo   Habit Tracker - Starting Application
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "Habit Tracker Backend" cmd /k "cd /d %~dp0server && npm start"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Development Server...
start "Habit Tracker Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: Check the Frontend terminal for the URL
echo.
echo Press any key to exit this window...
pause > nul
