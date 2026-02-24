#!/bin/bash
# Rode no servidor (dentro de ~/track-it) para criar nginx/conf.d/default.conf com SSL.
# Uso: bash write-default-conf.sh   ou   bash nginx/conf.d/write-default-conf.sh

set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF="$DIR/default.conf"

# Tirar backup da config antiga do conf.d para não dar "conflicting server name"
for f in "$DIR"/default-http-only-backup.conf; do
  [ -f "$f" ] && mv "$f" "${f}.disabled" && echo "Desativado: $f"
done

cat > "$CONF" << 'ENDOFFILE'
# Redirecionamento HTTP → HTTPS
server {
    listen 80;
    server_name trackit.tec.br www.trackit.tec.br;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS (SSL)
server {
    listen 443 ssl;
    server_name trackit.tec.br www.trackit.tec.br;

    ssl_certificate /etc/letsencrypt/live/trackit.tec.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/trackit.tec.br/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
ENDOFFILE

echo "Arquivo escrito: $CONF"
echo "Recarregue o Nginx: docker compose exec nginx nginx -s reload"
