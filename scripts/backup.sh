#!/bin/bash
set -e

BACKUP_DIR=${1:-./backups}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME=${DB_NAME:-odfe}
DB_USER=${DB_USER:-odfe}

mkdir -p $BACKUP_DIR

echo "Creating database backup..."
pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_$TIMESTAMP.sql"
echo "Database backup saved to $BACKUP_DIR/db_$TIMESTAMP.sql"

echo "Backing up configuration..."
tar -czf "$BACKUP_DIR/config_$TIMESTAMP.tar.gz" .env.example odoo.conf docker-compose.yml
echo "Configuration backup saved to $BACKUP_DIR/config_$TIMESTAMP.tar.gz"

echo "Backup complete!"
