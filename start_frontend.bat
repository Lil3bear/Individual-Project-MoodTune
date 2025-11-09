@echo off
chcp 65001 >nul
echo ========================================
echo 启动 MoodTune 前端服务器
echo ========================================
echo.
echo 服务器将在 http://localhost:8000 启动
echo 在浏览器中打开该地址查看应用
echo 按 Ctrl+C 停止服务器
echo.
echo ========================================
echo.

python -m http.server 8000

pause

