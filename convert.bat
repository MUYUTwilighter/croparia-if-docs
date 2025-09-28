@echo off
REM ==============================
REM PNG -> WebP 批量转换脚本
REM 用法: convert.bat relative_path
REM ==============================

if "%~1"=="" (
  echo Usage: %~nx0 relative_path
  echo Example: %~nx0 images
  pause
  exit /b 1
)

set "TARGET_DIR=%~1"

if not exist "%TARGET_DIR%" (
  echo Error: Dir "%TARGET_DIR%" not found
  pause
  exit /b 1
)

echo Converting PNG files in "%TARGET_DIR%" to WebP format...
for %%i in ("%TARGET_DIR%\*.png") do (
  echo Converting %%~nxi ...
  cwebp "%%i" -q 80 -o "%TARGET_DIR%\%%~ni.webp"
)

echo Done!
