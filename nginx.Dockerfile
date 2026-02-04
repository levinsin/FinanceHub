FROM nginx:latest
LABEL authors="levindocks"

# copy of confs
COPY etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY etc/nginx/conf.d/proxy.conf /etc/nginx/conf.d/proxy.conf
COPY etc/nginx/sites-available/finance-hub.local /etc/nginx/sites-available/finance-hub.com

# Symlinks
RUN mkdir -p /etc/nginx/sites-enabled /etc/nginx/sites-available

RUN ln -sf /etc/nginx/sites-available/finance-hub.local /etc/nginx/sites-enabled/finance-hub.local

#RUN rm /etc/nginx/conf.d/default.conf