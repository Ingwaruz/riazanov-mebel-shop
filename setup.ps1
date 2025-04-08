# Данный скрипт устанавливает и настраивает все необходимое для запуска на домене domu-mebel.ru
# Запустите от имени администратора

# Установка Chocolatey
Write-Host "Установка Chocolatey..."
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Установка Nginx
Write-Host "Установка Nginx..."
choco install nginx -y

# Установка Certbot
Write-Host "Установка Certbot..."
choco install certbot -y

# Копирование конфигурации Nginx
Write-Host "Настройка Nginx..."
Copy-Item -Path ".\nginx.conf" -Destination "C:\tools\nginx\conf\nginx.conf" -Force
New-Item -Path "C:\tools\nginx\conf\sites-enabled" -ItemType Directory -Force
Copy-Item -Path ".\domu-mebel.ru.conf" -Destination "C:\tools\nginx\conf\sites-enabled\domu-mebel.ru.conf" -Force

# Запуск Nginx
Write-Host "Запуск Nginx..."
Start-Process -FilePath "C:\tools\nginx\nginx.exe" -WorkingDirectory "C:\tools\nginx"

# Получение сертификата Let's Encrypt
Write-Host "Получение сертификата Let's Encrypt..."
certbot certonly --standalone --agree-tos --email tawer0228@gmail.com -d domu-mebel.ru -d www.domu-mebel.ru

# Обновление конфигурации Nginx для поддержки HTTPS
Write-Host "Настройка HTTPS..."
$sslConfig = @"
server {
    listen 80;
    server_name domu-mebel.ru www.domu-mebel.ru;
    return 301 https://`$host`$request_uri;
}

server {
    listen 443 ssl;
    server_name domu-mebel.ru www.domu-mebel.ru;

    ssl_certificate "C:/Certbot/live/domu-mebel.ru/fullchain.pem";
    ssl_certificate_key "C:/Certbot/live/domu-mebel.ru/privkey.pem";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
    }

    location /static/ {
        proxy_pass http://localhost:5000/static/;
        proxy_http_version 1.1;
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
    }
}
"@

$sslConfig | Out-File -FilePath "C:\tools\nginx\conf\sites-enabled\domu-mebel.ru.conf" -Encoding utf8 -Force

# Перезапуск Nginx
Write-Host "Перезапуск Nginx..."
Start-Process -FilePath "C:\tools\nginx\nginx.exe" -ArgumentList "-s reload" -WorkingDirectory "C:\tools\nginx"

# Настройка автообновления сертификата
Write-Host "Настройка автоматического обновления сертификата..."
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-Command "certbot renew --quiet; & C:\tools\nginx\nginx.exe -s reload"'
$trigger = New-ScheduledTaskTrigger -Daily -At 3am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "LetsEncryptRenewal" -Description "Обновление сертификата Let's Encrypt" -User "System"

Write-Host "Установка и настройка завершены!"
Write-Host "Теперь нужно запустить серверную и клиентскую части приложения с помощью скриптов start-server.bat и start-client.bat" 