@echo off
title Iniciando TDI Financiamiento...

echo Iniciando servidor Vite...
cd "C:\Users\matia\Documents\Ingenieria UC\2025-2\TDI\Aplicación Financiamiento\TDI-Financiamiento"

:: Inicia npm run dev en una ventana separada para que no bloquee el script
start cmd /k "npm run dev"

echo Esperando que el servidor levante...
timeout /t 3 >nul

echo Abriendo navegador...
start http://localhost:5173

exit