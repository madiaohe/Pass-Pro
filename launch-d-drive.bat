@echo off
chcp 65001 >nul
echo ==========================================
echo PassPro - 使用 D 盘存储数据
echo ==========================================
echo.

:: 设置数据存储位置为 D 盘
set PASSPRO_DATA_DIR=D:\PassProData

:: 创建数据目录（如果不存在）
if not exist "D:\PassProData" (
    echo 创建数据目录: D:\PassProData
    mkdir "D:\PassProData"
)

echo 数据将保存在: %PASSPRO_DATA_DIR%
echo.

:: 进入项目目录
cd /d "%~dp0"

:: 构建前端
echo 正在构建前端...
call npm run build

:: 启动 Electron
echo 正在启动 PassPro...
npx electron .

pause
