#!/usr/bin/env bash
# Restaura backup do MongoDB (trackit) via Docker.
# Uso: ./restore-mongo.sh /caminho/para/trackit-YYYYMMDD.tar.gz
# Ou:  ./restore-mongo.sh   (usa o backup mais recente em BACKUP_ROOT)

set -e

MONGO_CONTAINER="${MONGO_CONTAINER:-trackit-mongo}"
BACKUP_ROOT="${BACKUP_ROOT:-/root/backups/mongodb}"

# Carregar .env do diretório do script (onde está o docker-compose)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

if [[ ! -f "$ENV_FILE" ]]; then
    echo "Erro: .env não encontrado em $ENV_FILE"
    exit 1
fi

# Carregar credenciais
set -a
source "$ENV_FILE"
set +a

if [[ -z "$MONGO_INITDB_ROOT_USERNAME" || -z "$MONGO_INITDB_ROOT_PASSWORD" ]]; then
    echo "Erro: MONGO_INITDB_ROOT_USERNAME e MONGO_INITDB_ROOT_PASSWORD devem estar no .env"
    exit 1
fi

# Argumento: arquivo de backup ou usar o mais recente
ARCHIVE="${1:-}"
if [[ -z "$ARCHIVE" ]]; then
    LATEST=$(ls -t "$BACKUP_ROOT"/trackit-*.tar.gz 2>/dev/null | head -1 || true)
    if [[ -z "$LATEST" || ! -f "$LATEST" ]]; then
        echo "Erro: Nenhum backup encontrado em $BACKUP_ROOT"
        echo "Uso: $0 /caminho/para/trackit-YYYYMMDD.tar.gz"
        exit 1
    fi
    ARCHIVE="$LATEST"
    echo "Usando backup mais recente: $ARCHIVE"
fi

if [[ ! -f "$ARCHIVE" ]]; then
    echo "Erro: Arquivo não encontrado: $ARCHIVE"
    exit 1
fi

# Extrair e restaurar
RESTORE_DIR=$(mktemp -d)
trap "rm -rf $RESTORE_DIR" EXIT

echo "Extraindo $ARCHIVE..."
tar xzf "$ARCHIVE" -C "$RESTORE_DIR"

# Encontrar o diretório dump_* dentro do extraído
DUMP_DIR=$(find "$RESTORE_DIR" -maxdepth 1 -type d -name "dump_*" | head -1)
if [[ -z "$DUMP_DIR" ]]; then
    echo "Erro: Estrutura de dump inválida no arquivo"
    exit 1
fi

echo "Restaurando em $MONGO_CONTAINER..."
docker cp "$DUMP_DIR" "$MONGO_CONTAINER:/tmp/restore_dump"

docker exec "$MONGO_CONTAINER" mongorestore \
    --uri="mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017" \
    --authSource=admin \
    --drop \
    /tmp/restore_dump

docker exec "$MONGO_CONTAINER" rm -rf /tmp/restore_dump

echo "[$(date -Iseconds)] Restore concluído com sucesso!"
