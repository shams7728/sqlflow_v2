@echo off
echo ========================================
echo  Clean and Restart SQLFlow
echo ========================================
echo.

echo [1/5] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo    - Stopped all Node processes

echo [2/5] Cleaning frontend...
cd frontend
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist .cache rmdir /s /q .cache
echo    - Cleaned frontend cache

echo [3/5] Cleaning backend...
cd ..\backend
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo    - Cleaned backend cache

echo [4/5] Starting backend server...
cd ..\backend
start "SQLFlow Backend" cmd /k "npm start"
timeout /t 5 /nobreak >nul
echo    - Backend starting...

echo [5/5] Starting frontend server...
cd ..\frontend
start "SQLFlow Frontend" cmd /k "npm start"
echo    - Frontend starting...

echo.
echo ========================================
echo  Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo IMPORTANT: Clear your browser cache!
echo   1. Press Ctrl+Shift+Delete
echo   2. Select "Cached images and files"
echo   3. Click "Clear data"
echo   OR use Incognito mode (Ctrl+Shift+N)
echo.
echo Press any key to open browser...
pause >nul
start http://localhost:3000
