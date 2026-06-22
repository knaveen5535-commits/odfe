#!/bin/bash
set -e

echo "ODFE Cafe POS - Setup Script"
echo "============================"

echo "[1/6] Installing backend dependencies..."
cd backend
npm install
cd ..

echo "[2/6] Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "[3/6] Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

echo "[4/6] Generating Prisma client..."
cd backend
npx prisma generate
cd ..

echo "[5/6] Running database migrations..."
cd backend
npx prisma migrate dev --name init
cd ..

echo "[6/6] Seeding database..."
cd backend
npm run db:seed
cd ..

echo "Setup complete! Run 'docker-compose up' to start services."
