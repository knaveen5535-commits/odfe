#!/bin/bash
set -e

echo "ODFE Cafe POS - Deploy Script"
echo "============================="

ENV=${1:-production}
echo "Deploying to $ENV environment..."

echo "[1/4] Building backend..."
cd backend
npm run build
cd ..

echo "[2/4] Building frontend..."
cd frontend
npm run build
cd ..

echo "[3/4] Running database migrations..."
cd backend
npx prisma migrate deploy
cd ..

echo "[4/4] Starting services..."
docker-compose -f docker-compose.yml --env-file .env up -d --build

echo "Deployment complete! Services are running."
