@echo off
cd /d "%~dp0"
echo =========================================
echo  Building NGO Website for Production
echo =========================================
echo.
echo Step 1: Installing dependencies (this may take a moment)...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies. Make sure Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Step 2: Compiling React/Vite app...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Build failed. Please check the logs above for errors.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =========================================
echo  SUCCESS!
echo =========================================
echo The production files have been created in the "dist" folder.
echo You can now manually upload the contents of the "dist" folder.
echo.
pause
