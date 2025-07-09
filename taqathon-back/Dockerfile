FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Generate Prisma client
# RUN npx prisma migrate dev --name "init"
# RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

EXPOSE 5005

ENTRYPOINT ["sh", "./entrypoint.sh"]