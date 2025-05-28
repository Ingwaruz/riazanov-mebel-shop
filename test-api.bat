@echo off
echo Testing API...
echo.
echo 1. Testing localhost API:
curl -s http://localhost:5000/api/product | findstr "count"
echo.
echo 2. Testing production API:
curl -k -s https://domu-mebel.ru/api/product | findstr "count"
echo.
pause 