FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .


# Build the application
RUN npm run build

# Remove dev dependencies after build
# RUN npm prune --production

EXPOSE 8080

CMD ["npm", "run", "dev"]