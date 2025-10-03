@echo off
echo.
echo Checking for sensitive files before Git push...
echo.

REM Check for .env files
echo Checking for .env files...
git ls-files | findstr /C:".env" >nul 2>&1
if %errorlevel% equ 0 (
    echo [ERROR] .env files found in git!
    git ls-files | findstr /C:".env"
    echo Run: git rm --cached [file]
    exit /b 1
) else (
    echo [OK] No .env files tracked
)

REM Check for node_modules
echo Checking for node_modules...
git ls-files | findstr /C:"node_modules" >nul 2>&1
if %errorlevel% equ 0 (
    echo [ERROR] node_modules found in git!
    echo Run: git rm -r --cached node_modules
    exit /b 1
) else (
    echo [OK] No node_modules tracked
)

REM Check for database files
echo Checking for database files...
git ls-files | findstr /C:".db" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Database files found
    git ls-files | findstr /C:".db"
)

echo.
echo [SUCCESS] All checks passed! Safe to push to GitHub.
echo.
echo Next steps:
echo   git add .
echo   git commit -m "Initial commit: SQL-Flow platform"
echo   git push origin main
echo.
pause
