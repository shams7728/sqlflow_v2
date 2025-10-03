@echo off
echo ========================================
echo  Cleaning SQLFlow Project
echo ========================================
echo.

echo [1/4] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Cleaning frontend build files...
cd frontend
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .cache rmdir /s /q .cache
echo    - Removed build directory
echo    - Removed cache directories

echo [3/4] Cleaning backend cache...
cd ..\backend
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo    - Removed backend cache

echo [4/4] Cleaning browser storage data...
echo    - Please clear browser cache manually:
echo      Press Ctrl+Shift+Delete in your browser
echo      OR
echo      Open DevTools (F12) and right-click refresh button
echo      Select "Empty Cache and Hard Reload"

cd ..
echo.
echo ========================================
echo  Cleanup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Clear browser cache (Ctrl+Shift+Delete)
echo 2. Start backend:  cd backend  ^&  npm start
echo 3. Start frontend: cd frontend ^&  npm start
echo 4. Open browser in incognito mode for fresh start
echo.
pause
