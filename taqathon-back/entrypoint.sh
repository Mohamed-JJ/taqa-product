#!/bin/sh
set -e  # Exit on error

echo "📦 [entrypoint] Running Prisma setup..."

# Wait for the DB to be ready (Postgres might take a few seconds to be ready)
echo "⏳ [entrypoint] Waiting for the database to be ready..."
until npx prisma db pull > /dev/null 2>&1; do
  echo "  ↪️ Database not ready, retrying in 2s..."
  sleep 2
done

# Generate Prisma client
echo "⚙️  [entrypoint] Generating Prisma client..."
npx prisma generate

# Apply migrations
echo "🚀 [entrypoint] Applying Prisma migrations..."
npx prisma migrate deploy

# Optionally seed the DB (uncomment if needed)
# echo "🌱 [entrypoint] Seeding the database..."
# npx prisma db seed

echo "✅ [entrypoint] Prisma is ready. Starting the app..."

# Start NestJS app in production mode
exec npm run start:prod
