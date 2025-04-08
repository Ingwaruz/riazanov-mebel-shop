# Скрипт для автоматического деплоя приложения на сервер
# Запустите от имени администратора

# Остановка предыдущих процессов (если они запущены)
Write-Host "Остановка предыдущих процессов..."
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Обновление кода из репозитория
Write-Host "Обновление кода из репозитория..."
git pull

# Установка зависимостей сервера
Write-Host "Установка зависимостей сервера..."
cd server
npm install
cd ..

# Установка зависимостей клиента
Write-Host "Установка зависимостей клиента..."
cd client
npm install

# Сборка клиентской части
Write-Host "Сборка клиентской части..."
npm run build
cd ..

# Перезапуск Nginx
Write-Host "Перезапуск Nginx..."
Start-Process -FilePath "C:\tools\nginx\nginx.exe" -ArgumentList "-s reload" -WorkingDirectory "C:\tools\nginx"

# Запуск сервера в фоновом режиме
Write-Host "Запуск сервера..."
Start-Process -FilePath "cmd.exe" -ArgumentList "/c start-server.bat" -WindowStyle Hidden

Write-Host "Деплой выполнен успешно!" 