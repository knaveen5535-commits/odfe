# Deployment Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+
- Python 3.10+
- PostgreSQL 15

## Local Development
1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Run `./scripts/setup.sh` to install dependencies
4. Run `docker-compose up -d` to start services
5. Access frontend at http://localhost:3000

## Production Deployment
1. Configure environment variables
2. Run `./scripts/deploy.sh production`
3. NGINX reverse proxy recommended
4. Use managed PostgreSQL for production

## Services
- Frontend: Next.js on port 3000
- Backend API: Express on port 4000
- Odoo: Odoo 17 on port 8069
- PostgreSQL: Port 5432
- Redis: Port 6379 (optional)
