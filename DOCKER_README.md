# Taqa Full Project - Docker Setup

This project contains a complete Docker Compose setup for the Taqa application with three main services:

- **Frontend**: React/Vite application (port 8080)
- **Backend**: NestJS API (port 5005)
- **Model Service**: FastAPI ML service (port 3000)
- **Database**: PostgreSQL (port 5432)

## Prerequisites

- Docker and Docker Compose installed
- Environment files configured (`.env` files in respective directories)

## Quick Start

### Development Mode
```bash
# Build and start all services in development mode
docker-compose -f docker-compose.yaml -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.yaml -f docker-compose.dev.yml up -d --build
```

### Production Mode
```bash
# Build and start all services in production mode
docker-compose -f docker-compose.yaml -f docker-compose.prod.yml up --build -d
```

### Standard Mode
```bash
# Run with just the main docker-compose.yaml
docker-compose up --build
```

## Service URLs

Once running, you can access:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5005
- **Model Service**: http://localhost:3000
- **Database**: localhost:5432

## Environment Configuration

### Backend (.env in taqathon-back/)
```env
SECRET=your_secret_key_here
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=taqathon
DB_URL=postgresql://postgres:postgres@postgres:5432/taqathon
PORT=5005
FRONT_URL=http://localhost:8080
```

### Frontend (.env in taqathon-front/)
```env
VITE_BACKEND_URL=http://localhost:5005
```

## Common Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nest
docker-compose logs -f react
docker-compose logs -f fastapi
docker-compose logs -f postgres
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes
```bash
docker-compose down -v
```

### Rebuild specific service
```bash
docker-compose build nest
docker-compose up -d nest
```

### Access service shell
```bash
# Backend
docker-compose exec nest sh

# Frontend
docker-compose exec react sh

# Model Service
docker-compose exec fastapi bash

# Database
docker-compose exec postgres psql -U postgres -d taqathon
```

## Database Management

### Initialize/Reset Database
```bash
# Access the backend container
docker-compose exec nest sh

# Run Prisma migrations
npx prisma migrate dev --name init
npx prisma generate
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres taqathon > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres taqathon < backup.sql
```

## Troubleshooting

### Port Conflicts
If you get port conflicts, you can change the external ports in `docker-compose.yaml`:
```yaml
ports:
  - '8081:8080'  # Change external port to 8081
```

### Database Connection Issues
1. Ensure PostgreSQL is healthy: `docker-compose ps`
2. Check database logs: `docker-compose logs postgres`
3. Verify environment variables are correct

### Build Issues
1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache`

### Permission Issues
If you encounter permission issues on macOS/Linux:
```bash
sudo chown -R $(id -u):$(id -g) .
```

## Development vs Production

### Development Features
- Hot reloading for frontend and backend
- Volume mounts for live code changes
- Development-optimized commands

### Production Features
- Optimized builds
- Resource limits
- Better logging configuration
- Production-ready PostgreSQL settings

## Service Health Checks

The setup includes health checks for:
- PostgreSQL (checks if database is ready)
- Backend (checks /health endpoint)
- Model Service (checks /health endpoint)

You can view health status with:
```bash
docker-compose ps
```

## Scaling Services

You can scale services (except database) if needed:
```bash
# Scale backend to 2 instances
docker-compose up -d --scale nest=2

# Scale model service to 3 instances
docker-compose up -d --scale fastapi=3
```

Note: You'll need to configure a load balancer for proper scaling in production.
