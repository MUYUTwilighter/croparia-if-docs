@echo off
mkdir webp
for %%i in (*.png) do (
  echo Converting %%i ...
  cwebp.exe "%%i" -q 80 -o "webp\%%~ni.webp"
)
echo Done!
pause
