$nginxConf = @"
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    include sites-enabled/*.conf;
}
"@
$nginxConf | Out-File -FilePath "C:\nginx\conf\nginx.conf" -Encoding utf8

$siteConf = @"
server {
    listen 80;
    server_name domu-mebel.ru www.domu-mebel.ru;

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
$siteConf | Out-File -FilePath "C:\nginx\conf\sites-enabled\domu-mebel.ru.conf" -Encoding utf8 