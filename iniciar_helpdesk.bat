@echo off
echo Iniciando HelpDesk Web...

start "Backend HelpDesk" cmd /k "C:\helpdesk\2026_PROYECTO_WEB\backend\venv\Scripts\activate.bat && cd C:\helpdesk\2026_PROYECTO_WEB\backend && uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 3

start "Frontend HelpDesk" cmd /k "cd C:\helpdesk\2026_PROYECTO_WEB\frontend && npx serve www -s -p 8080"

echo.
echo ================================
echo    HelpDesk Web iniciado!
echo ================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:8080
echo Celular:  http://192.168.1.12:8080
echo ================================
pause