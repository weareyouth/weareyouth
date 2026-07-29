@echo off
title Git Push Automation
color 0B
echo ===================================================
echo            NGO WEBSITE GIT PUSH UTILITY
echo ===================================================
echo.

:: Pehle dekho git ka status — kaunse files changed hain
echo [1/4] Checking repository status...
git status
echo.

echo ===================================================
set /p proceed="Do you want to stage and commit all changes? (Y/N): "
if /i "%proceed%" neq "y" (
    echo Operation cancelled by user.
    pause
    exit /b
)

echo.
echo [2/4] Staging all files...
git add .
echo.

:: User se commit message maango — agar kuch type na kare toh default message use hoga
set "commit_msg=Update email error alerts and custom admin confirmation modal"
echo Enter your commit message below (or press Enter to use default: "%commit_msg%")
set /p input_msg="Message: "
if not "%input_msg%"=="" set "commit_msg=%input_msg%"

echo.
echo [3/4] Committing changes...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo.
    color 0C
    echo ERROR: Commit failed. Check if you have changes to commit.
    pause
    exit /b
)

echo.
echo [4/4] Pushing to GitHub (origin main)...
git push origin main
if %errorlevel% neq 0 (
    echo.
    color 0C
    echo ERROR: Failed to push to remote repository. Check internet connection or credentials.
    pause
    exit /b
)

echo.
color 0A
echo ===================================================
echo SUCCESS: Changes have been pushed to GitHub!
echo Your Vercel build should start automatically shortly.
echo ===================================================
pause
