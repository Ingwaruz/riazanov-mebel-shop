# Исправление конфигурации Nginx для статических файлов
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Путь к конфигурационному файлу
$nginxConfigPath = "C:\nginx\nginx-1.27.4\conf\nginx.conf"

# Проверка наличия файла
if (Test-Path $nginxConfigPath) {
    Write-Host "Найден файл конфигурации Nginx: $nginxConfigPath"
    
    # Чтение содержимого
    $configContent = Get-Content -Path $nginxConfigPath -Raw
    
    # Обновление секции static
    $staticPattern = 'location\s+/static/\s+\{[^\}]*\}'
    $newStaticBlock = @"
    location /static/ {
        alias C:/Users/79140/Desktop/Магазин/riazanov-mebel-shop/server/static/;
        autoindex on;
        expires max;
        add_header Cache-Control "public, max-age=31536000";
    }
"@
    
    if ($configContent -match $staticPattern) {
        Write-Host "Блок location /static/ найден, обновляем его"
        $updatedConfig = $configContent -replace $staticPattern, $newStaticBlock
    } else {
        Write-Host "Блок location /static/ не найден, добавляем новый блок"
        
        # Ищем раздел с блоками location
        $serverBlockPattern = 'server\s+\{[^\{]*#\s+SPA[^\{]*(location\s+/\s+\{[^\}]*\})'
        
        if ($configContent -match $serverBlockPattern) {
            $locationBlock = $Matches[1]
            $updatedConfig = $configContent -replace [regex]::Escape($locationBlock), ($newStaticBlock + "`n`n    " + $locationBlock)
        } else {
            Write-Host "Не удалось найти секцию для вставки блока static"
            exit 1
        }
    }
    
    # Сохраняем обновленный файл
    $updatedConfig | Set-Content -Path "$nginxConfigPath.new" -Force
    Write-Host "Создана новая конфигурация: $nginxConfigPath.new"
    
    # Создаем директорию static на сервере, если она не существует
    $staticDir = "C:\Users\79140\Desktop\Магазин\riazanov-mebel-shop\server\static"
    if (-not (Test-Path $staticDir)) {
        Write-Host "Создаем директорию для статических файлов: $staticDir"
        New-Item -Path $staticDir -ItemType Directory -Force | Out-Null
    }
    
    # Создаем тестовый файл
    $testFilePath = Join-Path -Path $staticDir -ChildPath "test-file.txt"
    "Тестовый файл для проверки доступности. Создан: $(Get-Date)" | Set-Content -Path $testFilePath -Force
    Write-Host "Создан тестовый файл: $testFilePath"
    
    Write-Host "Проверьте новую конфигурацию и выполните:"
    Write-Host "1. Переименуйте $nginxConfigPath.new в $nginxConfigPath"
    Write-Host "2. Перезапустите Nginx: C:\nginx\nginx-1.27.4\nginx.exe -s reload"
    Write-Host "3. Проверьте доступность тестового файла: https://domu-mebel.ru/static/test-file.txt"
} else {
    Write-Host "Файл конфигурации Nginx не найден: $nginxConfigPath"
} 