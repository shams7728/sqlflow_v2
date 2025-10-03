@echo off
cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   SQLFlow Quick Clean                  ║
echo ╚════════════════════════════════════════╝
echo.

echo Stopping servers...
taskkill /F /IM node.exe 2>nul
timeout /t 1 /nobreak >nul

echo Cleaning frontend cache...
if exist frontend\build rmdir /s /q frontend\build 2>nul
if exist frontend\node_modules\.cache rmdir /s /q frontend\node_modules\.cache 2>nul
if exist frontend\.cache rmdir /s /q frontend\.cache 2>nul

echo Cleaning backend cache...
if exist backend\node_modules\.cache rmdir /s /q backend\node_modules\.cache 2>nul

echo.
echo ✅ Project cleaned!
echo.
echo 📌 Next steps:
echo    1. Clear browser cache: Ctrl+Shift+Delete
echo    2. Or use Incognito mode: Ctrl+Shift+N
echo    3. Run: npm start in backend folder
echo    4. Run: npm start in frontend folder
echo.
pause
