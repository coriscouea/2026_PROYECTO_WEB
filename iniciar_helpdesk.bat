@echo off
setlocal
set "PROJECT_DIR=%~dp0"

echo Iniciando HelpDesk Web...

start "Backend HelpDesk" cmd /k ""%PROJECT_DIR%backend\venv\Scripts\activate.bat" && cd /d "%PROJECT_DIR%backend" && uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 3

start "Frontend HelpDesk" cmd /k "cd /d "%PROJECT_DIR%frontend" && npx serve www -s -p 8081"

echo.
echo ================================
echo    HelpDesk Web iniciado!
echo ================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:8081
echo Celular:  http://192.168.1.12:8081
echo ================================
pause