@echo off
echo Stopping nginx...
taskkill /f /im nginx.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting nginx...
cd /d "C:\nginx"
start nginx.exe

echo Nginx restarted successfully!
pause 