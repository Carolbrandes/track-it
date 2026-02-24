#!/usr/bin/env bash
# Backup diário do MongoDB (trackit) via Docker.
# Uso: ./backup-mongo.sh   ou   bash backup-mongo.sh
# Cron: 0 3 * * * /caminho/para/backup-mongo.sh

set -e

MONGO_CONTAINER="${MONGO_CONTAINER:-trackit-mongo}"
BACKUP_ROOT="${BACKUP_ROOT:-/root/backups/mongodb}"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_ROOT"
cd "$BACKUP_ROOT"

# Dump dentro do container
docker exec "$MONGO_CONTAINER" mongodump --quiet --out /tmp/dump_"$TIMESTAMP"

# Copiar dump para o host
docker cp "$MONGO_CONTAINER:/tmp/dump_$TIMESTAMP" ./dump_"$TIMESTAMP"

# Limpar dump temporário no container
docker exec "$MONGO_CONTAINER" rm -rf /tmp/dump_"$TIMESTAMP"

# Compactar e nomear com a data
ARCHIVE="trackit-$DATE.tar.gz"
tar czf "$ARCHIVE" -C . dump_"$TIMESTAMP"
rm -rf ./dump_"$TIMESTAMP"

echo "[$(date -Iseconds)] Backup concluído: $BACKUP_ROOT/$ARCHIVE"

# Remover backups com mais de 7 dias
find "$BACKUP_ROOT" -maxdepth 1 -name "trackit-*.tar.gz" -mtime +$RETENTION_DAYS -delete
