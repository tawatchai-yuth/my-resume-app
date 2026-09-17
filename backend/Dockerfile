# ==========================================
# Development
# ==========================================

FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Prisma configuration
COPY prisma.config.ts ./
COPY prisma ./prisma

RUN npx prisma generate --config ./prisma.config.ts

# TypeScript / ESLint configuration
COPY tsconfig.json ./
COPY eslint.config.js ./

# Source code
COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "dev"]