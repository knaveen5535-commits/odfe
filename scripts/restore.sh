#!/bin/bash
set -e

echo "ODFE Cafe POS - Restore Script"
echo "=============================="

BACKUP_FILE=${1:-""}
DB_NAME=${DB_NAME:-odfe}
DB_USER=${DB_USER:-odfe}

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.sql>"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Restoring database from $BACKUP_FILE..."
psql -U $DB_USER -d $DB_NAME -f "$BACKUP_FILE"
echo "Database restored successfully!"
