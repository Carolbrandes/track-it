#!/usr/bin/env bash
# Backup diário do MongoDB (trackit) via Docker.
# Envia o dump para storage externo (S3 / Digital Ocean Spaces).
# Uso: ./backup-mongo.sh   ou   bash backup-mongo.sh
# Cron: 0 3 * * * /root/track-it/web/backup-mongo.sh
#
# Requer no .env:
#   MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD
#   Para storage externo: BACKUP_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
#   (Opcional) BACKUP_S3_ENDPOINT para DO Spaces: https://sfo2.digitaloceanspaces.com

set -e

MONGO_CONTAINER="${MONGO_CONTAINER:-trackit-mongo}"
BACKUP_ROOT="${BACKUP_ROOT:-/root/backups/mongodb}"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Carregar .env (mesmo diretório do script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
if [[ -f "$ENV_FILE" ]]; then
    set -a
    source "$ENV_FILE"
    set +a
fi

if [[ -z "$MONGO_INITDB_ROOT_USERNAME" || -z "$MONGO_INITDB_ROOT_PASSWORD" ]]; then
    echo "[$(date -Iseconds)] Erro: MONGO_INITDB_ROOT_USERNAME e MONGO_INITDB_ROOT_PASSWORD devem estar no .env"
    exit 1
fi

mkdir -p "$BACKUP_ROOT"
cd "$BACKUP_ROOT"

# Dump dentro do container (com autenticação)
echo "[$(date -Iseconds)] Iniciando mongodump..."
docker exec "$MONGO_CONTAINER" mongodump --quiet \
    --uri="mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017" \
    --out /tmp/dump_"$TIMESTAMP"

# Copiar dump para o host
docker cp "$MONGO_CONTAINER:/tmp/dump_$TIMESTAMP" ./dump_"$TIMESTAMP"
docker exec "$MONGO_CONTAINER" rm -rf /tmp/dump_"$TIMESTAMP"

# Compactar
ARCHIVE="trackit-$DATE.tar.gz"
tar czf "$ARCHIVE" -C . dump_"$TIMESTAMP"
rm -rf ./dump_"$TIMESTAMP"

echo "[$(date -Iseconds)] Backup local: $BACKUP_ROOT/$ARCHIVE"

# Upload para storage externo (S3 / DO Spaces)
if [[ -n "$BACKUP_S3_BUCKET" && -n "$AWS_ACCESS_KEY_ID" && -n "$AWS_SECRET_ACCESS_KEY" ]]; then
    if command -v aws &>/dev/null; then
        S3_PREFIX="${BACKUP_S3_PREFIX:-trackit-backups}"
        S3_PATH="s3://${BACKUP_S3_BUCKET}/${S3_PREFIX}/${ARCHIVE}"
        EXTRA_ARGS=()
        [[ -n "$BACKUP_S3_ENDPOINT" ]] && EXTRA_ARGS+=(--endpoint-url "$BACKUP_S3_ENDPOINT")
        if aws s3 cp "$ARCHIVE" "$S3_PATH" "${EXTRA_ARGS[@]}"; then
            echo "[$(date -Iseconds)] Upload concluído: $S3_PATH"
        else
            echo "[$(date -Iseconds)] Erro no upload para S3/Spaces"
            exit 1
        fi
    else
        echo "[$(date -Iseconds)] Aviso: aws cli não instalado. Instale com: apt install awscli"
    fi
fi

# Remover backups locais com mais de N dias
find "$BACKUP_ROOT" -maxdepth 1 -name "trackit-*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "[$(date -Iseconds)] Backup concluído."
