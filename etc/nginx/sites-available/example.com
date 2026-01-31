server {
    listen 80;
    server_name localhost;
    access_log /var/log/nginx/$server_name.access.log;
    error_log /var/log/nginx/$server_name.error.log;
    root /var/www/$server_name;

    location / {

        proxy_pass http://127.0.0.1:3000;
        index ../../../frontend/html/login.html;
        try_files $uri $uri/ =404;

    }
}