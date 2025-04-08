# Диагностика проблемы со статическими файлами
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 1. Проверка путей к проекту
$userFolder = $env:USERPROFILE
Write-Host "Путь к пользовательской папке: $userFolder"

# 2. Попытка найти проект
$projectFolders = Get-ChildItem -Path "$userFolder\Desktop" -Directory | Where-Object { $_.Name -like "*riazanov*" -or $_.Name -like "*mebel*" }
Write-Host "Найдены папки проекта:"
$projectFolders | ForEach-Object { Write-Host $_.FullName }

# 3. Проверяем структуру проекта
if ($projectFolders.Count -gt 0) {
    $projectPath = $projectFolders[0].FullName
    Write-Host "Используем путь: $projectPath"
    
    # Проверка серверной папки
    $serverPath = Join-Path -Path $projectPath -ChildPath "server"
    if (Test-Path $serverPath) {
        Write-Host "Серверная папка найдена: $serverPath"
        
        # Проверка статической папки
        $staticPath = Join-Path -Path $serverPath -ChildPath "static"
        if (Test-Path $staticPath) {
            Write-Host "Папка static найдена: $staticPath"
            
            # Проверка наличия файлов
            $files = Get-ChildItem -Path $staticPath | Select-Object -First 10
            Write-Host "Первые 10 файлов в папке static:"
            $files | ForEach-Object { Write-Host " - $($_.Name)" }
            
            # Создаем тестовый файл
            $testFile = Join-Path -Path $staticPath -ChildPath "test-file.txt"
            "Тестовый файл для проверки доступности" | Out-File -FilePath $testFile
            Write-Host "Создан тестовый файл: $testFile"
        } else {
            Write-Host "Папка static НЕ найдена, создаем её"
            New-Item -Path $staticPath -ItemType Directory
            
            # Создаем тестовый файл
            $testFile = Join-Path -Path $staticPath -ChildPath "test-file.txt"
            "Тестовый файл для проверки доступности" | Out-File -FilePath $testFile
            Write-Host "Создан тестовый файл: $testFile"
        }
    } else {
        Write-Host "Серверная папка НЕ найдена: $serverPath"
    }
    
    # Проверка конфигурации Nginx
    $nginxPath = "C:\nginx\nginx-1.27.4\conf\nginx.conf"
    if (Test-Path $nginxPath) {
        Write-Host "Файл конфигурации Nginx найден: $nginxPath"
        
        # Проверяем запущен ли Nginx
        $nginxProcess = Get-Process -Name "nginx" -ErrorAction SilentlyContinue
        if ($nginxProcess) {
            Write-Host "Nginx запущен"
        } else {
            Write-Host "Nginx НЕ запущен"
        }
    } else {
        Write-Host "Файл конфигурации Nginx НЕ найден: $nginxPath"
    }
} else {
    Write-Host "Не найдено папок проекта"
}

Write-Host "Диагностика завершена" 