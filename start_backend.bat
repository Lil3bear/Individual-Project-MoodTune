@echo off
chcp 65001 >nul
echo ========================================
echo 启动 MoodTune Flask 后端服务器
echo ========================================
echo.
echo 服务器将在 http://localhost:5000 启动
echo 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

python server.py

pause

