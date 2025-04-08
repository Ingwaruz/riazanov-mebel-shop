# Скачивание и распаковка Nginx
$url = "https://nginx.org/download/nginx-1.24.0.zip"
$output = "C:\nginx-1.24.0.zip"

# Скачивание
Write-Host "Скачивание Nginx..."
(New-Object System.Net.WebClient).DownloadFile($url, $output)

# Распаковка
Write-Host "Распаковка Nginx..."
Expand-Archive -Path $output -DestinationPath "C:\" -Force

# Копирование файлов из распакованной папки в целевую папку
Write-Host "Копирование файлов..."
Copy-Item -Path "C:\nginx-1.24.0\*" -Destination "C:\nginx\" -Recurse -Force

Write-Host "Готово!" 