# ==========================================
# Development
# ==========================================

FROM node:24-bookworm-slim

WORKDIR /app


# ==========================================
# System Dependencies
# ==========================================

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*


# ==========================================
# Dependencies
# ==========================================

COPY package*.json ./

RUN npm ci


# ==========================================
# Prisma
# ==========================================

COPY prisma.config.ts ./
COPY prisma ./prisma


# ==========================================
# Configuration
# ==========================================

COPY tsconfig.json ./
COPY eslint.config.js ./


# ==========================================
# Source
# ==========================================

COPY src ./src


# ==========================================
# Application
# ==========================================

EXPOSE 3000

CMD ["npm", "run", "dev:docker"]